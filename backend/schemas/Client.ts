// schemas/Client.ts
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.32.0/mod.ts";

// Base Zod schema without refinements
export const baseSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8).optional(),
  emailVerified: z.boolean().default(false),
  googleId: z.string().optional(),
  authMethod: z.enum(["local", "google"]).default("local"),
  verificationToken: z.string().optional(),
  verificationExpires: z.date().optional(),
  targetGoals: z.object({
    calories: z.number().optional(),
    macros: z.object({
      protein: z.number().optional(),
      carbs: z.number().optional(),
      fats: z.number().optional(),
    }).optional(),
  }).optional(),
  workoutSchedule: z.array(
    z.object({
      day: z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]),
      exercises: z.array(
        z.object({
          name: z.string(),
          sets: z.number().min(1),
          reps: z.number().min(1),
          weight: z.number().min(0),
        })
      ),
    })
  ).optional(),
  logs: z.array(z.instanceof(ObjectId)).optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

// Refined schema with validation
export const ClientSchema = baseSchema.refine(
  (data) => data.authMethod === "local" ? !!data.password : true,
  {
    message: "Password is required for local authentication",
    path: ["password"],
  }
);

export const ClientCreateSchema = baseSchema.omit({ 
  _id: true, 
  createdAt: true, 
  updatedAt: true 
}).extend({
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

// Export types
export type Client = z.infer<typeof baseSchema>;
export type ClientDocument = Client & { _id: ObjectId };
export type ClientData = z.infer<typeof ClientSchema>;
export type ClientCreate = z.infer<typeof ClientCreateSchema>;
