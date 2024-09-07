import { Request, Response, NextFunction } from 'express';
import Notification from '../models/Notification';
import User from '../models/User';
import AppError from '../utils/appError';
import mongoose from 'mongoose';

// Create a new notification for a user
export const createNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, type, message } = req.body;

    // Validate user existence
    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Create the notification
    const notification = await Notification.create({
      user_id: user._id,
      type,
      message,
    });

    // Add notification to user's notifications array
    user.notifications.push(notification._id as mongoose.Types.ObjectId);
    await user.save();

    res.status(201).json({
      status: 'success',
      data: {
        notification,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Get all notifications for a user
export const getUserNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId).populate('notifications');
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        notifications: user.notifications,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Mark a notification as read
export const markNotificationAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return next(new AppError('Notification not found', 404));
    }

    notification.read = true;
    await notification.save();

    res.status(200).json({
      status: 'success',
      data: {
        notification,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Delete a notification for a user
export const deleteNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, notificationId } = req.params;

    // Remove the notification from the user's notifications array
    const user = await User.findByIdAndUpdate(userId, {
      $pull: { notifications: notificationId },
    });

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Delete the notification itself
    const notification = await Notification.findByIdAndDelete(notificationId);
    if (!notification) {
      return next(new AppError('Notification not found', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    next(err);
  }
};
