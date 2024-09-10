import User, { IUser } from "./User";
import { FilterQuery, UpdateQuery } from "mongoose";

class UserRepository {
  // Find a user by their email address
  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email }).select("+password");
  }

  // Find a user by ID
  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id).populate('notifications');
  }

  // Create a new user
  async create(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return await user.save();
  }

  // Find a user by a specific filter (e.g., username or OAuth ID)
  async findByFilter(filter: FilterQuery<IUser>): Promise<IUser | null> {
    return await User.findOne(filter);
  }

  // Update user data
  async updateById(id: string, updateData: UpdateQuery<IUser>): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Ensure that the update respects schema validation
    });
  }

  // Find a user by reset password token
  async findByResetToken(token: string): Promise<IUser | null> {
    return await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Ensure the token hasn't expired
    });
  }

  // Find a user by an OAuth provider and ID
  async findByOAuth(oauthProvider: string, oauthId: string): Promise<IUser | null> {
    return await User.findOne({ oauth_provider: oauthProvider, oauth_id: oauthId });
  }

  // Delete (soft delete) a user by setting isDeleted to true
  async softDeleteById(id: string): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  }

  // Check if a user exists by their email or username
  async existsByEmailOrUsername(email: string, username: string): Promise<boolean> {
    const user = await User.findOne({ $or: [{ email }, { username }] });
    return !!user;
  }

  // Get all active users
  async findAllActive(): Promise<IUser[]> {
    return await User.find({ isActive: true, isDeleted: false });
  }
}

export default new UserRepository();
