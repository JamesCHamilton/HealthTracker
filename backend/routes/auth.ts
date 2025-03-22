// auth.ts
import { Router } from "npm:express";
import { Request, Response } from "npm:express";
import { getGoogleAuthUrl, handleGoogleCallback } from "../utils/googleAuth.ts";
import { generateToken } from "../jwtMiddleware.ts";
import { config } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.32.0/mod.ts";
import { ClientSchema, ClientCreateSchema } from "../schemas/Client.ts";
import { ClientDocument, Database } from "../Database.ts";
config({ export: true });

export const router = (db: Database) => {
  const router = Router();
  const clientsCollection = db.collection<ClientDocument>("clients");

  router.get("/google", (res: Response) => {
    res.redirect(getGoogleAuthUrl());
  });

  router.get("/google/callback", async (req: Request, res: Response) => {
    try {
      const { code } = req.query;
      if (!code) throw new Error("No code provided");

      const tokens = await handleGoogleCallback(code.toString());
      const userInfo = await fetch(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        },
      );
      const googleUser = await userInfo.json();

      if (!googleUser?.email || !googleUser?.id) {
        throw new Error("Incomplete user data from Google");
      }

      const existingClient = await clientsCollection.findOne({
        $or: [{ email: googleUser.email }, { googleId: googleUser.id }],
      });

      let clientId: ObjectId;
      if (!existingClient) {
        // Create unvalidated client document with base schema
        const newClient = ClientCreateSchema.parse({
          googleId: googleUser.id,
          email: googleUser.email,
          firstName: googleUser.given_name || "Unknown",
          lastName: googleUser.family_name || "Unknown",
          emailVerified: true,
          authMethod: "google",
          password: undefined,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      
        // Validate against refined schema
        const validatedClient = ClientSchema.parse(newClient);
      
        // Insert and get ObjectId directly
        clientId = await clientsCollection.insertOne(validatedClient);
      } else {
        clientId = existingClient._id!;
      }

      const client = await clientsCollection.findOne({ _id: clientId });
      if (!client) throw new Error("Client not found");

      const token = await generateToken({
        _id: clientId.toString(),
        email: client.email,
        firstName: client.firstName,
        lastName: client.lastName,
      });

      res.cookie("token", token, {
        httpOnly: true,
        secure: Deno.env.get("DENO_ENV") === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite: "lax",
        path: "/",
      });

      res.redirect("/dashboard");
    } catch (error) {
      console.error("Google Auth error:", error);
      res.redirect(`/signin?error=google_auth_failed`);
    }
  });

  return router;
};
