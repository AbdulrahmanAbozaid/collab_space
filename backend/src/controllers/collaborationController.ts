import { Request, Response, NextFunction } from 'express';
import CollaborationSession from '../models/Collaboration';
import Document from '../models/Document';
import AppError from '../utils/appError';
import catchAsync from '../middlewares/asyncHandler';
import mongoose from 'mongoose';
import { CustomRequest } from '../types/custom';

// Join a collaboration session
export const joinSession = catchAsync(async (req: Request & {user:any}, res: Response, next: NextFunction) => {
  const { documentId } = req.body;

  // Ensure documentId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(documentId)) {
    return next(new AppError('Invalid document ID', 400));
  }

  const document = await Document.findById(documentId);
  if (!document || document.$isDeleted()) {
    return next(new AppError('Document not found or deleted', 404));
  }

  // Create the collaboration session
  const session = await CollaborationSession.create({
    document: documentId,
    collaborator: req.user?._id, // Use ObjectId reference from user
  });

  // Log the activity for this collaboration session
  session.activity_log.push({
    user_id: req.user._id,
    action: 'Joined session',
    timestamp: new Date(),
  });

  await session.save();

  res.status(200).json({
    status: 'success',
    data: {
      session,
    },
  });
});

// Leave a collaboration session
export const leaveSession = catchAsync(async (req: Request&{user:any}, res: Response, next: NextFunction) => {
  const { documentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(documentId)) {
    return next(new AppError('Invalid document ID', 400));
  }

  const session = await CollaborationSession.findOneAndDelete({
    document_id: documentId,
    collaborator: req.user._id,
  });

  if (!session) {
    return next(new AppError('You are not part of this session', 404));
  }

  // Optionally log this action in the activity log of the session
  session.activity_log.push({
    user_id: req.user._id,
    action: 'Left session',
    timestamp: new Date(),
  });

  await session.save();

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// Get collaborators of a document
export const getCollaborators = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { documentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(documentId)) {
    return next(new AppError('Invalid document ID', 400));
  }

  const sessions = await CollaborationSession.find({ document: documentId }).populate('collaborator');

  const collaborators = sessions.map(session => session.collaborator);

  res.status(200).json({
    status: 'success',
    results: collaborators.length,
    data: {
      collaborators,
    },
  });
});
