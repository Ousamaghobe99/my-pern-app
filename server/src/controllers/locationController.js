import LocationService from '../services/locationService.js';
import ResponseHelper from '../utils/responseHelper.js';
import { SUCCESS_MESSAGES, HTTP_STATUS  } from '../utils/constants.js';
import Logger from '../utils/logger.js';

class LocationController {
  // GET /api/locations
  static async getAllLocations(req, res) {
    try {
      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        search: req.query.search,
        sortBy: req.query.sortBy || 'name',
        sortOrder: req.query.sortOrder || 'asc'
      };

      const result = await LocationService.getAllLocations(options);

      ResponseHelper.paginated(
        res,
        result.locations,
        result.pagination,
        'Locations retrieved successfully'
      );
    } catch (error) {
      Logger.error('Get all locations controller error', error);
      ResponseHelper.error(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }

  // GET /api/locations/list
  static async getLocationsList(req, res) {
    try {
      const locations = await LocationService.getLocationsList();

      ResponseHelper.success(
        res,
        locations,
        'Locations list retrieved successfully',
        HTTP_STATUS.OK
      );
    } catch (error) {
      Logger.error('Get locations list controller error', error);
      ResponseHelper.error(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }

  // GET /api/locations/statistics
  static async getLocationStatistics(req, res) {
    try {
      const statistics = await LocationService.getLocationStatistics();

      ResponseHelper.success(
        res,
        statistics,
        'Location statistics retrieved successfully',
        HTTP_STATUS.OK
      );
    } catch (error) {
      Logger.error('Get location statistics controller error', error);
      ResponseHelper.error(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }

  // GET /api/locations/:id
  static async getLocationById(req, res) {
    try {
      const { id } = req.params;

      const location = await LocationService.getLocationById(id);

      ResponseHelper.success(
        res,
        location,
        'Location retrieved successfully',
        HTTP_STATUS.OK
      );
    } catch (error) {
      Logger.error('Get location by ID controller error', error);
      
      if (error.message.includes('not found')) {
        ResponseHelper.notFound(res, error.message);
      } else {
        ResponseHelper.error(res, error.message, HTTP_STATUS.BAD_REQUEST);
      }
    }
  }

  // POST /api/locations
  static async createLocation(req, res) {
    try {
      const locationData = req.body;

      const newLocation = await LocationService.createLocation(locationData);

      ResponseHelper.success(
        res,
        newLocation,
        SUCCESS_MESSAGES.LOCATION_CREATED,
        HTTP_STATUS.CREATED
      );
    } catch (error) {
      Logger.error('Create location controller error', error);
      
      if (error.message.includes('already exists')) {
        ResponseHelper.conflict(res, error.message);
      } else {
        ResponseHelper.error(res, error.message, HTTP_STATUS.BAD_REQUEST);
      }
    }
  }

  // PUT /api/locations/:id
  static async updateLocation(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updatedLocation = await LocationService.updateLocation(id, updateData);

      ResponseHelper.success(
        res,
        updatedLocation,
        SUCCESS_MESSAGES.LOCATION_UPDATED,
        HTTP_STATUS.OK
      );
    } catch (error) {
      Logger.error('Update location controller error', error);
      
      if (error.message.includes('not found')) {
        ResponseHelper.notFound(res, error.message);
      } else if (error.message.includes('already exists')) {
        ResponseHelper.conflict(res, error.message);
      } else {
        ResponseHelper.error(res, error.message, HTTP_STATUS.BAD_REQUEST);
      }
    }
  }

  // DELETE /api/locations/:id
  static async deleteLocation(req, res) {
    try {
      const { id } = req.params;

      await LocationService.deleteLocation(id);

      ResponseHelper.success(
        res,
        null,
        SUCCESS_MESSAGES.LOCATION_DELETED,
        HTTP_STATUS.OK
      );
    } catch (error) {
      Logger.error('Delete location controller error', error);
      
      if (error.message.includes('not found')) {
        ResponseHelper.notFound(res, error.message);
      } else if (error.message.includes('Cannot delete')) {
        ResponseHelper.conflict(res, error.message);
      } else {
        ResponseHelper.error(res, error.message, HTTP_STATUS.BAD_REQUEST);
      }
    }
  }
}

export default LocationController;

