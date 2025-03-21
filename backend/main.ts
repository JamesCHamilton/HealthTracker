// @ts-types="npm:express@^4.21.2"
import express, { Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import { router as ClientRouter } from "./routes/clients.ts";
import { router as GoogleAuthRouter } from "./routes/auth.ts";
import { config } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";
config({ export: true });

const app = express();
const mongoConnectString = Deno.env.get("MONGO_URL")!; //mongoString

//api connection test
app.get("/", (res: Response) => {
  res.send("Welcome to the Dinosaur API!");
});

console.log(mongoConnectString);

await mongoose
  .connect(mongoConnectString)
  .then(() => console.log("DB connected!"))
  .catch((error) => console.log("DB connection error:", error.message));

mongoose.connection.on("connecting", () => console.log("Connecting to MongoDB..."));
mongoose.connection.on("connected", () => console.log("MongoDB connected!"));
mongoose.connection.on("disconnected", () => console.log("MongoDB disconnected!"));


const corsOptions = {
  origin: "http://localhost:3000", // Allow requests from this origin
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allowed HTTP methods
  credentials: true, // Enable cookies and authentication headers
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions)); //using cors for stopping non auth access
app.use(cookieParser());
app.use(express.json());

app.use("/clients", ClientRouter); //client routes
app.use("/auth", GoogleAuthRouter); //google auth routes

//start listening to the port
const PORT = Deno.env.get("PORT");

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
