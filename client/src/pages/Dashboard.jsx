import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Package, MapPin, Wrench, Users, BarChart3, Loader2, TrendingUp, AlertCircle } from 'lucide-react';
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

  // Debug logging - can be removed after verification
  useEffect(() => {
    if (maintenanceStats) {
      console.log('Maintenance Stats:', maintenanceStats);
    }
  }, [maintenanceStats]);

  const isLoading = userStatsLoading || interfaceStatsLoading || locationStatsLoading || maintenanceStatsLoading;

  // Role-based stats configuration
  const getStatsForRole = (role) => {
    // Get counts from API response - backend returns 'count' property
    const getStatusCount = (statusArray, statusName) => {
      if (!statusArray || !Array.isArray(statusArray)) return 0;
      const found = statusArray.find(s => s.status === statusName);
      return found?.count || 0;
    };

    const getPriorityCount = (priorityArray, priorityName) => {
      if (!priorityArray || !Array.isArray(priorityArray)) return 0;
      const found = priorityArray.find(p => p.priority === priorityName);
      return found?.count || 0;
    };

    const baseStats = {
      totalInterfaces: interfaceStats?.total || 0,
      availableInterfaces: getStatusCount(interfaceStats?.byStatus, 'Available'),
      inUseInterfaces: getStatusCount(interfaceStats?.byStatus, 'InUse'),
      maintenanceInterfaces: getStatusCount(interfaceStats?.byStatus, 'UnderMaintenance'),
      totalLocations: locationStats?.total || 0,
      totalUsers: userStats?.total || 0,
      openTickets: getStatusCount(maintenanceStats?.byStatus, 'Open'),
      criticalTickets: getPriorityCount(maintenanceStats?.byPriority, 'Critical'),
    };

    switch (role) {
      case 'Administrator':
        return [
          { 
            title: 'Total Interfaces', 
            value: formatNumber(baseStats.totalInterfaces), 
            icon: Package, 
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            description: 'All interfaces in system',
            trend: '+12%'
          },
          { 
            title: 'Total Locations', 
            value: formatNumber(baseStats.totalLocations), 
            icon: MapPin, 
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            description: 'Facility locations',
            trend: '+2'
          },
          { 
            title: 'Open Tickets', 
            value: formatNumber(baseStats.openTickets), 
            icon: Wrench, 
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            description: 'Maintenance tickets',
            trend: baseStats.openTickets > 5 ? 'High' : 'Normal'
          },
          { 
            title: 'Total Users', 
            value: formatNumber(baseStats.totalUsers), 
            icon: Users, 
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            description: 'System users',
            trend: '+5'
          },
        ];
      
      case 'Manager':
        return [
          { 
            title: 'Interfaces in Use', 
            value: formatNumber(baseStats.inUseInterfaces), 
            icon: Package, 
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            description: 'Currently active',
            trend: '75%'
          },
          { 
            title: 'Available Interfaces', 
            value: formatNumber(baseStats.availableInterfaces), 
            icon: Package, 
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            description: 'Ready for deployment',
            trend: '25%'
          },
          { 
            title: 'Critical Tickets', 
            value: formatNumber(baseStats.criticalTickets), 
            icon: AlertCircle, 
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            description: 'High priority issues',
            trend: baseStats.criticalTickets > 0 ? 'Action Required' : 'Good'
          },
          { 
            title: 'Locations', 
            value: formatNumber(baseStats.totalLocations), 
            icon: MapPin, 
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            description: 'Managed facilities',
            trend: 'Active'
          },
        ];
      
      case 'Technician':
        return [
          { 
            title: 'Open Tickets', 
            value: formatNumber(baseStats.openTickets), 
            icon: Wrench, 
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            description: 'Pending maintenance',
            trend: baseStats.openTickets > 5 ? 'High Load' : 'Normal'
          },
          { 
            title: 'Under Maintenance', 
            value: formatNumber(baseStats.maintenanceInterfaces), 
            icon: Package, 
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
            description: 'Interfaces being serviced',
            trend: 'In Progress'
          },
          { 
            title: 'Critical Priority', 
            value: formatNumber(baseStats.criticalTickets), 
            icon: AlertCircle, 
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            description: 'Urgent repairs needed',
            trend: baseStats.criticalTickets > 0 ? '⚠️ Urgent' : '✓ Clear'
          },
        ];
      
      case 'Operator':
      default:
        return [
          { 
            title: 'Available Interfaces', 
            value: formatNumber(baseStats.availableInterfaces), 
            icon: Package, 
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            description: 'Ready for use',
            trend: 'Ready'
          },
          { 
            title: 'In Use', 
            value: formatNumber(baseStats.inUseInterfaces), 
            icon: Package, 
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            description: 'Currently deployed',
            trend: 'Active'
          },
          { 
            title: 'Locations', 
            value: formatNumber(baseStats.totalLocations), 
            icon: MapPin, 
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            description: 'Available locations',
            trend: 'All Active'
          },
        ];
    }
  };

  const userRole = user?.role?.name || 'Operator';
  const dashboardStats = getStatsForRole(userRole);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      'Available': 'bg-green-500',
      'InUse': 'bg-blue-500',
      'UnderMaintenance': 'bg-yellow-500',
      'Retired': 'bg-gray-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const totalInterfaceCount = interfaceStats?.byStatus?.reduce((sum, item) => sum + (item.count || 0), 0) || 1;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold">Welcome back, {user?.firstName || 'User'}! 👋</h1>
        <p className="text-blue-100 mt-2">
          Role: {userRole} • {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {stat.description}
                </p>
                {stat.trend && (
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span className="text-xs font-medium text-green-600">{stat.trend}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Interface Status Distribution */}
        <Card className="col-span-4 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Interface Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {interfaceStats?.byStatus && interfaceStats.byStatus.length > 0 ? (
              <div className="space-y-4">
                {interfaceStats.byStatus.map((statusItem) => {
                  const count = statusItem.count || 0;
                  const percentage = ((count / totalInterfaceCount) * 100).toFixed(1);
                  return (
                    <div key={statusItem.status} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">{statusItem.status}</span>
                        <span className="text-sm font-bold text-gray-900">{count} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div 
                          className={`h-3 rounded-full ${getStatusColor(statusItem.status)} transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-400">
                No interface data available
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Maintenance Overview */}
        <Card className="col-span-3 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Maintenance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {maintenanceStats?.byStatus && maintenanceStats.byStatus.length > 0 ? (
              <div className="space-y-4">
                {maintenanceStats.byStatus.map((statusItem) => {
                  const count = statusItem.count || 0;
                  return (
                    <div key={statusItem.status} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          statusItem.status === 'Open' ? 'bg-red-500' : 
                          statusItem.status === 'InProgress' ? 'bg-yellow-500' : 
                          'bg-green-500'
                        }`} />
                        <span className="text-sm font-medium text-gray-700">{statusItem.status}</span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">{count}</span>
                    </div>
                  );
                })}
                {maintenanceStats?.byPriority && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">
                        {maintenanceStats.byPriority.find(p => p.priority === 'Critical')?.count || 0} Critical Priority Tickets
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-400">
                No maintenance data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;