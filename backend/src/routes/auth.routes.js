import { Router } from 'express';

import {
  register,
  login,
  logoutUser,
  getMe,
  resetPassword,
  getProfilePic,
  getProfile
} from '../controllers/auth.controller.js';

import upload from '../middlewares/upload.js';

import {
  validateRegisterInput,
  handleValidationErrors,
  validateLoginInput,
} from '../utils/validation.js';
import { protect } from '../middlewares/auth.js';
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

router.get('/me', protect, getMe);
router.get('/profile', protect, getProfile);

// router.get('/profile', authenticate, getProfile);

router.post('/logout', protect, logoutUser); // or remove `authenticate` if token not required

router.post('/reset-password', protect, resetPassword);
router.get('/get-profile-pic', protect, getProfilePic);

/*router.post('/verify-otp', verifyOtp);
router.post('/update-profile', protect, updateProfile);
router.post('/upload-profile-pic', protect, upload.single('profilePic'), uploadProfilePic);

router.get('/get-user/:id', protect, getUserById);
router.get('/get-all-users', protect, getAllUsers);
router.get('/get-user-by-username/:username', protect, getUserByUsername);
router.get('/get-user-by-email/:email', protect, getUserByEmail);*/
export default router;
