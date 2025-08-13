import express from 'express';
import InterfaceController from '../controllers/interfaceController.js';
import { authenticateToken, requirePermission  } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// GET /api/interfaces/statistics
router.get('/statistics', 
  requirePermission('interface:read'),
  InterfaceController.getInterfaceStatistics
);

// GET /api/interfaces
router.get('/', 
  requirePermission('interface:read'),
  InterfaceController.getAllInterfaces
);

// GET /api/interfaces/:id
router.get('/:id', 
  requirePermission('interface:read'),
  InterfaceController.getInterfaceById
);

// POST /api/interfaces
router.post('/', 
  requirePermission('interface:write'),
  InterfaceController.createInterface
);

// PUT /api/interfaces/:id
router.put('/:id', 
  requirePermission('interface:write'),
  InterfaceController.updateInterface
);

// DELETE /api/interfaces/:id
router.delete('/:id', 
  requirePermission('interface:delete'),
  InterfaceController.deleteInterface
);

// POST /api/interfaces/:id/move
router.post('/:id/move', 
  requirePermission('interface:write'),
  InterfaceController.moveInterface
);

export default router;

