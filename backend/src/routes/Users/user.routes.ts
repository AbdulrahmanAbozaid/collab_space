import { Router } from 'express';
import * as userController from '../../controllers/userController';
import * as authController from '../../controllers/authController';

const router = Router();

// Protect all routes after this middleware
router.use(authController.protect);

// Admin routes (for managing users)
router.route('/')
  .get(userController.getAllUsers)          // Get all users (admin)
  .post(authController.protect, userController.createUser); // Create new user (admin)

router.route('/:id')
  .get(userController.getUser)              // Get specific user by ID (admin)
  .patch(userController.updateUser)         // Update specific user by ID (admin)
  .delete(userController.deleteUser);       // Soft delete user by ID (admin)

export default router;
