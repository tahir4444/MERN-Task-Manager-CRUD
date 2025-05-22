import express from 'express';
import { protect } from '../middlewares/auth.js';
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  getAvailablePermissions
} from '../controllers/role.controller.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// Role routes
router.get('/', getRoles);
router.get('/permissions', getAvailablePermissions);
router.post('/', createRole);
router.put('/:id', updateRole);
router.delete('/:id', deleteRole);

export default router; 