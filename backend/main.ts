// @ts-types="npm:express@^4.21.2"
import express, {Response } from "express";
import mongoose from "npm:mongoose@^6.7";
import cors from "npm:cors";
import cookieParser from "npm:cookie-parser";

const app = express();
const mongoConnectString = Deno.env.get("MONGO_URL")! //mongoString

//api connection test
app.get("/", (res:Response) => {
  res.send("Welcome to the Dinosaur API!");
});

//connecting to MongoDB server
mongoose.connect(mongoConnectString
).then(() => console.log("DB has connected")
).catch((error) => console.log("DB connection error has occurred: ", error.message))

const corsOptions = {
  origin: "http://localhost:3000", // Allow requests from this origin
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allowed HTTP methods
  credentials: true, // Enable cookies and authentication headers
}

app.use(cors(corsOptions)); //using cors for stopping non auth access
app.use(cookieParser());
app.use(express.json());

//start listening to the port
const PORT = Deno.env.get("PORT");
app.listen(PORT)
console.log(`Server is running on http://localhost:`, PORT)
