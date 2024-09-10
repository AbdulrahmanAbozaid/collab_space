import { Router } from "express";
const app: Router = Router();
import authRoutes from "./Users/auth.routes";
import userRoutes from "./Users/user.routes";

app.use("/auth", authRoutes);
app.use("/user", userRoutes);

export default app;
