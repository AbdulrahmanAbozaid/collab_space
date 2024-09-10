// Import necessary modules and classes
import { Request, Response, NextFunction, RequestHandler } from "express";
import crypto from "crypto";
import userRepo from "../models/userRepo";
import User from "../models/User";
import sendEmail from "../utils/emailService";
import asyncHandler from "../middlewares/asyncHandler";
import AppError from "../utils/appError";
import { generateToken } from "../utils/tokens";

// Define the AuthController class
class AuthController {
  // Function to create and send JWT token
  private async createSendToken(
    user: any
  ): Promise<{ token: string; user: any }> {
    const token = await generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: {
        ...user.toObject(),
        password: undefined,
      },
    };
  }

  // Function to handle user signup
  public register: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      // Check for duplicate email
      const existingEmailUser = await userRepo.findByEmail(req.body.email);
      if (existingEmailUser) {
        throw new AppError("Email already in use", 400);
      }

      // Create new user
      const newUser = await userRepo.create(req.body);

      // Send verification OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      console.log("[OTP]: ", otp);

      newUser.verifyEmailOTPToken = otp;
      newUser.verifyEmailOTPExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes
      await newUser.save();

      const message = `Your verification OTP is: ${otp}`;
      await sendEmail(newUser.email, "Email Verification", message);

      res.status(201).json({
        success: true,
        message: "User registered. Verify your email.",
      });
    }
  );

  // Function to handle user login
  public login: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email, password } = req.body;

      // Find user by email
      const user = await userRepo.findByEmail(email);
      if (!user || !(await user.comparePassword(password))) {
        throw new AppError("Invalid email or password", 401);
      }

      // Check if email is verified
      if (!user.isActive) {
        throw new AppError("Please verify your email before logging in", 403);
      }

      // Create and send token
      const { token, user: userData } = await this.createSendToken(user);
      res.status(200).json({ success: true, token, user: userData });
    }
  );

  // Function to handle email verification
  public verifyEmail: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email } = req.body;
      const { OTP: otp } = req.params;

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        throw new AppError("User not found", 404);
      }

      // Check if the OTP matches
      if (
        user.verifyEmailOTPToken !== otp ||
        !user?.verifyEmailOTPExpires ||
        user?.verifyEmailOTPExpires < new Date()
      ) {
        throw new AppError("Invalid or expired OTP", 400);
      }

      // Verify the email
      user.isActive = true;
      user.verifyEmailOTPToken = undefined;
      user.verifyEmailOTPExpires = undefined;
      await user.save();

      res
        .status(200)
        .json({ success: true, message: "Email verified successfully" });
    }
  );

  // Function to resend email verification OTP
  public resendVerifyOTPEmail: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email } = req.body;

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        throw new AppError("User not found", 404);
      }

      // Generate new OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      user.verifyEmailOTPToken = otp;
      user.verifyEmailOTPExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes
      await user.save();

      // Send OTP email
      const message = `Your verification OTP is: ${otp}`;
      await sendEmail(user.email, "Email Verification", message);

      res.status(200).json({
        success: true,
        message: "Verification OTP resent successfully",
      });
    }
  );

  // Function to handle password reset request
  public forgotPassword: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = await userRepo.findByEmail(req.body.email);
      if (!user) {
        throw new AppError("No user found with this email address", 404);
      }

      // Generate OTP for password reset
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      await user.createForgetPasswordOTP(otp);
      await user.save({ validateBeforeSave: false });

      const message = `Your password reset OTP is: ${otp}`;
      console.log("OTP: ", otp);

      await sendEmail(user.email, "Password Reset OTP", message);

      res.status(200).json({ success: true, message: "OTP sent to email" });
    }
  );

  // Function to verify password reset OTP
  public verifyForgotPasswordOTP: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const hashedOTP = crypto
        .createHash("sha256")
        .update(req.params.OTP)
        .digest("hex");

      const user = await User.findOne({
        forgotPasswordOTP: hashedOTP,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!user) {
        throw new AppError("Invalid or expired OTP", 401);
      }

      const resetToken = (user as any).createPasswordResetToken();
      await user.save({ validateBeforeSave: false });

      res.status(200).json({ success: true, token: resetToken });
    }
  );

  // Function to handle password reset
  public resetPassword: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const hashedToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!user) {
        throw new AppError("Invalid or expired token", 400);
      }

      user.password = req.body.password;
      user.resetPasswordToken = undefined;
      await user.save();

      const { token: newToken, user: userData } = await this.createSendToken(
        user
      );
      res.status(200).json({ success: true, token: newToken, user: userData });
    }
  );

  // Function to change password for logged-in users
  public changePassword: RequestHandler = asyncHandler(
    async (req: Request & { user: any }, res: Response, next: NextFunction) => {
      const { password, newPassword } = req.body;

      // Find user by ID
      const user = await User.findById(req.user.id).select("+password");
      if (!user || !(await user.comparePassword(password))) {
        throw new AppError("Incorrect current password", 400);
      }

      // Update password
      user.password = newPassword;
      await user.save();

      res
        .status(200)
        .json({ success: true, message: "Password changed successfully" });
    }
  );
}

export default new AuthController();
