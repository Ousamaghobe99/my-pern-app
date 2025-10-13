import React, { useState } from 'react';
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
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Monitor, 
  MapPin, 
  Wrench,
  Calendar,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter
} from 'lucide-react';
import {
  useUserStatistics,
  useInterfaceStatistics,
  useLocationStatistics,
  useMaintenanceStatistics
} from '../hooks/useApi';

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('all');

  // API hooks
  const { data: userStats = {} } = useUserStatistics();
  const { data: interfaceStats = {} } = useInterfaceStatistics();
  const { data: locationStats = {} } = useLocationStatistics();
  const { data: maintenanceStats = {} } = useMaintenanceStatistics();

  // Mock data for charts - in real app, this would come from your API
  const interfaceStatusData = [
    { name: 'Available', value: 45, color: '#10B981' },
    { name: 'In Use', value: 30, color: '#3B82F6' },
    { name: 'Under Maintenance', value: 15, color: '#F59E0B' },
    { name: 'Retired', value: 8, color: '#6B7280' },
    { name: 'Disposed', value: 2, color: '#EF4444' }
  ];

  const maintenanceTypesData = [
    { name: 'Corrective', value: 35, color: '#EF4444' },
    { name: 'Preventive', value: 40, color: '#10B981' },
    { name: 'Calibration', value: 15, color: '#3B82F6' },
    { name: 'Upgrade', value: 8, color: '#8B5CF6' },
    { name: 'Inspection', value: 2, color: '#F59E0B' }
  ];

  const monthlyTrendsData = [
    { month: 'Jan', interfaces: 85, maintenance: 12, users: 45 },
    { month: 'Feb', interfaces: 88, maintenance: 15, users: 48 },
    { month: 'Mar', interfaces: 92, maintenance: 18, users: 52 },
    { month: 'Apr', interfaces: 89, maintenance: 14, users: 55 },
    { month: 'May', interfaces: 95, maintenance: 20, users: 58 },
    { month: 'Jun', interfaces: 98, maintenance: 16, users: 62 },
    { month: 'Jul', interfaces: 100, maintenance: 22, users: 65 }
  ];

  const locationUtilizationData = [
    { name: 'Lab A', utilization: 85, capacity: 100 },
    { name: 'Lab B', utilization: 72, capacity: 80 },
    { name: 'Storage', utilization: 45, capacity: 200 },
    { name: 'Maintenance', utilization: 30, capacity: 50 },
    { name: 'Lab C', utilization: 68, capacity: 90 }
  ];

  const usagePatternData = [
    { hour: '00', usage: 5 },
    { hour: '02', usage: 3 },
    { hour: '04', usage: 2 },
    { hour: '06', usage: 8 },
    { hour: '08', usage: 25 },
    { hour: '10', usage: 45 },
    { hour: '12', usage: 38 },
    { hour: '14', usage: 52 },
    { hour: '16', usage: 48 },
    { hour: '18', usage: 35 },
    { hour: '20', usage: 22 },
    { hour: '22', usage: 12 }
  ];

  const StatCard = ({ title, value, change, changeType, icon: Icon, color = 'blue' }) => {
    const colorClasses = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      red: 'bg-red-100 text-red-600',
      purple: 'bg-purple-100 text-purple-600'
    };

    return (
      <div className="bg-white p-6 rounded-lg border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {change && (
              <div className="flex items-center mt-2">
                {changeType === 'increase' ? (
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                  {change}
                </span>
                <span className="text-sm text-gray-500 ml-1">vs last period</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </div>
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">System performance and usage insights</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Filter size={18} />
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Interfaces"
          value={interfaceStats.total || 100}
          change="+12%"
          changeType="increase"
          icon={Monitor}
          color="blue"
        />
        <StatCard
          title="Active Users"
          value={userStats.active || 65}
          change="+8%"
          changeType="increase"
          icon={Users}
          color="green"
        />
        <StatCard
          title="Open Tickets"
          value={maintenanceStats.open || 23}
          change="-5%"
          changeType="decrease"
          icon={AlertTriangle}
          color="yellow"
        />
        <StatCard
          title="Locations"
          value={locationStats.total || 15}
          change="+2%"
          changeType="increase"
          icon={MapPin}
          color="purple"
        />
        <StatCard
          title="Avg Utilization"
          value="78%"
          change="+3%"
          changeType="increase"
          icon={Activity}
          color="blue"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interface Status Distribution */}
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Interface Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={interfaceStatusData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {interfaceStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Maintenance Types */}
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Maintenance Types</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={maintenanceTypesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Monthly Trends */}
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={monthlyTrendsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="interfaces" 
                stroke="#3B82F6" 
                name="Interfaces"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="maintenance" 
                stroke="#EF4444" 
                name="Maintenance Tickets"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="#10B981" 
                name="Active Users"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Location Utilization */}
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Location Utilization</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={locationUtilizationData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="utilization" fill="#10B981" />
              <Bar dataKey="capacity" fill="#E5E7EB" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Usage Patterns */}
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Usage Pattern</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={usagePatternData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="usage" 
                stroke="#3B82F6" 
                fill="#3B82F6" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Stats Table */}
      <div className="bg-white rounded-lg border">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Quick Statistics</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Interface Stats */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Interface Metrics</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Available</span>
                  <span className="text-sm font-medium text-green-600">45</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">In Use</span>
                  <span className="text-sm font-medium text-blue-600">30</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Maintenance</span>
                  <span className="text-sm font-medium text-yellow-600">15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Utilization Rate</span>
                  <span className="text-sm font-medium text-gray-900">67%</span>
                </div>
              </div>
            </div>

            {/* Maintenance Stats */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Maintenance Metrics</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Open Tickets</span>
                  <span className="text-sm font-medium text-red-600">23</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">In Progress</span>
                  <span className="text-sm font-medium text-yellow-600">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Resolved Today</span>
                  <span className="text-sm font-medium text-green-600">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Avg Resolution Time</span>
                  <span className="text-sm font-medium text-gray-900">2.3 days</span>
                </div>
              </div>
            </div>

            {/* User Stats */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">User Metrics</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Users</span>
                  <span className="text-sm font-medium text-gray-900">65</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Active Today</span>
                  <span className="text-sm font-medium text-green-600">45</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">New This Month</span>
                  <span className="text-sm font-medium text-blue-600">7</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Activity Rate</span>
                  <span className="text-sm font-medium text-gray-900">69%</span>
                </div>
              </div>
            </div>

            {/* Location Stats */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Location Metrics</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Locations</span>
                  <span className="text-sm font-medium text-gray-900">15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">At Capacity</span>
                  <span className="text-sm font-medium text-red-600">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Low Usage</span>
                  <span className="text-sm font-medium text-yellow-600">5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Avg Occupancy</span>
                  <span className="text-sm font-medium text-gray-900">72%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Movements */}
        <div className="bg-white rounded-lg border">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Recent Interface Movements</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { id: 1, interface: 'Device-001', from: 'Lab A', to: 'Maintenance', time: '2 hours ago', type: 'maintenance' },
                { id: 2, interface: 'Device-045', from: 'Storage', to: 'Lab B', time: '4 hours ago', type: 'deployment' },
                { id: 3, interface: 'Device-023', from: 'Lab C', to: 'Storage', time: '6 hours ago', type: 'retrieval' },
                { id: 4, interface: 'Device-078', from: 'Maintenance', to: 'Lab A', time: '8 hours ago', type: 'deployment' },
                { id: 5, interface: 'Device-056', from: 'Lab B', to: 'Calibration', time: '1 day ago', type: 'calibration' }
              ].map((movement) => (
                <div key={movement.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      movement.type === 'maintenance' ? 'bg-yellow-400' :
                      movement.type === 'deployment' ? 'bg-green-400' :
                      movement.type === 'retrieval' ? 'bg-blue-400' :
                      'bg-purple-400'
                    }`}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{movement.interface}</p>
                      <p className="text-xs text-gray-500">{movement.from} → {movement.to}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{movement.time}</p>
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      movement.type === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                      movement.type === 'deployment' ? 'bg-green-100 text-green-800' :
                      movement.type === 'retrieval' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {movement.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-lg border">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { metric: 'Interface Availability', value: 95, status: 'excellent', target: 98 },
                { metric: 'User Satisfaction', value: 88, status: 'good', target: 90 },
                { metric: 'Maintenance Response', value: 92, status: 'good', target: 95 },
                { metric: 'System Uptime', value: 99.8, status: 'excellent', target: 99.5 },
                { metric: 'Location Utilization', value: 78, status: 'fair', target: 85 }
              ].map((health, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">{health.metric}</span>
                    <span className="text-sm text-gray-900">{health.value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        health.status === 'excellent' ? 'bg-green-500' :
                        health.status === 'good' ? 'bg-blue-500' :
                        'bg-yellow-500'
                      }`}
                      style={{ width: `${health.value}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className={`text-xs ${
                      health.status === 'excellent' ? 'text-green-600' :
                      health.status === 'good' ? 'text-blue-600' :
                      'text-yellow-600'
                    }`}>
                      {health.status.charAt(0).toUpperCase() + health.status.slice(1)}
                    </span>
                    <span className="text-xs text-gray-500">Target: {health.target}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Alerts & Notifications */}
      <div className="bg-white rounded-lg border">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">System Alerts & Recommendations</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              {
                type: 'warning',
                title: 'High Maintenance Load',
                message: 'Lab A has 5 interfaces requiring maintenance. Consider redistributing workload.',
                time: '1 hour ago'
              },
              {
                type: 'info',
                title: 'Calibration Due',
                message: '12 interfaces are due for calibration within the next 7 days.',
                time: '3 hours ago'
              },
              {
                type: 'success',
                title: 'Efficiency Improvement',
                message: 'Overall system efficiency has improved by 8% this month.',
                time: '1 day ago'
              }
            ].map((alert, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-gray-50">
                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                  alert.type === 'warning' ? 'bg-yellow-100' :
                  alert.type === 'info' ? 'bg-blue-100' :
                  'bg-green-100'
                }`}>
                  {alert.type === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-600" />}
                  {alert.type === 'info' && <Clock className="w-4 h-4 text-blue-600" />}
                  {alert.type === 'success' && <CheckCircle className="w-4 h-4 text-green-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-2">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;