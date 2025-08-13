import express from 'express';
import LocationController from '../controllers/locationController.js';
import { authenticateToken, requirePermission  } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// GET /api/locations/list
router.get('/list', 
  requirePermission('location:read'),
  LocationController.getLocationsList
);

// GET /api/locations/statistics
router.get('/statistics', 
  requirePermission('location:read'),
  LocationController.getLocationStatistics
);

// GET /api/locations
router.get('/', 
  requirePermission('location:read'),
  LocationController.getAllLocations
);

// GET /api/locations/:id
router.get('/:id', 
  requirePermission('location:read'),
  LocationController.getLocationById
);

// POST /api/locations
router.post('/', 
  requirePermission('location:write'),
  LocationController.createLocation
);

// PUT /api/locations/:id
router.put('/:id', 
  requirePermission('location:write'),
  LocationController.updateLocation
);

// DELETE /api/locations/:id
router.delete('/:id', 
  requirePermission('location:delete'),
  LocationController.deleteLocation
);

export default router;

