import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Monitor, 
  MapPin, 
  Wrench,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Loader2,
  Download
} from 'lucide-react';
import {
  useUserStatistics,
  useInterfaceStatistics,
  useLocationStatistics,
  useMaintenanceStatistics,
  useInterfaces,
  useLocations,
  useMaintenanceTickets
} from '../hooks/useApi';
import { 
  formatNumber, 
  formatPercentage, 
  formatRelativeTime,
  capitalizeFirst,
  cn
} from '../lib/utils';

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('7d');

  // API hooks
  const { data: userStats, isLoading: loadingUsers } = useUserStatistics();
  const { data: interfaceStats, isLoading: loadingInterfaces } = useInterfaceStatistics();
  const { data: locationStats, isLoading: loadingLocations } = useLocationStatistics();
  const { data: maintenanceStats, isLoading: loadingMaintenance } = useMaintenanceStatistics();
  
  // Get detailed data
  const { data: interfacesResponse } = useInterfaces({ limit: 1000 });
  const { data: locationsResponse } = useLocations({ limit: 100 });
  const { data: maintenanceResponse } = useMaintenanceTickets({ limit: 1000 });

  const isLoading = loadingUsers || loadingInterfaces || loadingLocations || loadingMaintenance;

  // Extract data arrays
  const interfaces = useMemo(() => {
    return interfacesResponse?.interfaces || interfacesResponse?.data?.interfaces || [];
  }, [interfacesResponse]);

  const locations = useMemo(() => {
    return locationsResponse?.locations || locationsResponse || [];
  }, [locationsResponse]);

  const maintenanceTickets = useMemo(() => {
    return maintenanceResponse?.tickets || maintenanceResponse || [];
  }, [maintenanceResponse]);

  // Process interface status distribution
  const interfaceStatusData = useMemo(() => {
    if (!interfaceStats?.statusDistribution) return [];
    
    const colors = {
      'AVAILABLE': '#10B981',
      'IN_USE': '#3B82F6',
      'UNDER_MAINTENANCE': '#F59E0B',
      'RETIRED': '#6B7280',
      'DISPOSED': '#EF4444'
    };

    return interfaceStats.statusDistribution.map(item => ({
      name: capitalizeFirst(item.status.replace(/_/g, ' ').toLowerCase()),
      value: item.count,
      color: colors[item.status] || '#6B7280',
      percentage: formatPercentage(item.count, interfaceStats.total)
    }));
  }, [interfaceStats]);

  // Process maintenance types distribution
  const maintenanceTypesData = useMemo(() => {
    if (!maintenanceStats?.typeDistribution) return [];
    
    const colors = {
      'CORRECTIVE': '#EF4444',
      'PREVENTIVE': '#10B981',
      'CALIBRATION': '#3B82F6',
      'UPGRADE': '#8B5CF6',
      'INSPECTION': '#F59E0B'
    };

    return maintenanceStats.typeDistribution.map(item => ({
      name: capitalizeFirst(item.type.toLowerCase()),
      value: item.count,
      color: colors[item.type] || '#6B7280'
    }));
  }, [maintenanceStats]);

  // Process maintenance status distribution
  const maintenanceStatusData = useMemo(() => {
    if (!maintenanceStats?.statusDistribution) return [];
    
    const colors = {
      'OPEN': '#EF4444',
      'IN_PROGRESS': '#F59E0B',
      'RESOLVED': '#10B981',
      'CLOSED': '#6B7280',
      'ON_HOLD': '#F97316'
    };

    return maintenanceStats.statusDistribution.map(item => ({
      name: capitalizeFirst(item.status.replace(/_/g, ' ').toLowerCase()),
      value: item.count,
      color: colors[item.status] || '#6B7280'
    }));
  }, [maintenanceStats]);

  // Process location utilization
  const locationUtilizationData = useMemo(() => {
    if (!locations || locations.length === 0) return [];
    
    return locations
      .map(location => ({
        name: location.name || 'Unknown',
        utilization: location._count?.interfaces || 0,
        capacity: location.capacity || 100,
        percentage: formatPercentage(
          location._count?.interfaces || 0, 
          location.capacity || 100
        )
      }))
      .sort((a, b) => b.utilization - a.utilization)
      .slice(0, 5); // Top 5 locations
  }, [locations]);

  // Calculate utilization rate
  const utilizationRate = useMemo(() => {
    if (!interfaceStats?.statusDistribution) return '0%';
    const inUse = interfaceStats.statusDistribution.find(s => s.status === 'IN_USE')?.count || 0;
    const total = interfaceStats.total || 1;
    return formatPercentage(inUse, total);
  }, [interfaceStats]);

  // Calculate availability rate
  const availabilityRate = useMemo(() => {
    if (!interfaceStats?.statusDistribution) return '0%';
    const available = interfaceStats.statusDistribution.find(s => s.status === 'AVAILABLE')?.count || 0;
    const total = interfaceStats.total || 1;
    return formatPercentage(available, total);
  }, [interfaceStats]);

  // Handle export
  const handleExport = () => {
    const data = {
      userStats,
      interfaceStats,
      locationStats,
      maintenanceStats,
      generatedAt: new Date().toISOString(),
      timeRange
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const StatCard = ({ title, value, change, changeType, icon: Icon, color = 'blue', isLoading }) => {
    const colorClasses = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      red: 'bg-red-100 text-red-600',
      purple: 'bg-purple-100 text-purple-600'
    };

    if (isLoading) {
      return (
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-center h-24">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {change && (
              <div className="flex items-center mt-2">
                {changeType === 'increase' ? (
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={cn(
                  'text-sm font-medium',
                  changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                )}>
                  {change}
                </span>
                <span className="text-sm text-gray-500 ml-1">vs last period</span>
              </div>
            )}
          </div>
          <div className={cn('p-4 rounded-lg', colorClasses[color])}>
            <Icon className="w-7 h-7" />
          </div>
        </div>
      </div>
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-600">{entry.name}:</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {formatNumber(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const EmptyState = ({ message = "No data available" }) => (
    <div className="h-[300px] flex flex-col items-center justify-center text-gray-500">
      <Activity className="w-12 h-12 mb-2 text-gray-300" />
      <p className="text-sm">{message}</p>
    </div>
  );

  if (isLoading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
        <span className="text-lg text-gray-600">Loading analytics dashboard...</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">System performance and usage insights</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
          <button 
            onClick={handleExport}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Download size={18} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Interfaces"
          value={formatNumber(interfaceStats?.total || 0)}
          icon={Monitor}
          color="blue"
          isLoading={loadingInterfaces}
        />
        <StatCard
          title="Active Users"
          value={formatNumber(userStats?.total || 0)}
          icon={Users}
          color="green"
          isLoading={loadingUsers}
        />
        <StatCard
          title="Open Tickets"
          value={formatNumber(maintenanceStats?.open || 0)}
          icon={AlertTriangle}
          color="yellow"
          isLoading={loadingMaintenance}
        />
        <StatCard
          title="Locations"
          value={formatNumber(locationStats?.total || 0)}
          icon={MapPin}
          color="purple"
          isLoading={loadingLocations}
        />
        <StatCard
          title="Utilization"
          value={utilizationRate}
          icon={Activity}
          color="blue"
          isLoading={loadingInterfaces}
        />
      </div>

      {/* Charts Row 1 - Status Distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interface Status Distribution */}
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Interface Status</h3>
            <span className="text-sm text-gray-500">
              Total: {formatNumber(interfaceStats?.total || 0)}
            </span>
          </div>
          {interfaceStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={interfaceStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percentage }) => `${name} (${percentage})`}
                  labelLine={false}
                >
                  {interfaceStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState message="No interface data available" />
          )}
        </div>

        {/* Maintenance Status Distribution */}
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Maintenance Status</h3>
            <span className="text-sm text-gray-500">
              Total: {formatNumber(maintenanceStats?.total || 0)}
            </span>
          </div>
          {maintenanceStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={maintenanceStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name} (${value})`}
                  labelLine={false}
                >
                  {maintenanceStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState message="No maintenance data available" />
          )}
        </div>
      </div>

      {/* Charts Row 2 - Bar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Maintenance Types */}
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Maintenance by Type</h3>
          {maintenanceTypesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={maintenanceTypesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {maintenanceTypesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState message="No maintenance type data available" />
          )}
        </div>

        {/* Location Utilization */}
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Location Utilization</h3>
          {locationUtilizationData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={locationUtilizationData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="utilization" fill="#10B981" name="Current" radius={[0, 8, 8, 0]} />
                <Bar dataKey="capacity" fill="#E5E7EB" name="Capacity" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState message="No location data available" />
          )}
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Detailed Statistics</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Interface Metrics */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Monitor className="w-4 h-4" />
                Interface Metrics
              </h4>
              <div className="space-y-3">
                {interfaceStats?.statusDistribution?.map((status) => (
                  <div key={status.status} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 capitalize">
                      {status.status.replace(/_/g, ' ').toLowerCase()}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatNumber(status.count)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-3 border-t">
                  <span className="text-sm font-medium text-gray-900">Total</span>
                  <span className="text-sm font-bold text-blue-600">
                    {formatNumber(interfaceStats?.total || 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Maintenance Metrics */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Wrench className="w-4 h-4" />
                Maintenance Metrics
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Open Tickets</span>
                  <span className="text-sm font-semibold text-red-600">
                    {formatNumber(maintenanceStats?.open || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">In Progress</span>
                  <span className="text-sm font-semibold text-yellow-600">
                    {formatNumber(maintenanceStats?.inProgress || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="text-sm font-semibold text-green-600">
                    {formatNumber(maintenanceStats?.completed || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t">
                  <span className="text-sm font-medium text-gray-900">Total</span>
                  <span className="text-sm font-bold text-blue-600">
                    {formatNumber(maintenanceStats?.total || 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* User Metrics */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Users className="w-4 h-4" />
                User Metrics
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Users</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatNumber(userStats?.total || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Recent Users</span>
                  <span className="text-sm font-semibold text-green-600">
                    {formatNumber(userStats?.recentUsers || 0)}
                  </span>
                </div>
                {userStats?.roleDistribution?.slice(0, 2).map((role) => (
                  <div key={role.roleId} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{role.roleName}</span>
                    <span className="text-sm font-semibold text-blue-600">
                      {formatNumber(role.count)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location Metrics */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location Metrics
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Locations</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatNumber(locationStats?.total || 0)}
                  </span>
                </div>
                {locationStats?.typeDistribution?.slice(0, 3).map((type) => (
                  <div key={type.type} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 capitalize">
                      {type.type.toLowerCase()}
                    </span>
                    <span className="text-sm font-semibold text-blue-600">
                      {formatNumber(type.count)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">System Health Indicators</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Availability */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-gray-700">Interface Availability</span>
                <span className="text-sm font-bold text-gray-900">{availabilityRate}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 rounded-full bg-green-500 transition-all duration-500"
                  style={{ width: availabilityRate }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {interfaceStats?.statusDistribution?.find(s => s.status === 'AVAILABLE')?.count || 0} interfaces available
              </p>
            </div>

            {/* Utilization */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-gray-700">Overall Utilization</span>
                <span className="text-sm font-bold text-gray-900">{utilizationRate}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 rounded-full bg-blue-500 transition-all duration-500"
                  style={{ width: utilizationRate }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {interfaceStats?.statusDistribution?.find(s => s.status === 'IN_USE')?.count || 0} interfaces in use
              </p>
            </div>

            {/* Maintenance Load */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-gray-700">Maintenance Load</span>
                <span className="text-sm font-bold text-gray-900">
                  {maintenanceStats?.total > 0
                    ? formatPercentage(maintenanceStats.open || 0, maintenanceStats.total)
                    : '0%'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 rounded-full bg-yellow-500 transition-all duration-500"
                  style={{ 
                    width: maintenanceStats?.total > 0
                      ? formatPercentage(maintenanceStats.open || 0, maintenanceStats.total)
                      : '0%'
                  }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {formatNumber(maintenanceStats?.open || 0)} open tickets
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;