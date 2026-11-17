import { Router } from "express";
const app: Router = Router();
import authRoutes from "./Users/auth.routes";
import userRoutes from "./Users/user.routes";
import documentRoutes from "./documents/documents.routes";

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/documents", documentRoutes);

export default app;
