import "reflect-metadata";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import sequelize from "./db";
import { env } from "./config/env";

import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import productRoutes from "./routes/products";
import cartRoutes from "./routes/cart";
import categoryRoutes from "./routes/categories";
import orderRoutes from "./routes/orders";
import deliveryRoutes from "./routes/deliveries";
import paymentRoutes from "./routes/payments";
import userRatingRoutes from "./routes/userRatings";
import adminRoutes from "./routes/admin";

const app = express();

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/categories", categoryRoutes);
app.use("/orders", orderRoutes);
app.use("/deliveries", deliveryRoutes);
app.use("/payments", paymentRoutes);
app.use("/ratings", userRatingRoutes);
app.use("/admin", adminRoutes);

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
