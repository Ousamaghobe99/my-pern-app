import InterfaceService from '../services/interfaceService.js';
import ResponseHelper from '../utils/responseHelper.js';
import { SUCCESS_MESSAGES, HTTP_STATUS  } from '../utils/constants.js';
import Logger from '../utils/logger.js';

class InterfaceController {
  // GET /api/interfaces
  static async getAllInterfaces(req, res) {
    try {
      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        search: req.query.search,
        status: req.query.status,
        type: req.query.type,
        locationId: req.query.locationId,
        sortBy: req.query.sortBy || 'createdAt',
        sortOrder: req.query.sortOrder || 'desc'
      };

      const result = await InterfaceService.getAllInterfaces(options);

      ResponseHelper.paginated(
        res,
        result.interfaces,
        result.pagination,
        'Interfaces retrieved successfully'
      );
    } catch (error) {
      Logger.error('Get all interfaces controller error', error);
      ResponseHelper.error(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }

  // GET /api/interfaces/:id
  static async getInterfaceById(req, res) {
    try {
      const { id } = req.params;

      const interfaceData = await InterfaceService.getInterfaceById(id);

      ResponseHelper.success(
        res,
        interfaceData,
        'Interface retrieved successfully',
        HTTP_STATUS.OK
      );
    } catch (error) {
      Logger.error('Get interface by ID controller error', error);
      
      if (error.message.includes('not found')) {
        ResponseHelper.notFound(res, error.message);
      } else {
        ResponseHelper.error(res, error.message, HTTP_STATUS.BAD_REQUEST);
      }
    }
  }

  // POST /api/interfaces
  static async createInterface(req, res) {
    try {
      const interfaceData = req.body;

      const newInterface = await InterfaceService.createInterface(interfaceData);

      ResponseHelper.success(
        res,
        newInterface,
        SUCCESS_MESSAGES.INTERFACE_CREATED,
        HTTP_STATUS.CREATED
      );
    } catch (error) {
      Logger.error('Create interface controller error', error);
      
      if (error.message.includes('already exists')) {
        ResponseHelper.conflict(res, error.message);
      } else if (error.message.includes('not found')) {
        ResponseHelper.notFound(res, error.message);
      } else {
        ResponseHelper.error(res, error.message, HTTP_STATUS.BAD_REQUEST);
      }
    }
  }

  // PUT /api/interfaces/:id
  static async updateInterface(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updatedInterface = await InterfaceService.updateInterface(id, updateData);

      ResponseHelper.success(
        res,
        updatedInterface,
        SUCCESS_MESSAGES.INTERFACE_UPDATED,
        HTTP_STATUS.OK
      );
    } catch (error) {
      Logger.error('Update interface controller error', error);
      
      if (error.message.includes('not found')) {
        ResponseHelper.notFound(res, error.message);
      } else if (error.message.includes('already exists')) {
        ResponseHelper.conflict(res, error.message);
      } else {
        ResponseHelper.error(res, error.message, HTTP_STATUS.BAD_REQUEST);
      }
    }
  }

  // DELETE /api/interfaces/:id
  static async deleteInterface(req, res) {
    try {
      const { id } = req.params;

      await InterfaceService.deleteInterface(id);

      ResponseHelper.success(
        res,
        null,
        SUCCESS_MESSAGES.INTERFACE_DELETED,
        HTTP_STATUS.OK
      );
    } catch (error) {
      Logger.error('Delete interface controller error', error);
      
      if (error.message.includes('not found')) {
        ResponseHelper.notFound(res, error.message);
      } else if (error.message.includes('Cannot delete')) {
        ResponseHelper.conflict(res, error.message);
      } else {
        ResponseHelper.error(res, error.message, HTTP_STATUS.BAD_REQUEST);
      }
    }
  }

  // POST /api/interfaces/:id/move
  static async moveInterface(req, res) {
    try {
      const { id } = req.params;
      const { toLocationId, reason, notes } = req.body;
      const movedById = req.user.id;

      const result = await InterfaceService.moveInterface(
        id,
        toLocationId,
        movedById,
        reason,
        notes
      );

      ResponseHelper.success(
        res,
        result,
        'Interface moved successfully',
        HTTP_STATUS.OK
      );
    } catch (error) {
      Logger.error('Move interface controller error', error);
      
      if (error.message.includes('not found')) {
        ResponseHelper.notFound(res, error.message);
      } else if (error.message.includes('already at')) {
        ResponseHelper.conflict(res, error.message);
      } else {
        ResponseHelper.error(res, error.message, HTTP_STATUS.BAD_REQUEST);
      }
    }
  }

  // GET /api/interfaces/statistics
  static async getInterfaceStatistics(req, res) {
    try {
      const statistics = await InterfaceService.getInterfaceStatistics();

      ResponseHelper.success(
        res,
        statistics,
        'Interface statistics retrieved successfully',
        HTTP_STATUS.OK
      );
    } catch (error) {
      Logger.error('Get interface statistics controller error', error);
      ResponseHelper.error(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }
}

export default InterfaceController;

