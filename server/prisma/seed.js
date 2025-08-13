import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create permissions
  const permissions = [
    { name: 'user:read', description: 'Read user information' },
    { name: 'user:write', description: 'Create and update users' },
    { name: 'user:delete', description: 'Delete users' },
    { name: 'interface:read', description: 'Read interface information' },
    { name: 'interface:write', description: 'Create and update interfaces' },
    { name: 'interface:delete', description: 'Delete interfaces' },
    { name: 'location:read', description: 'Read location information' },
    { name: 'location:write', description: 'Create and update locations' },
    { name: 'location:delete', description: 'Delete locations' },
    { name: 'maintenance:read', description: 'Read maintenance tickets' },
    { name: 'maintenance:write', description: 'Create and update maintenance tickets' },
    { name: 'maintenance:delete', description: 'Delete maintenance tickets' },
    { name: 'reports:read', description: 'Read reports and analytics' },
    { name: 'admin:all', description: 'Full administrative access' }
  ];

  console.log('Creating permissions...');
  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: {},
      create: permission
    });
  }

  // Create roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'Administrator' },
    update: {},
    create: {
      name: 'Administrator',
      description: 'Full system access'
    }
  });

  const managerRole = await prisma.role.upsert({
    where: { name: 'Manager' },
    update: {},
    create: {
      name: 'Manager',
      description: 'Management level access'
    }
  });

  const technicianRole = await prisma.role.upsert({
    where: { name: 'Technician' },
    update: {},
    create: {
      name: 'Technician',
      description: 'Technical operations access'
    }
  });

  const operatorRole = await prisma.role.upsert({
    where: { name: 'Operator' },
    update: {},
    create: {
      name: 'Operator',
      description: 'Basic operational access'
    }
  });

  console.log('Assigning permissions to roles...');
  // Assign all permissions to Administrator
  const allPermissions = await prisma.permission.findMany();
  for (const permission of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: permission.id
        }
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: permission.id
      }
    });
  }

  // Assign specific permissions to Manager
  const managerPermissions = ['user:read', 'user:write', 'interface:read', 'interface:write', 'location:read', 'location:write', 'maintenance:read', 'maintenance:write', 'reports:read'];
  for (const permName of managerPermissions) {
    const permission = await prisma.permission.findUnique({ where: { name: permName } });
    if (permission) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: managerRole.id,
            permissionId: permission.id
          }
        },
        update: {},
        create: {
          roleId: managerRole.id,
          permissionId: permission.id
        }
      });
    }
  }

  // Assign specific permissions to Technician
  const technicianPermissions = ['interface:read', 'interface:write', 'location:read', 'maintenance:read', 'maintenance:write'];
  for (const permName of technicianPermissions) {
    const permission = await prisma.permission.findUnique({ where: { name: permName } });
    if (permission) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: technicianRole.id,
            permissionId: permission.id
          }
        },
        update: {},
        create: {
          roleId: technicianRole.id,
          permissionId: permission.id
        }
      });
    }
  }

  // Assign specific permissions to Operator
  const operatorPermissions = ['interface:read', 'location:read', 'maintenance:read'];
  for (const permName of operatorPermissions) {
    const permission = await prisma.permission.findUnique({ where: { name: permName } });
    if (permission) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: operatorRole.id,
            permissionId: permission.id
          }
        },
        update: {},
        create: {
          roleId: operatorRole.id,
          permissionId: permission.id
        }
      });
    }
  }

  // Create default admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@factory.com' },
    update: {},
    create: {
      matricule: 'ADM001',
      email: 'admin@factory.com',
      password: hashedPassword,
      firstName: 'System',
      lastName: 'Administrator',
      phoneNumber: '+1234567890',
      roleId: adminRole.id
    }
  });

  // Create sample locations
  const locations = [
    { name: 'Main Storage', description: 'Primary storage facility', address: 'Building A, Floor 1' },
    { name: 'Lab 1', description: 'Testing laboratory 1', address: 'Building B, Floor 2' },
    { name: 'Lab 2', description: 'Testing laboratory 2', address: 'Building B, Floor 3' },
    { name: 'Maintenance Shop', description: 'Equipment maintenance facility', address: 'Building C, Floor 1' },
    { name: 'Quality Control', description: 'Quality control department', address: 'Building A, Floor 3' }
  ];

  console.log('Creating sample locations...');
  for (const location of locations) {
    await prisma.location.upsert({
      where: { name: location.name },
      update: {},
      create: location
    });
  }

  // Create sample interfaces
  const mainStorage = await prisma.location.findUnique({ where: { name: 'Main Storage' } });
  const interfaces = [
    {
      interfaceName: 'Temperature Sensor TS-001',
      serialNumber: 1001,
      description: 'High precision temperature sensor',
      type: 'Sensor',
      currentLocationId: mainStorage.id,
      qrCodeData: 'TS001-TEMP-SENSOR'
    },
    {
      interfaceName: 'Pressure Gauge PG-002',
      serialNumber: 1002,
      description: 'Industrial pressure measurement device',
      type: 'Gauge',
      currentLocationId: mainStorage.id,
      qrCodeData: 'PG002-PRESSURE-GAUGE'
    },
    {
      interfaceName: 'Flow Meter FM-003',
      serialNumber: 1003,
      description: 'Liquid flow measurement instrument',
      type: 'Meter',
      currentLocationId: mainStorage.id,
      qrCodeData: 'FM003-FLOW-METER'
    }
  ];

  console.log('Creating sample interfaces...');
  for (const interfaceData of interfaces) {
    await prisma.interface.upsert({
      where: { serialNumber: interfaceData.serialNumber },
      update: {},
      create: interfaceData
    });
  }

  console.log('✅ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

