import prisma from '../config/database.js';
import { ERROR_MESSAGES, PAGINATION  } from '../utils/constants.js';
import Logger from '../utils/logger.js';

class InterfaceService {
  // Get all interfaces with pagination and filtering
  static async getAllInterfaces(options = {}) {
    try {
      const {
        page = PAGINATION.DEFAULT_PAGE,
        limit = PAGINATION.DEFAULT_LIMIT,
        search,
        status,
        type,
        locationId,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = options;

      const skip = (page - 1) * Math.min(limit, PAGINATION.MAX_LIMIT);
      const take = Math.min(limit, PAGINATION.MAX_LIMIT);

      // Build where clause
      const where = {};
      
      if (search) {
        where.OR = [
          { interfaceName: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { type: { contains: search, mode: 'insensitive' } },
          { serialNumber: { equals: parseInt(search) || undefined } }
        ];
      }

      if (status) {
        where.status = status;
      }

      if (type) {
        where.type = { contains: type, mode: 'insensitive' };
      }

      if (locationId) {
        where.currentLocationId = locationId;
      }

      // Build orderBy clause
      const orderBy = {};
      orderBy[sortBy] = sortOrder;

      const [interfaces, total] = await Promise.all([
        prisma.interface.findMany({
          where,
          skip,
          take,
          orderBy,
          include: {
            currentLocation: true,
            _count: {
              select: {
                usageLogs: true,
                maintenanceTickets: true,
                movementLogs: true
              }
            }
          }
        }),
        prisma.interface.count({ where })
      ]);

      return {
        interfaces,
        pagination: {
          page,
          limit: take,
          total,
          totalPages: Math.ceil(total / take)
        }
      };
    } catch (error) {
      Logger.error('Get all interfaces error', error);
      throw error;
    }
  }

  // Get interface by ID
  static async getInterfaceById(id) {
    try {
      const interfaceData = await prisma.interface.findUnique({
        where: { id },
        include: {
          currentLocation: true,
          usageLogs: {
            include: {
              user: {
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
          maintenanceTickets: {
            include: {
              reportedBy: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  matricule: true
                }
              },
              assignedTo: {
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
          movementLogs: {
            include: {
              fromLocation: true,
              toLocation: true,
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
          }
        }
      });

      if (!interfaceData) {
        throw new Error(ERROR_MESSAGES.INTERFACE_NOT_FOUND);
      }

      return interfaceData;
    } catch (error) {
      Logger.error('Get interface by ID error', error);
      throw error;
    }
  }

  // Create new interface
  static async createInterface(interfaceData) {
    try {
      const {
        interfaceName,
        serialNumber,
        description,
        status,
        type,
        currentLocationId,
        qrCodeData
      } = interfaceData;

      // Check if serial number already exists
      if (serialNumber) {
        const existingInterface = await prisma.interface.findUnique({
          where: { serialNumber }
        });

        if (existingInterface) {
          throw new Error('Serial number already exists');
        }
      }

      // Verify location exists if provided
      if (currentLocationId) {
        const location = await prisma.location.findUnique({
          where: { id: currentLocationId }
        });

        if (!location) {
          throw new Error(ERROR_MESSAGES.LOCATION_NOT_FOUND);
        }
      }

      const newInterface = await prisma.interface.create({
        data: {
          interfaceName,
          serialNumber,
          description,
          status,
          type,
          currentLocationId,
          qrCodeData
        },
        include: {
          currentLocation: true
        }
      });

      Logger.info(`Interface created: ${newInterface.id}`);

      return newInterface;
    } catch (error) {
      Logger.error('Create interface error', error);
      throw error;
    }
  }

  // Update interface
  static async updateInterface(id, updateData) {
    try {
      const {
        interfaceName,
        serialNumber,
        description,
        type,
        status,
        currentLocationId,
        qrCodeData
      } = updateData;

      // Check if interface exists
      const existingInterface = await prisma.interface.findUnique({
        where: { id }
      });

      if (!existingInterface) {
        throw new Error(ERROR_MESSAGES.INTERFACE_NOT_FOUND);
      }

      // Check if serial number already exists (if being updated)
      if (serialNumber && serialNumber !== existingInterface.serialNumber) {
        const duplicateInterface = await prisma.interface.findUnique({
          where: { serialNumber }
        });

        if (duplicateInterface) {
          throw new Error('Serial number already exists');
        }
      }

      // Verify location exists if provided
      if (currentLocationId && currentLocationId !== existingInterface.currentLocationId) {
        const location = await prisma.location.findUnique({
          where: { id: currentLocationId }
        });

        if (!location) {
          throw new Error(ERROR_MESSAGES.LOCATION_NOT_FOUND);
        }
      }

      const updatedInterface = await prisma.interface.update({
        where: { id },
        data: {
          interfaceName,
          serialNumber,
          description,
          type,
          status,
          currentLocationId,
          qrCodeData
        },
        include: {
          currentLocation: true
        }
      });

      Logger.info(`Interface updated: ${updatedInterface.id}`);

      return updatedInterface;
    } catch (error) {
      Logger.error('Update interface error', error);
      throw error;
    }
  }

  // Delete interface
  static async deleteInterface(id) {
    try {
      // Check if interface exists
      const existingInterface = await prisma.interface.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              usageLogs: true,
              maintenanceTickets: true,
              movementLogs: true
            }
          }
        }
      });

      if (!existingInterface) {
        throw new Error(ERROR_MESSAGES.INTERFACE_NOT_FOUND);
      }

      // Check if interface has related records
      const hasRelatedRecords = 
        existingInterface._count.usageLogs > 0 ||
        existingInterface._count.maintenanceTickets > 0 ||
        existingInterface._count.movementLogs > 0;

      if (hasRelatedRecords) {
        throw new Error('Cannot delete interface with existing usage logs, maintenance tickets, or movement logs');
      }

      await prisma.interface.delete({
        where: { id }
      });

      Logger.info(`Interface deleted: ${id}`);

      return { success: true };
    } catch (error) {
      Logger.error('Delete interface error', error);
      throw error;
    }
  }

  // Move interface to different location
  static async moveInterface(id, toLocationId, movedById, reason, notes) {
    try {
      // Get current interface
      const interfaceData = await prisma.interface.findUnique({
        where: { id },
        include: { currentLocation: true }
      });

      if (!interfaceData) {
        throw new Error(ERROR_MESSAGES.INTERFACE_NOT_FOUND);
      }

      // Verify destination location exists
      const toLocation = await prisma.location.findUnique({
        where: { id: toLocationId }
      });

      if (!toLocation) {
        throw new Error(ERROR_MESSAGES.LOCATION_NOT_FOUND);
      }

      // Check if interface is already at the destination
      if (interfaceData.currentLocationId === toLocationId) {
        throw new Error('Interface is already at the specified location');
      }

      // Use transaction to ensure data consistency
      const result = await prisma.$transaction(async (tx) => {
        // Update interface location
        const updatedInterface = await tx.interface.update({
          where: { id },
          data: { currentLocationId: toLocationId },
          include: { currentLocation: true }
        });

        // Create movement log
        const movementLog = await tx.interfaceMovementLog.create({
          data: {
            interfaceId: id,
            fromLocationId: interfaceData.currentLocationId,
            toLocationId,
            movedById,
            reason,
            notes
          },
          include: {
            fromLocation: true,
            toLocation: true,
            movedBy: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                matricule: true
              }
            }
          }
        });

        return { interface: updatedInterface, movementLog };
      });

      Logger.info(`Interface moved: ${id} from ${interfaceData.currentLocation?.name} to ${toLocation.name}`);

      return result;
    } catch (error) {
      Logger.error('Move interface error', error);
      throw error;
    }
  }

