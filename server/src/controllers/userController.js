import UserService from '../services/userService.js';
import ResponseHelper from '../utils/responseHelper.js';
import { SUCCESS_MESSAGES, HTTP_STATUS  } from '../utils/constants.js';
import Logger from '../utils/logger.js';

class UserController {
  // GET /api/users
  static async getAllUsers(req, res) {
    try {
      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        search: req.query.search,
        roleId: req.query.roleId,
        sortBy: req.query.sortBy || 'createdAt',
        sortOrder: req.query.sortOrder || 'desc'
      };

      const result = await UserService.getAllUsers(options);

      ResponseHelper.paginated(
        res,
        result.users,
        result.pagination,
        'Users retrieved successfully'
      );
    } catch (error) {
      Logger.error('Get all users controller error', error);
      ResponseHelper.error(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }

  // GET /api/users/roles
  static async getAllRoles(req, res) {
    try {
      const roles = await UserService.getAllRoles();

      ResponseHelper.success(
        res,
        roles,
        'Roles retrieved successfully',
        HTTP_STATUS.OK
      );
    } catch (error) {
      Logger.error('Get all roles controller error', error);
      ResponseHelper.error(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }

  // GET /api/users/statistics
  static async getUserStatistics(req, res) {
    try {
      const statistics = await UserService.getUserStatistics();

      ResponseHelper.success(
        res,
        statistics,
        'User statistics retrieved successfully',
        HTTP_STATUS.OK
      );
    } catch (error) {
      Logger.error('Get user statistics controller error', error);
      ResponseHelper.error(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }

  // GET /api/users/:id
  static async getUserById(req, res) {
    try {
      const { id } = req.params;

      const user = await UserService.getUserById(id);

      ResponseHelper.success(
        res,
        user,
        'User retrieved successfully',
        HTTP_STATUS.OK
      );
    } catch (error) {
      Logger.error('Get user by ID controller error', error);
      
      if (error.message.includes('not found')) {
        ResponseHelper.notFound(res, error.message);
      } else {
        ResponseHelper.error(res, error.message, HTTP_STATUS.BAD_REQUEST);
      }
    }
  }

  // POST /api/users
  static async createUser(req, res) {
    try {
      const userData = req.body;

      const newUser = await UserService.createUser(userData);

      ResponseHelper.success(
        res,
        newUser,
        SUCCESS_MESSAGES.USER_CREATED,
        HTTP_STATUS.CREATED
      );
    } catch (error) {
      Logger.error('Create user controller error', error);
      
      if (error.message.includes('already exists')) {
        ResponseHelper.conflict(res, error.message);
      } else if (error.message.includes('Invalid role')) {
        ResponseHelper.notFound(res, error.message);
      } else {
        ResponseHelper.error(res, error.message, HTTP_STATUS.BAD_REQUEST);
      }
    }
  }

  // PUT /api/users/:id
  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updatedUser = await UserService.updateUser(id, updateData);

      ResponseHelper.success(
        res,
        updatedUser,
        SUCCESS_MESSAGES.USER_UPDATED,
        HTTP_STATUS.OK
      );
    } catch (error) {
      Logger.error('Update user controller error', error);
      
      if (error.message.includes('not found')) {
        ResponseHelper.notFound(res, error.message);
      } else if (error.message.includes('already exists')) {
        ResponseHelper.conflict(res, error.message);
      } else if (error.message.includes('Invalid role')) {
        ResponseHelper.notFound(res, error.message);
      } else {
        ResponseHelper.error(res, error.message, HTTP_STATUS.BAD_REQUEST);
      }
    }
  }

  // DELETE /api/users/:id
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;

      await UserService.deleteUser(id);

      ResponseHelper.success(
        res,
        null,
        SUCCESS_MESSAGES.USER_DELETED,
        HTTP_STATUS.OK
      );
    } catch (error) {
      Logger.error('Delete user controller error', error);
      
      if (error.message.includes('not found')) {
        ResponseHelper.notFound(res, error.message);
      } else if (error.message.includes('Cannot delete')) {
        ResponseHelper.conflict(res, error.message);
      } else {
        ResponseHelper.error(res, error.message, HTTP_STATUS.BAD_REQUEST);
      }
    }
  }

  // GET /api/users/matricule/:matricule
static async getUserByMatricule(req, res) {
  try {
    const { matricule } = req.params;

    const user = await UserService.getUserByMatricule(matricule);

    ResponseHelper.success(
      res,
      user,
      'User retrieved successfully',
      HTTP_STATUS.OK
    );
  } catch (error) {
    Logger.error('Get user by matricule controller error', error);

    if (error.message.includes('not found')) {
      ResponseHelper.notFound(res, error.message);
    } else {
      ResponseHelper.error(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
  }
}
}




export default UserController;

