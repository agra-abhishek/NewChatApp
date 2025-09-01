// server.js
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import userRoute from './routes/userRoute.js';
import cors from "cors";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());
const allowedOrigins = [
  "http://localhost:5500", 
  "http://127.0.0.1:5500",
  "https://newchatapp-1334.onrender.com","https://newchatapp-199.onrender.com"  // Add frontend Render URL later in .env
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// Root route (server health check)
app.get("/", (req, res) => {
  res.send("🚀 Server is running successfully!");
});

// Routes
app.use("/api/v1/user", userRoute);

// Start server only after DB is connected
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();
