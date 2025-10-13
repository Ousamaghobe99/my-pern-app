import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Package, MapPin, Wrench, Users, BarChart3, Loader2 } from 'lucide-react';
import { 
  useUserStatistics, 
  useInterfaceStatistics, 
  useLocationStatistics, 
  useMaintenanceStatistics 
} from '../hooks/useApi';
import { formatNumber } from '../lib/utils';

const Dashboard = () => {
  const { user } = useAuth();
  
  // Fetch statistics from API
  const { data: userStats, isLoading: userStatsLoading } = useUserStatistics();
  const { data: interfaceStats, isLoading: interfaceStatsLoading } = useInterfaceStatistics();
  const { data: locationStats, isLoading: locationStatsLoading } = useLocationStatistics();
  const { data: maintenanceStats, isLoading: maintenanceStatsLoading } = useMaintenanceStatistics();

  const isLoading = userStatsLoading || interfaceStatsLoading || locationStatsLoading || maintenanceStatsLoading;

  // Role-based stats configuration
  const getStatsForRole = (role) => {
    const baseStats = {
      totalInterfaces: interfaceStats?.total || 0,
      availableInterfaces: interfaceStats?.byStatus?.find(s => s.status === 'Available')?._count || 0,
      inUseInterfaces: interfaceStats?.byStatus?.find(s => s.status === 'InUse')?._count || 0,
      maintenanceInterfaces: interfaceStats?.byStatus?.find(s => s.status === 'UnderMaintenance')?._count || 0,
      totalLocations: locationStats?.total || 0,
      totalUsers: userStats?.total || 0,
      openTickets: maintenanceStats?.byStatus?.find(s => s.status === 'Open')?._count || 0,
      criticalTickets: maintenanceStats?.byPriority?.find(p => p.priority === 'Critical')?._count || 0,
    };

    switch (role) {
      case 'Administrator':
        return [
          { 
            title: 'Total Interfaces', 
            value: formatNumber(baseStats.totalInterfaces), 
            icon: Package, 
            color: 'text-blue-500',
            description: 'All interfaces in system'
          },
          { 
            title: 'Total Locations', 
            value: formatNumber(baseStats.totalLocations), 
            icon: MapPin, 
            color: 'text-green-500',
            description: 'Facility locations'
          },
          { 
            title: 'Open Tickets', 
            value: formatNumber(baseStats.openTickets), 
            icon: Wrench, 
            color: 'text-red-500',
            description: 'Maintenance tickets'
          },
          { 
            title: 'Total Users', 
            value: formatNumber(baseStats.totalUsers), 
            icon: Users, 
            color: 'text-purple-500',
            description: 'System users'
          },
        ];
      
      case 'Manager':
        return [
          { 
            title: 'Interfaces in Use', 
            value: formatNumber(baseStats.inUseInterfaces), 
            icon: Package, 
            color: 'text-blue-500',
            description: 'Currently active'
          },
          { 
            title: 'Available Interfaces', 
            value: formatNumber(baseStats.availableInterfaces), 
            icon: Package, 
            color: 'text-green-500',
            description: 'Ready for deployment'
          },
          { 
            title: 'Critical Tickets', 
            value: formatNumber(baseStats.criticalTickets), 
            icon: Wrench, 
            color: 'text-red-500',
            description: 'High priority issues'
          },
          { 
            title: 'Locations', 
            value: formatNumber(baseStats.totalLocations), 
            icon: MapPin, 
            color: 'text-purple-500',
            description: 'Managed facilities'
          },
        ];
      
      case 'Technician':
        return [
          { 
            title: 'Open Tickets', 
            value: formatNumber(baseStats.openTickets), 
            icon: Wrench, 
            color: 'text-red-500',
            description: 'Pending maintenance'
          },
          { 
            title: 'Under Maintenance', 
            value: formatNumber(baseStats.maintenanceInterfaces), 
            icon: Package, 
            color: 'text-yellow-500',
            description: 'Interfaces being serviced'
          },
          { 
            title: 'Critical Priority', 
            value: formatNumber(baseStats.criticalTickets), 
            icon: BarChart3, 
            color: 'text-red-500',
            description: 'Urgent repairs needed'
          },
        ];
      
      case 'Operator':
      default:
        return [
          { 
            title: 'Available Interfaces', 
            value: formatNumber(baseStats.availableInterfaces), 
            icon: Package, 
            color: 'text-green-500',
            description: 'Ready for use'
          },
          { 
            title: 'In Use', 
            value: formatNumber(baseStats.inUseInterfaces), 
            icon: Package, 
            color: 'text-blue-500',
            description: 'Currently deployed'
          },
          { 
            title: 'Locations', 
            value: formatNumber(baseStats.totalLocations), 
            icon: MapPin, 
            color: 'text-purple-500',
            description: 'Available locations'
          },
        ];
    }
  };

  const userRole = user?.role?.name || 'Operator';
  const dashboardStats = getStatsForRole(userRole);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {user?.firstName || 'User'}!</h1>
        <p className="text-muted-foreground">Your role: {userRole}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts and recent activity - placeholder for now */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Interface Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              {interfaceStats?.byStatus ? (
                <div className="space-y-4 w-full">
                  {interfaceStats.byStatus.map((statusItem) => (
                    <div key={statusItem.status} className="flex justify-between items-center">
                      <span className="text-sm font-medium">{statusItem.status}</span>
                      <span className="text-lg font-bold">{statusItem._count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                '[Chart Placeholder - Interface Status Distribution]'
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              [Recent Activity List - Coming Soon]
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

