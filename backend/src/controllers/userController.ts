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
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);

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

// Get the current user
export const getMe = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.params.id = (req as any).user.id;
  next();
};

// Create a new user (Admin-only)
export const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newUser = await User.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
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
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      {
        new: true,
      }
    );

    if (!user) {
      return next(new AppError("No user found with that ID", 404));
    }

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
    if (req.body.password || req.body.passwordConfirm) {
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
    await User.findByIdAndUpdate(req.user.id, { isDeleted: true });

    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);
