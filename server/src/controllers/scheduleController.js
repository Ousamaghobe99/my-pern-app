import ScheduleService from '../services/scheduleService.js';
import ResponseHelper from '../utils/responseHelper.js';
import { HTTP_STATUS } from '../utils/constants.js';
import Logger from '../utils/logger.js';

class ScheduleController {
  // GET /api/schedule
  static async getScheduleEvents(req, res) {
    try {
      const { startDate, endDate } = req.query;

      // Basic validation
      if (!startDate || !endDate) {
        return ResponseHelper.error(res, 'startDate and endDate query parameters are required.', HTTP_STATUS.BAD_REQUEST);
      }

      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return ResponseHelper.error(res, 'Invalid date format.', HTTP_STATUS.BAD_REQUEST);
      }

      const events = await ScheduleService.getScheduleEvents(start, end);

      ResponseHelper.success(
        res,
        events,
        'Schedule events retrieved successfully'
      );
    } catch (error) {
      Logger.error('Get schedule events controller error', error);
      ResponseHelper.error(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }
}

export default ScheduleController;