  // Get interface statistics
  static async getInterfaceStatistics() {
    try {
      const [
        totalInterfaces,
        statusCounts,
        typeCounts,
        locationCounts
      ] = await Promise.all([
        prisma.interface.count(),
        prisma.interface.groupBy({
          by: ['status'],
          _count: { status: true }
        }),
        prisma.interface.groupBy({
          by: ['type'],
          _count: { type: true }
        }),
        prisma.interface.groupBy({
          by: ['currentLocationId'],
          _count: { currentLocationId: true },
          where: {
            currentLocationId: { not: null }
          }
        })
      ]);

      // Get location names for location counts
      const locationIds = locationCounts.map(lc => lc.currentLocationId);
      const locations = await prisma.location.findMany({
        where: { id: { in: locationIds } },
        select: { id: true, name: true }
      });

      const locationCountsWithNames = locationCounts.map(lc => ({
        locationId: lc.currentLocationId,
        locationName: locations.find(l => l.id === lc.currentLocationId)?.name || 'Unknown',
        count: lc._count.currentLocationId
      }));

      return {
        total: totalInterfaces,
        byStatus: statusCounts.map(sc => ({
          status: sc.status,
          count: sc._count.status
        })),
        byType: typeCounts.map(tc => ({
          type: tc.type,
          count: tc._count.type
        })),
        byLocation: locationCountsWithNames
      };
    } catch (error) {
      Logger.error('Get interface statistics error', error);
      throw error;
    }
  }
}

export default InterfaceService;

