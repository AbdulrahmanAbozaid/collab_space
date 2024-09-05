import express from "express";
import * as authController from "../controllers/authController";

const router = express.Router();

router.post("/signup", authController.register);
router.post("/login", authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

// Define other protected routes here

export default router;
