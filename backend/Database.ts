// database.ts
import { Collection, Document, ObjectId, Database as _Database } from "https://deno.land/x/mongo@v0.32.0/mod.ts";
import { Client } from "./schemas/Client.ts";

export interface Database {
  collection<T extends Document>(name: string): Collection<T>;
}

export interface ClientDocument extends Client {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}