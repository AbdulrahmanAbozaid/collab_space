import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import catchAsync from "../middlewares/asyncHandler";
import AppError from "../utils/appError";

// Get all users
export const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find();

    res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        users,
      },
    });
  }
);

// Get a specific user by ID
export const getUser = catchAsync(
  async (req: Request & { user: any }, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new AppError("No user found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  }
);

// Update a user by ID
export const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return next(new AppError("No user found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  }
);

// Delete a user by ID (Soft delete)
export const deleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return next(new AppError("No user found with that ID", 404));
    }

    // 204 No Content
    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);

// Update the current user's profile
export const updateMe = catchAsync(
  async (req: Request & { user: any }, res: Response, next: NextFunction) => {
    // Ensure password is not updated via this route
    if (req.body.password) {
      return next(
        new AppError(
          "This route is not for password updates. Please use /updateMyPassword.",
          400
        )
      );
    }

    // Update the user's data
    const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  }
);

// Soft delete the current user (deactivate account)
export const deleteMe = catchAsync(
  async (req: Request & { user: any }, res: Response, next: NextFunction) => {
    // await User.findByIdAndUpdate(req.user.id, { isDeleted: true });
    await User.findByIdAndDelete(req.user.id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);
