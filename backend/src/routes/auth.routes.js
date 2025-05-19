import { Router } from 'express';

import {
  register,
  login,
  logoutUser,
  getMe,
  resetPassword,
  getProfilePic
} from '../controllers/auth.controller.js';

import upload from '../middlewares/upload.js';

import {
  validateRegisterInput,
  handleValidationErrors,
  validateLoginInput,
} from '../utils/validation.js';
import { authenticate } from '../middlewares/auth.js'; // optional middleware
//import { registerUser } from '../controllers/authController.js';
const router = Router();

router.post(
  '/register',
  upload.single('profile_pic'), // Add multer middleware
  validateRegisterInput,
  handleValidationErrors,
  register
);

router.post('/login', validateLoginInput, handleValidationErrors, login);

router.get('/me', authenticate, getMe);

router.post('/logout', authenticate, logoutUser); // or remove `authenticate` if token not required
router.get('/profile', authenticate, getMe);
router.post('/reset-password', resetPassword);
router.get('/get-profile-pic', authenticate, getProfilePic);
/*router.post('/verify-otp', verifyOtp);
router.post('/update-profile', protect, updateProfile);
router.post('/upload-profile-pic', protect, upload.single('profilePic'), uploadProfilePic);

router.get('/get-user/:id', protect, getUserById);
router.get('/get-all-users', protect, getAllUsers);
router.get('/get-user-by-username/:username', protect, getUserByUsername);
router.get('/get-user-by-email/:email', protect, getUserByEmail);*/
export default router;
