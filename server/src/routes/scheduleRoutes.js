import express from 'express';
import ScheduleController from '../controllers/scheduleController.js';
import { authenticateToken, requirePermission } from '../middleware/auth.js';

const router = express.Router();    
// Apply authentication to all routes
router.use(authenticateToken);
// GET /api/schedules
router.get('/',
  requirePermission('schedule:read'),
  ScheduleController.getScheduleEvents
); 
export default router;