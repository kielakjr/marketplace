import "reflect-metadata";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import sequelize from "./db";
import { env } from "./config/env";

// Routes
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import productRoutes from "./routes/products";

const app = express();

// ===== MIDDLEWARE =====

// CORS – pozwala frontendowi wysyłać cookies
app.use(
  cors({
    origin: env.FRONTEND_URL,  // http://localhost:5173
    credentials: true,          // Pozwala na cookies cross-origin
  })
);

// Parse cookies (potrzebne do odczytu HttpOnly cookie z JWT)
app.use(cookieParser());

// Parse JSON body
app.use(express.json());

// ===== ROUTES =====
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/products", productRoutes);

// ===== DB SYNC =====
const initialize = async () => {
  try {
    await sequelize.sync();
    console.log("Database initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize database:", error);
  }
};

initialize();

export default app;
