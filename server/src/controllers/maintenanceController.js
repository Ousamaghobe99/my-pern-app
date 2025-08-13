import MaintenanceService from '../services/maintenanceService.js';
import ResponseHelper from '../utils/responseHelper.js';
import { SUCCESS_MESSAGES, HTTP_STATUS  } from '../utils/constants.js';
import Logger from '../utils/logger.js';

class MaintenanceController {
  // GET /api/maintenance
  static async getAllMaintenanceTickets(req, res) {
    try {
      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        search: req.query.search,
        status: req.query.status,
        type: req.query.type,
        priority: req.query.priority,
        assignedToId: req.query.assignedToId,
        reportedById: req.query.reportedById,
        interfaceId: req.query.interfaceId,
        sortBy: req.query.sortBy || 'createdAt',
        sortOrder: req.query.sortOrder || 'desc'
      };

      const result = await MaintenanceService.getAllMaintenanceTickets(options);

      ResponseHelper.paginated(
        res,
        result.tickets,
        result.pagination,
        'Maintenance tickets retrieved successfully'
      );
    } catch (error) {
      Logger.error('Get all maintenance tickets controller error', error);
      ResponseHelper.error(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }

  // GET /api/maintenance/statistics
  static async getMaintenanceStatistics(req, res) {
    try {
      const statistics = await MaintenanceService.getMaintenanceStatistics();

      ResponseHelper.success(
        res,
        statistics,
        'Maintenance statistics retrieved successfully',
        HTTP_STATUS.OK
      );
    } catch (error) {
      Logger.error('Get maintenance statistics controller error', error);
      ResponseHelper.error(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }

  // GET /api/maintenance/:id
  static async getMaintenanceTicketById(req, res) {
    try {
      const { id } = req.params;

      const ticket = await MaintenanceService.getMaintenanceTicketById(id);

      ResponseHelper.success(
        res,
        ticket,
        'Maintenance ticket retrieved successfully',
        HTTP_STATUS.OK
      );
    } catch (error) {
      Logger.error('Get maintenance ticket by ID controller error', error);
      
      if (error.message.includes('not found')) {
        ResponseHelper.notFound(res, error.message);
      } else {
        ResponseHelper.error(res, error.message, HTTP_STATUS.BAD_REQUEST);
      }
    }
  }

  // POST /api/maintenance
  static async createMaintenanceTicket(req, res) {
    try {
      const ticketData = req.body;

      const newTicket = await MaintenanceService.createMaintenanceTicket(ticketData);

      ResponseHelper.success(
        res,
        newTicket,
        SUCCESS_MESSAGES.MAINTENANCE_TICKET_CREATED,
        HTTP_STATUS.CREATED
      );
    } catch (error) {
      Logger.error('Create maintenance ticket controller error', error);
      
      if (error.message.includes('not found')) {
        ResponseHelper.notFound(res, error.message);
      } else {
        ResponseHelper.error(res, error.message, HTTP_STATUS.BAD_REQUEST);
      }
    }
  }

  // PUT /api/maintenance/:id
  static async updateMaintenanceTicket(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updatedTicket = await MaintenanceService.updateMaintenanceTicket(id, updateData);

      ResponseHelper.success(
        res,
        updatedTicket,
        SUCCESS_MESSAGES.MAINTENANCE_TICKET_UPDATED,
        HTTP_STATUS.OK
      );
    } catch (error) {
      Logger.error('Update maintenance ticket controller error', error);
      
      if (error.message.includes('not found')) {
        ResponseHelper.notFound(res, error.message);
      } else {
        ResponseHelper.error(res, error.message, HTTP_STATUS.BAD_REQUEST);
      }
    }
  }

  // DELETE /api/maintenance/:id
  static async deleteMaintenanceTicket(req, res) {
    try {
      const { id } = req.params;

      await MaintenanceService.deleteMaintenanceTicket(id);

      ResponseHelper.success(
        res,
        null,
        'Maintenance ticket deleted successfully',
        HTTP_STATUS.OK
      );
    } catch (error) {
      Logger.error('Delete maintenance ticket controller error', error);
      
      if (error.message.includes('not found')) {
        ResponseHelper.notFound(res, error.message);
      } else if (error.message.includes('Cannot delete')) {
        ResponseHelper.conflict(res, error.message);
      } else {
        ResponseHelper.error(res, error.message, HTTP_STATUS.BAD_REQUEST);
      }
    }
  }

  // POST /api/maintenance/:id/logs
  static async addMaintenanceLog(req, res) {
    try {
      const { id } = req.params;
      const logData = {
        ...req.body,
        userId: req.user.id // Use authenticated user's ID
      };

      const newLog = await MaintenanceService.addMaintenanceLog(id, logData);

      ResponseHelper.success(
        res,
        newLog,
        'Maintenance log added successfully',
        HTTP_STATUS.CREATED
      );
    } catch (error) {
      Logger.error('Add maintenance log controller error', error);
      
      if (error.message.includes('not found')) {
        ResponseHelper.notFound(res, error.message);
      } else {
        ResponseHelper.error(res, error.message, HTTP_STATUS.BAD_REQUEST);
      }
    }
  }
}

export default MaintenanceController;

