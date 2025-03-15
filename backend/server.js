import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Log MongoDB URL (for debugging)
console.log("MongoDB URL:", process.env.MONGO_URL);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected!"))
  .catch((error) => console.log("DB connection error:", error.message));

// CORS configuration
const corsOptions = {
  origin: "http://localhost:3000", // Allow requests from this origin
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allowed HTTP methods
  credentials: true, // Enable cookies and authentication headers
};

// Middleware setup
app.use(cors(corsOptions)); // Enable CORS with the specified options
app.use(cookieParser()); // Parse cookies
app.use(express.json()); // Parse JSON request bodies

// // Routes
// app.use("/trainers", TrainerRouter); // Trainer routes
// app.use("/clients", ClientRouter); // Client routes
// app.use("/logs",LogRouter )// Log routes
// app.use("/api", APIHandler); // API routes

// Example route for testing
app.get("/", (req, res) => {
  res.send("Express.js with WebSocket!");
});


// Start the server
const PORT = process.env.PORT || 3001; // Use environment variable for port or default to 3001
const expressServer = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});