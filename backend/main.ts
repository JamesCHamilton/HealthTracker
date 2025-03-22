// @ts-types="npm:express@^4.21.2"
import express, { Response } from "express";
import { MongoClient } from "https://deno.land/x/mongo@v0.32.0/mod.ts";
import cors from "cors";
import cookieParser from "cookie-parser";
import { router as ClientRouter } from "./routes/clients.ts";
import { router as GoogleAuthRouter } from "./routes/auth.ts";
import { config } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";

config({ export: true });

const app = express();
const mongoConnectString = Deno.env.get("MONGO_URL")!;

// Database connection setup
const client = new MongoClient();
let db: ReturnType<MongoClient["database"]>;

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await client.connect(mongoConnectString);
    db = client.database("your-database-name"); // Replace with your DB name
    console.log("MongoDB connected!");
  } catch (error) {
    console.log("DB connection error:", (error as Error).message);
    Deno.exit(1);
  }
};

// API connection test
app.get("/", (res: Response) => {
  res.send("Welcome to the Dinosaur API!");
});

// Database connection
await connectDB(); // Wait for connection before proceeding

const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

// Pass database to routes (modify your routes to accept db)
app.use("/clients", ClientRouter(db!));
app.use("/auth", GoogleAuthRouter(db!));

// Start server
const PORT = Deno.env.get("PORT") || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});