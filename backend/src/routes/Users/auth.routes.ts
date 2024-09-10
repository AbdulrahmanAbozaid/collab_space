import { Router } from "express";
import AuthController from "../../controllers/authController";
import { authorize } from "../../utils/auth";

const router = Router();

// POST /api/v1/users/signup
router.post("/register", AuthController.register);

// POST /api/v1/users/login
router.post("/login", AuthController.login);

// POST /api/v1/users/forgot-password
router.post("/forgot-password", AuthController.forgotPassword);

// POST /api/v1/users/verify-forgot-password-otp/:OTP
router.post(
  "/verify-forgot-password-otp/:OTP",
  AuthController.verifyForgotPasswordOTP
);

router.post(
  "/verify-email/:OTP",
  AuthController.verifyEmail
);

router.post(
  "/resend-verify-email-otp",
  AuthController.resendVerifyOTPEmail
);

// POST /api/v1/users/reset-password/:token
router.post("/reset-password/:token", AuthController.resetPassword);

// PATCH /api/v1/users/password
router.post("/password/me", authorize, AuthController.changePassword);

export default router;
