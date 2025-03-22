// schemas/ProgressLog.ts
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.32.0/mod.ts";

// TypeScript Interface
export interface ProgressLog {
  _id?: ObjectId;
  client: ObjectId;
  date: Date;
  weight: number;
  strengthProgress: StrengthProgress[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface StrengthProgress {
  exercise: string;
  maxWeight: number;
  reps?: number;
}

// Zod Validation Schema
export const ProgressLogSchema = z.object({
  client: z.instanceof(ObjectId).or(z.string().transform(v => new ObjectId(v))),
  date: z.date().default(() => new Date()),
  weight: z.number().min(0),
  strengthProgress: z.array(
    z.object({
      exercise: z.string().min(1),
      maxWeight: z.number().min(0),
      reps: z.number().min(0).optional(),
    })
  ),
  notes: z.string().max(500).optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

// Helper type for validated data
export type ProgressLogData = z.infer<typeof ProgressLogSchema>;