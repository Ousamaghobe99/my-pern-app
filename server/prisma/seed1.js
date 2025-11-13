import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// --- 1. Define the Permission Map ---
// Define which permissions belong to which role (using the new names)
const ROLE_PERMISSIONS_MAP = {
    // Administrator: Should get all permissions (handled dynamically below)

    // PreventiveTechnician: Permissions focused on interfaces and maintenance
    PreventiveTechnician: [
        'interface:read', 
        'interface:write', 
        'location:read', 
        'maintenance:read', 
        'maintenance:write'
    ],

    // CorrectiveTechnician: Permissions for fixing issues
    CorrectiveTechnician: [
        'interface:read', 
        'interface:write', 
        'location:read', 
        'maintenance:read', 
        'maintenance:write'
    ],

    // QualityTechnician: Permissions for oversight and validation
    QualityTechnician: [
        'interface:read', 
        'location:read', 
        'maintenance:read', 
        'reports:read', 
        'maintenance:write'
    ],
};


async function seedNewData() {
    console.log('Starting role permission seeding...');

    // --- 2. Fetch Existing Role IDs and Permission IDs ---

    // Fetch all existing roles
    const roles = await prisma.role.findMany();
    const roleMap = roles.reduce((map, role) => {
        map[role.name] = role.id;
        return map;
    }, {});

    // Fetch all existing permissions
    const permissions = await prisma.permission.findMany();
    const permissionMap = permissions.reduce((map, perm) => {
        map[perm.name] = perm.id;
        return map;
    }, {});
    
    // --- 3. Clean up existing permissions (Optional but Recommended) ---
    // If you want to overwrite all permissions for these roles, delete existing ones first.
    
    /*
    const roleIdsToClean = Object.values(roleMap).filter(id => id !== roleMap['Administrator']); 
    await prisma.rolePermission.deleteMany({
        where: {
            roleId: {
                in: roleIdsToClean
            }
        }
    });
    console.log(`Cleaned up existing permissions for ${roleIdsToClean.length} roles.`);
    */


    // --- 4. Assign Permissions to Roles ---
    const transactions = [];

    // 4a. Handle Administrator (Assign ALL permissions)
    const adminPermsToCreate = permissions.map(perm => ({
        roleId: roleMap['Administrator'],
        permissionId: perm.id,
    }));
    transactions.push(
        prisma.rolePermission.createMany({
            data: adminPermsToCreate,
            skipDuplicates: true,
        })
    );
    console.log(`Assigned all permissions to Administrator (${adminPermsToCreate.length} permissions).`);


    // 4b. Handle Technician Roles
    for (const [roleName, requiredPermissions] of Object.entries(ROLE_PERMISSIONS_MAP)) {
        if (!roleMap[roleName]) {
            console.error(`Error: Role ${roleName} not found. Skipping permissions assignment.`);
            continue;
        }

        const roleId = roleMap[roleName];
        
        const permsToCreate = requiredPermissions
            .map(permName => {
                const permissionId = permissionMap[permName];
                if (!permissionId) {
                    console.error(`Warning: Permission ${permName} not found. Skipping.`);
                    return null;
                }
                return { roleId, permissionId };
            })
            .filter(Boolean); // Filter out nulls (missing permissions)

        transactions.push(
            prisma.rolePermission.createMany({
                data: permsToCreate,
                skipDuplicates: true,
            })
        );
        console.log(`Assigned ${permsToCreate.length} permissions to ${roleName}.`);
    }

    // --- 5. Execute all transactions ---
    await prisma.$transaction(transactions);
    console.log('Role permissions seeding complete.');
}

// Ensure you run this function as part of your main seed process
// seedNewData()