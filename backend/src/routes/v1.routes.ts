import { Router } from "express";
const app: Router = Router();
import authRoutes from './Users/auth.routes';
import { protect } from "../controllers/authController";


app.use('/auth', authRoutes);
app.use(protect); // Protect all routes after this middleware

export default app;
