import { Router } from 'express';
import * as authController from '../../controllers/authController';
import * as userController from '../../controllers/userController';

const router = Router();

// Authentication routes
router.post('/register', authController.register);       // Register a new user
router.post('/login', authController.login);             // Login an existing user
router.post('/forgotPassword', authController.forgotPassword); // Forgot password
router.patch('/resetPassword/:token', authController.resetPassword); // Reset password

// Routes that require authentication (protected routes)
router.use(authController.protect);

router.get('/me', userController.getMe, userController.getUser); // Get current user's profile
router.patch('/updateMe', userController.updateMe);              // Update current user's profile
router.delete('/deleteMe', userController.deleteMe);             // Deactivate current user's account

export default router;
