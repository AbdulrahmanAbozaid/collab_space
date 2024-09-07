import { Request, Response, NextFunction } from 'express';
import Document from '../models/Document';
import AppError from '../utils/appError';
import catchAsync from '../middlewares/asyncHandler';
import { CustomRequest } from '../types/custom';

// Create a new document
export const createDocument = catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
  const { title, content } = req.body;
  const document = await Document.create({
    title,
    content,
    owner: req.user?.id, // Assuming req.user is populated by the protect middleware
    collaborators: [req.user?.id],
  });

  res.status(201).json({
    status: 'success',
    data: {
      document,
    },
  });
});

// Get a single document by ID
export const getDocument = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const document = await Document.findById(req.params.id);

  if (!document) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      document,
    },
  });
});

// Get all documents of a user
export const getMyDocuments = catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
  const documents = await Document.find({ collaborators: req.user?.id });

  res.status(200).json({
    status: 'success',
    results: documents.length,
    data: {
      documents,
    },
  });
});

// Update document content (for collaborative editing)
export const updateDocument = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const document = await Document.findByIdAndUpdate(req.params.id, { content: req.body.content }, {
    new: true,
    runValidators: true,
  });

  if (!document) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      document,
    },
  });
});

// Delete a document (soft delete)
export const deleteDocument = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const document = await Document.findByIdAndUpdate(req.params.id, { isDeleted: true });

  if (!document) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
