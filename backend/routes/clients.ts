// @deno-types="npm:@types/express@4.17.15"
import express from "npm:express";
import { Request, Response } from "npm:express";
import type { ClientDocument } from "../Database.ts";
import { generateToken, verifyToken } from "../jwtMiddleware.ts";
import { baseSchema } from "../schemas/Client.ts";
import {
  type ProgressLogData,
  ProgressLogSchema,
} from "../schemas/ProgressLog.ts";
import bcryptjs from "npm:bcryptjs";
import { Database, ObjectId } from "https://deno.land/x/mongo@v0.32.0/mod.ts";
import { sendWelcomeEmail } from "../utils/Emailer.ts";
import { crypto } from "https://deno.land/std@0.224.0/crypto/mod.ts";
import { config } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";

config({ export: true });

export const router = (db: Database) => {
  const router = express.Router();
  const clientsCollection = db.collection<ClientDocument>("clients");
  const progressLogsCollection = db.collection<ProgressLogData>("progressLogs");
  // Create new client route
  router.post("/", async (req: Request, res: Response) => {
    try {
      const { firstName, lastName, email, password } = req.body;

      // Validate input with required password check
      const parsedData = baseSchema
        .required({ password: true })
        .partial({
          verificationToken: true,
          verificationExpires: true,
          emailVerified: true,
          logs: true,
        })
        .refine(
          (data) => data.authMethod === "local" ? !!data.password : true,
          {
            message: "Password is required for local authentication",
            path: ["password"],
          },
        )
        .parse({
          firstName,
          lastName,
          email,
          password,
          verificationToken: crypto.randomUUID(),
          verificationExpires: new Date(Date.now() + 60 * 60 * 1000),
        });
      // Check for existing user
      const existingClient = await clientsCollection.findOne({ email });
      if (existingClient) {
        return res.status(409).json({ error: "Email already exists" });
      }

      // Hash password (now guaranteed to exist)
      const hashedPassword = await bcryptjs.hash(parsedData.password, 10);

      // Create insert document with explicit password
      const insertDoc = {
        ...parsedData,
        password: hashedPassword,
        emailVerified: parsedData.emailVerified ?? false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Insert new client
      const insertId = await clientsCollection.insertOne(insertDoc);

      // Get the created client using correct insertResult property
      const newClient = await clientsCollection.findOne({
        _id: insertId,
      });

      // Send verification email
      try {
        await sendWelcomeEmail({
          email: newClient!.email,
          firstName: newClient!.firstName,
          verificationToken: newClient!.verificationToken!,
        });
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
      }

      // Sanitize response
      const {
        password: _,
        verificationToken: _verificationToken,
        verificationExpires: _verificationExpires,
        ...clientData
      } = newClient!;

      return res.status(201).json({
        message: "Client created successfully",
        client: clientData,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Login route
  router.post("/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
      }

      const client = await clientsCollection.findOne({ email });
      if (!client) {
        return res.status(404).json({ error: "User not found" });
      }

      const passwordValid = client.password
        ? await bcryptjs.compare(password, client.password)
        : false;
      if (!passwordValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = await generateToken({
        _id: client._id!.toString(),
        email: client.email,
        firstName: client.firstName,
        lastName: client.lastName,
      });

      res.cookie("token", token, {
        httpOnly: true,
        secure: Deno.env.get("DENO_ENV") === "production",
        sameSite: "strict",
        maxAge: 5 * 60 * 60 * 1000,
        path: "/",
      });

      const { password: _, ...userData } = client;
      res.status(200).json({
        message: "Login successful",
        user: userData,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Client updates log
  router.post("/logs", verifyToken, async (req: Request, res: Response) => {
    try {
      const clientId = new ObjectId(req.user?._id);
      const { weight, strengthProgress, notes } = req.body;

      if (!weight || !strengthProgress?.length) {
        return res.status(400).json({
          error: "Weight and at least one strength measurement required",
        });
      }

      const logData = ProgressLogSchema.parse({
        client: clientId,
        weight: Number(weight),
        strengthProgress: strengthProgress.map((
          sp: { exercise: string; maxWeight: number; reps?: number },
        ) => ({
          exercise: sp.exercise,
          maxWeight: Number(sp.maxWeight),
          reps: sp.reps ? Number(sp.reps) : undefined,
        })),
        notes,
      });

      const insertResult = await progressLogsCollection.insertOne(logData) as {
        insertedId: ObjectId;
      };

      await clientsCollection.updateOne(
        { _id: clientId },
        { $push: { logs: insertResult.insertedId } },
      );

      res.status(201).json({
        message: "Log added successfully",
        newLog: { ...logData, _id: insertResult.insertedId },
      });
    } catch (error) {
      console.error("Log error:", error);
      res.status(500).json({ error: "Failed to add log" });
    }
  });

  // Update goals
  router.put("/goals", verifyToken, async (req: Request, res: Response) => {
    try {
      const clientId = new ObjectId(req.user?._id);
      const { calories, protein, carbs, fats } = req.body;

      if (!calories && !protein && !carbs && !fats) {
        return res.status(400).json({ error: "No goals provided" });
      }

      const updates: {
        targetGoals?: {
          calories?: number;
          macros?: { protein?: number; carbs?: number; fats?: number };
        };
      } = {};
      if (calories) {
        updates.targetGoals = {
          ...updates.targetGoals,
          calories: Number(calories),
        };
      }
      if (protein || carbs || fats) {
        updates.targetGoals = {
          ...updates.targetGoals,
          macros: {
            ...updates.targetGoals?.macros,
            ...(protein && { protein: Number(protein) }),
            ...(carbs && { carbs: Number(carbs) }),
            ...(fats && { fats: Number(fats) }),
          },
        };
      }

      const result = await clientsCollection.updateOne(
        { _id: clientId },
        { $set: updates },
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Client not found" });
      }

      const updatedClient = await clientsCollection.findOne({ _id: clientId });
      res.status(200).json({
        message: "Goals updated successfully",
        goals: updatedClient?.targetGoals,
      });
    } catch (error) {
      console.error("Goals error:", error);
      res.status(500).json({ error: "Failed to update goals" });
    }
  });

  // Get profile
  router.get("/profile", verifyToken, async (req: Request, res: Response) => {
    try {
      const clientId = new ObjectId(req.user?._id);
      const client = await clientsCollection.findOne(
        { _id: clientId },
        { projection: { password: 0 } },
      );

      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }

      res.status(200).json({
        message: "Profile retrieved successfully",
        profile: client,
      });
    } catch (error) {
      console.error("Profile error:", error);
      res.status(500).json({ error: "Failed to retrieve profile" });
    }
  });

  // Get logs
  router.get("/logs", verifyToken, async (req: Request, res: Response) => {
    try {
      const logs = await progressLogsCollection.find({
        client: new ObjectId(req.user?._id),
      })
        .sort({ date: -1 })
        .limit(30)
        .toArray();

      res.json({
        count: logs.length,
        logs,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to retrieve logs" });
    }
  });

  // Verify email
  router.get("/verify-email", async (req: Request, res: Response) => {
    try {
      const { token } = req.query;
      const client = await clientsCollection.findOne({
        verificationToken: token as string,
        verificationExpires: { $gt: new Date() },
      });

      if (!client) {
        return res.status(400).json({ error: "Invalid or expired token" });
      }

      await clientsCollection.updateOne(
        { _id: client._id },
        {
          $set: { emailVerified: true },
          $unset: {
            verificationToken: undefined,
            verificationExpires: undefined,
          },
        },
      );

      res.json({ message: "Email has been verified successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to verify email" });
    }
  });

  return router;
};
