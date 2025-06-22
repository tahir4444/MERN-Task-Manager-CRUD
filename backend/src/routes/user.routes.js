import express from 'express';
import { protect } from '../middlewares/auth.js';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById
} from '../controllers/user.controller.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// Middleware to check for admin or superadmin role
const isAdminOrSuperAdmin = (req, res, next) => {
  if (req.user && (req.user.role?.name === 'admin' || req.user.role?.name === 'superadmin')) {
    next();
  } else {
    res.status(403).json({ error: 'Not authorized. Requires admin or superadmin role.' });
  }
};

// User management routes - protected by admin/superadmin middleware
router.get('/users', isAdminOrSuperAdmin, getUsers);
router.get('/users/:id', isAdminOrSuperAdmin, getUserById);
router.post('/users', isAdminOrSuperAdmin, upload.single('profile_pic'), createUser);
router.put('/users/:id', isAdminOrSuperAdmin, upload.single('profile_pic'), updateUser);
router.delete('/users/:id', isAdminOrSuperAdmin, deleteUser);

export default router; 