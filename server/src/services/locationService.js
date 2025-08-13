import prisma from '../config/database.js';
import { ERROR_MESSAGES, PAGINATION  } from '../utils/constants.js';
import Logger from '../utils/logger.js';

class LocationService {
  // Get all locations with pagination and filtering
  static async getAllLocations(options = {}) {
    try {
      const {
        page = PAGINATION.DEFAULT_PAGE,
        limit = PAGINATION.DEFAULT_LIMIT,
        search,
        sortBy = 'name',
        sortOrder = 'asc'
      } = options;

      const skip = (page - 1) * Math.min(limit, PAGINATION.MAX_LIMIT);
      const take = Math.min(limit, PAGINATION.MAX_LIMIT);

      // Build where clause
      const where = {};
      
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { address: { contains: search, mode: 'insensitive' } }
        ];
      }

      // Build orderBy clause
      const orderBy = {};
      orderBy[sortBy] = sortOrder;

      const [locations, total] = await Promise.all([
        prisma.location.findMany({
          where,
          skip,
          take,
          orderBy,
          include: {
            _count: {
              select: {
                interfaces: true,
                movementLogsFrom: true,
                movementLogsTo: true
              }
            }
          }
        }),
        prisma.location.count({ where })
      ]);

      return {
        locations,
        pagination: {
          page,
          limit: take,
          total,
          totalPages: Math.ceil(total / take)
        }
      };
    } catch (error) {
      Logger.error('Get all locations error', error);
      throw error;
    }
  }

  // Get location by ID
  static async getLocationById(id) {
    try {
      const location = await prisma.location.findUnique({
        where: { id },
        include: {
          interfaces: {
            select: {
              id: true,
              interfaceName: true,
              serialNumber: true,
              type: true,
              status: true
            },
            orderBy: { interfaceName: 'asc' }
          },
          movementLogsFrom: {
            include: {
              interface: {
                select: {
                  id: true,
                  interfaceName: true,
                  serialNumber: true
                }
              },
              toLocation: {
                select: {
                  id: true,
                  name: true
                }
              },
              movedBy: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  matricule: true
                }
              }
            },
            orderBy: { createdAt: 'desc' },
            take: 10
          },
          movementLogsTo: {
            include: {
              interface: {
                select: {
                  id: true,
                  interfaceName: true,
                  serialNumber: true
                }
              },
              fromLocation: {
                select: {
                  id: true,
                  name: true
                }
              },
              movedBy: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  matricule: true
                }
              }
            },
            orderBy: { createdAt: 'desc' },
            take: 10
          },
          _count: {
            select: {
              interfaces: true,
              movementLogsFrom: true,
              movementLogsTo: true
            }
          }
        }
      });

      if (!location) {
        throw new Error(ERROR_MESSAGES.LOCATION_NOT_FOUND);
      }

      return location;
    } catch (error) {
      Logger.error('Get location by ID error', error);
      throw error;
    }
  }

  // Create new location
  static async createLocation(locationData) {
    try {
      const { name, description, address } = locationData;

      // Check if location name already exists
      const existingLocation = await prisma.location.findUnique({
        where: { name }
      });

      if (existingLocation) {
        throw new Error('Location name already exists');
      }

      const newLocation = await prisma.location.create({
        data: {
          name,
          description,
          address
        },
        include: {
          _count: {
            select: {
              interfaces: true,
              movementLogsFrom: true,
              movementLogsTo: true
            }
          }
        }
      });

      Logger.info(`Location created: ${newLocation.id}`);

      return newLocation;
    } catch (error) {
      Logger.error('Create location error', error);
      throw error;
    }
  }

  // Update location
  static async updateLocation(id, updateData) {
    try {
      const { name, description, address } = updateData;

      // Check if location exists
      const existingLocation = await prisma.location.findUnique({
        where: { id }
      });

      if (!existingLocation) {
        throw new Error(ERROR_MESSAGES.LOCATION_NOT_FOUND);
      }

      // Check if name already exists (if being updated)
      if (name && name !== existingLocation.name) {
        const duplicateLocation = await prisma.location.findUnique({
          where: { name }
        });

        if (duplicateLocation) {
          throw new Error('Location name already exists');
        }
      }

      const updatedLocation = await prisma.location.update({
        where: { id },
        data: {
          name,
          description,
          address
        },
        include: {
          _count: {
            select: {
              interfaces: true,
              movementLogsFrom: true,
              movementLogsTo: true
            }
          }
        }
      });

      Logger.info(`Location updated: ${updatedLocation.id}`);

      return updatedLocation;
    } catch (error) {
      Logger.error('Update location error', error);
      throw error;
    }
  }

  // Delete location
  static async deleteLocation(id) {
    try {
      // Check if location exists
      const existingLocation = await prisma.location.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              interfaces: true,
              movementLogsFrom: true,
              movementLogsTo: true
            }
          }
        }
      });

      if (!existingLocation) {
        throw new Error(ERROR_MESSAGES.LOCATION_NOT_FOUND);
      }

      // Check if location has interfaces or movement logs
      const hasRelatedRecords = 
        existingLocation._count.interfaces > 0 ||
        existingLocation._count.movementLogsFrom > 0 ||
        existingLocation._count.movementLogsTo > 0;

      if (hasRelatedRecords) {
        throw new Error('Cannot delete location with existing interfaces or movement logs');
      }

      await prisma.location.delete({
        where: { id }
      });

      Logger.info(`Location deleted: ${id}`);

      return { success: true };
    } catch (error) {
      Logger.error('Delete location error', error);
      throw error;
    }
  }

  // Get location statistics
  static async getLocationStatistics() {
    try {
      const [
        totalLocations,
        locationsWithInterfaces,
        interfacesByLocation
      ] = await Promise.all([
        prisma.location.count(),
        prisma.location.count({
          where: {
            interfaces: {
              some: {}
            }
          }
        }),
        prisma.location.findMany({
          select: {
            id: true,
            name: true,
            _count: {
              select: {
                interfaces: true
              }
            }
          },
          orderBy: {
            interfaces: {
              _count: 'desc'
            }
          }
        })
      ]);

      return {
        total: totalLocations,
        withInterfaces: locationsWithInterfaces,
        empty: totalLocations - locationsWithInterfaces,
        interfacesByLocation: interfacesByLocation.map(location => ({
          locationId: location.id,
          locationName: location.name,
          interfaceCount: location._count.interfaces
        }))
      };
    } catch (error) {
      Logger.error('Get location statistics error', error);
      throw error;
    }
  }

  // Get all locations (simple list for dropdowns)
  static async getLocationsList() {
    try {
      const locations = await prisma.location.findMany({
        select: {
          id: true,
          name: true,
          description: true
        },
        orderBy: {
          name: 'asc'
        }
      });

      return locations;
    } catch (error) {
      Logger.error('Get locations list error', error);
      throw error;
    }
  }
}

export default LocationService;

