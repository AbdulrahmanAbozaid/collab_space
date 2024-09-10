import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  profile_picture?: string;
  oauth_provider?: string;
  oauth_id?: string;
  roles: string[];
  notifications: mongoose.Types.ObjectId[]; // Reference to Notification objects
  created_at: Date;
  updated_at: Date;
  last_login?: Date;
  isActive: boolean;
  isDeleted: boolean;

  // Newly added properties for email verification
  passwordChangedAt?: Date;
  resetPasswordExpires?: Date;
  resetPasswordToken?: string;
  verifyEmailOTPToken?: string;
  verifyEmailOTPExpires?: Date;
  forgotPasswordOTP?: string;

  // Methods for handling password comparison and token generation
  comparePassword(candidatePassword: string): Promise<boolean>;
  createPasswordResetToken(): string;
  changedPasswordAfter(JWTTimestamp: number): boolean;
  createForgetPasswordOTP(OTP: string): string;
}

const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false, // Don't return password by default
  },
  profile_picture: String,
  oauth_provider: String,
  oauth_id: String,
  roles: {
    type: [String],
    default: ["editor"],
  },
  notifications: [mongoose.Types.ObjectId],
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  last_login: Date,

  // New properties for verification, password reset, etc.
  verifyEmailOTPToken: String,
  verifyEmailOTPExpires: Date,
  resetPasswordToken: String,
  forgotPasswordOTP: { type: String },
  resetPasswordExpires: Date,
  isActive: {
    type: Boolean,
    default: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

// Middleware for updating `updated_at` field
UserSchema.pre<IUser>("save", function (next) {
  this.updated_at = new Date();
  next();
});

// Password hashing middleware
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Instance method to compare passwords
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if the password has been changed after token issuance
UserSchema.methods.changedPasswordAfter = function (
  JWTTimestamp: number
): boolean {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      (this.passwordChangedAt.getTime() / 1000).toString(),
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Generate password reset token
UserSchema.methods.createPasswordResetToken = function (): string {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // Token expires in 10 minutes

  return resetToken;
};

// Create and store a verification OTP for email
UserSchema.methods.createVerifyEmailOTP = function (OTP: string) {
  this.verifyEmailOTPToken = crypto
    .createHash("sha256")
    .update(OTP)
    .digest("hex");
  this.verifyEmailOTPExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return OTP;
};

// Create and store a forget password OTP
UserSchema.methods.createForgetPasswordOTP = function (OTP: string) {
  this.forgotPasswordOTP = crypto
    .createHash("sha256")
    .update(OTP)
    .digest("hex");
  this.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return OTP;
};

// Create and store a password reset token
UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return resetToken;
};

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
