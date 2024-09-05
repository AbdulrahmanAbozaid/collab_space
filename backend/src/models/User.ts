import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

// Define the interface for the User schema
interface IUser extends Document {
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
  passwordChangedAt?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  isActive: boolean;
  isDeleted: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
  createPasswordResetToken(): string;
  changedPasswordAfter(JWTTimestamp: number): boolean;
}

// Define the User schema
const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: [true, "Please provide your username"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    select: false,
  },
  profile_picture: { type: String },
  oauth_provider: { type: String },
  oauth_id: { type: String },
  roles: { type: [String], default: ["editor"] },
  notifications: [{ type: Schema.Types.ObjectId, ref: 'Notification' }], // Reference to the Notification model
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  last_login: { type: Date },
  passwordChangedAt: { type: Date },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
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

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
