import express from 'express';
import UserController from '../controllers/userController.js';
import { authenticateToken, requirePermission  } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// GET /api/users/roles
router.get('/roles', 
  requirePermission('user:read'),
  UserController.getAllRoles
);

// GET /api/users/statistics
router.get('/statistics', 
  requirePermission('user:read'),
  UserController.getUserStatistics
);

// GET /api/users
router.get('/', 
  requirePermission('user:read'),
  UserController.getAllUsers
);

// GET /api/users/:id
router.get('/:id', 
  requirePermission('user:read'),
  UserController.getUserById
);

// POST /api/users
router.post('/', 
  requirePermission('user:write'),
  UserController.createUser
);

// PUT /api/users/:id
router.put('/:id', 
  requirePermission('user:write'),
  UserController.updateUser
);

// DELETE /api/users/:id
router.delete('/:id', 
  requirePermission('user:delete'),
  UserController.deleteUser
);

export default router;

