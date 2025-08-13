import express from 'express';
import MaintenanceController from '../controllers/maintenanceController.js';
import { authenticateToken, requirePermission  } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// GET /api/maintenance/statistics
router.get('/statistics', 
  requirePermission('maintenance:read'),
  MaintenanceController.getMaintenanceStatistics
);

// GET /api/maintenance
router.get('/', 
  requirePermission('maintenance:read'),
  MaintenanceController.getAllMaintenanceTickets
);

// GET /api/maintenance/:id
router.get('/:id', 
  requirePermission('maintenance:read'),
  MaintenanceController.getMaintenanceTicketById
);

// POST /api/maintenance
router.post('/', 
  requirePermission('maintenance:write'),
  MaintenanceController.createMaintenanceTicket
);

// PUT /api/maintenance/:id
router.put('/:id', 
  requirePermission('maintenance:write'),
  MaintenanceController.updateMaintenanceTicket
);

// DELETE /api/maintenance/:id
router.delete('/:id', 
  requirePermission('maintenance:delete'),
  MaintenanceController.deleteMaintenanceTicket
);

// POST /api/maintenance/:id/logs
router.post('/:id/logs', 
  requirePermission('maintenance:write'),
  MaintenanceController.addMaintenanceLog
);

export default router;

