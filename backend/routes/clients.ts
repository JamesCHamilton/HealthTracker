// @deno-types="npm:@types/express@4.17.15"
import express from "npm:express";
import { Request, Response } from "npm:express";
import { verifyToken, generateToken } from "../jwtMiddleware.ts";
import Client from "../schemas/Client.ts";
import bcryptjs from "npm:bcryptjs";
import { isMongoError } from "../utils/MongoErrorChecker.ts";

const router = express.Router();

// Create new client (Deno compatible)
router.post("/", async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Validate password length
        if (password.length < 8) {
            return res.status(400).json({ error: "Password must be at least 8 characters" });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        const client = new Client({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        await client.save();

        // Remove sensitive data from response
        const clientData = client.toObject();
        delete clientData.password;

        res.status(201).json({ message: "Client created successfully", client: clientData });
    } catch (error) {
        console.error("Registration error:", error);

        if (isMongoError(error)) {
            if (error.code === 11000) {
                const duplicateField = Object.keys(error.keyValue)[0];
                return res.status(409).json({ error: `${duplicateField} already exists` });
            }
            // Add explicit type check for ValidationError
            if ('errors' in error && typeof error.errors === 'object' && error.errors !== null) {
                const messages = Object.values(error.errors).map((err: { message?: string }) => 
                    err.message ? err.message : "Validation error"
                );
                return res.status(400).json({ errors: messages });
            }
        }

        res.status(500).json({ error: "Internal server error" });
    }
});

// Login route (Deno compatible)
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password required" });
        }

        const client = await Client.findOne({ email }).select("+password");
        if (!client) {
            return res.status(404).json({ error: "User not found" });
        }

        const passwordValid = await bcryptjs.compare(password, client.password);
        if (!passwordValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Generate JWT token
        const token = await generateToken(client);

        // Configure secure cookies for Deno
        res.cookie("token", token, {
            httpOnly: true,
            secure: Deno.env.get("DENO_ENV") === "production",
            sameSite: "strict",
            maxAge: 5 * 60 * 60 * 1000, // 5 hours
            path: "/",
        });

        // Return user data without sensitive information
        const userData = {
            id: client._id,
            firstName: client.firstName,
            lastName: client.lastName,
            email: client.email
        };

        res.status(200).json({ 
            message: "Login successful", 
            user: userData 
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post('/logs', verifyToken, async (req: Request, res: Response) => {
    try {
        const clientId = req.user?._id;
        const { weight, strengthProgress } = req.body;

        // Validate required fields
        if (!weight || !strengthProgress?.length) {
            return res.status(400).json({ 
                error: "Weight and at least one strength measurement required" 
            });
        }

        const newLog = {
            date: new Date(),
            weight: Number(weight),
            strengthProgress: strengthProgress.map((sp: { exercise: string; maxWeight: number }) => ({
                exercise: sp.exercise,
                maxWeight: Number(sp.maxWeight)
            }))
        };

        const updatedClient = await Client.findByIdAndUpdate(
            clientId,
            { $push: { progressLogs: newLog } },
            { new: true, select: '-password' }
        );

        if (!updatedClient) {
            return res.status(404).json({ error: "Client not found" });
        }

        res.status(201).json({
            message: "Log added successfully",
            newLog,
            totalLogs: updatedClient.progressLogs.length
        });

    } catch (error) {
        console.error("Log error:", error);
        
        if (isMongoError(error) && error.name === 'ValidationError') {
            const messages = Object.values(error.errors as { [key: string]: { message?: string } }).map((err: { message?: string }) => err.message);
            return res.status(400).json({ errors: messages });
        }
        
        res.status(500).json({ error: "Failed to add log" });
    }
});

router.put('/goals', verifyToken, async (req: Request, res: Response) => {
    try {
        const clientId = req.user?._id;
        const { calories, protein, carbs, fats } = req.body;

        // Validate at least one goal is provided
        if (!calories && !protein && !carbs && !fats) {
            return res.status(400).json({ error: "No goals provided" });
        }

        const updates: Record<string, number> = {};
        if (calories) updates['targetGoals.calories'] = Number(calories);
        if (protein) updates['targetGoals.macros.protein'] = Number(protein);
        if (carbs) updates['targetGoals.macros.carbs'] = Number(carbs);
        if (fats) updates['targetGoals.macros.fats'] = Number(fats);

        const updatedClient = await Client.findByIdAndUpdate(
            clientId,
            { $set: updates },
            { new: true, runValidators: true, select: '-password' }
        );

        if (!updatedClient) {
            return res.status(404).json({ error: "Client not found" });
        }

        res.status(200).json({
            message: "Goals updated successfully",
            goals: updatedClient.targetGoals
        });

    } catch (error) {
        console.error("Goals error:", error);
        
        if (isMongoError(error)) {
            if (error.name === 'ValidationError') {
                const messages = Object.values(error.errors as { [key: string]: { message?: string } }).map((err: { message?: string }) => err.message);
                return res.status(400).json({ errors: messages });
            }
            if (error.code === 11000) {
                return res.status(409).json({ error: "Conflict in goal settings" });
            }
        }
        
        res.status(500).json({ error: "Failed to update goals" });
    }
});

// Add to your existing routes
router.get('/profile', verifyToken, async (req: Request, res: Response) => {
    try {
        // Get client ID from verified token
        const clientId = req.user?._id;
        
        // Find client excluding password
        const client = await Client.findById(clientId)
            .select('-password')
            .lean();

        if (!client) {
            return res.status(404).json({ error: "Client not found" });
        }

        res.status(200).json({
            message: "Profile retrieved successfully",
            profile: {
                _id: client._id,
                firstName: client.firstName,
                lastName: client.lastName,
                email: client.email,
                targetGoals: client.targetGoals,
                workoutSchedule: client.workoutSchedule,
                progressLogs: client.progressLogs
            }
        });
        
    } catch (error) {
        console.error("Profile error:", error);
        
        if (isMongoError(error)) {
            return res.status(400).json({ error: "Invalid client ID format" });
        }
        
        res.status(500).json({ error: "Failed to retrieve profile" });
    }
});