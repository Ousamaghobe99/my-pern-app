import React, { useState } from 'react';
import { 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  AlertTriangle,
  CheckCircle,
  Clock,
  Wrench,
  Archive
} from 'lucide-react';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('interface-status');
  const [editingItem, setEditingItem] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');

  // Mock data for enum values - in real app, these would come from your API
  const [enumData, setEnumData] = useState({
    'interface-status': [
      { id: 1, name: 'Available', description: 'Ready for use, in designated location', color: 'green', icon: 'CheckCircle', inUse: true },
      { id: 2, name: 'InUse', description: 'Currently being used for a test/task', color: 'blue', icon: 'Clock', inUse: true },
      { id: 3, name: 'UnderMaintenance', description: 'Sent for repair or calibration', color: 'yellow', icon: 'Wrench', inUse: true },
      { id: 4, name: 'Retired', description: 'No longer in active service', color: 'gray', icon: 'Archive', inUse: false },
      { id: 5, name: 'Disposed', description: 'Permanently removed from inventory', color: 'red', icon: 'X', inUse: false }
    ],
    'movement-reason': [
      { id: 1, name: 'Deployment', description: 'Moving to a new active location for use', color: 'green', inUse: true },
      { id: 2, name: 'Retrieval', description: 'Moving from an active location back to storage', color: 'blue', inUse: true },
      { id: 3, name: 'Maintenance', description: 'Moving to a maintenance/repair facility', color: 'yellow', inUse: true },
      { id: 4, name: 'Disposal', description: 'Moving for permanent disposal', color: 'red', inUse: true },
      { id: 5, name: 'Calibration', description: 'Moving for calibration', color: 'purple', inUse: true },
      { id: 6, name: 'TemporaryUse', description: 'Moving for a short-term project', color: 'orange', inUse: true }
    ],
    'maintenance-type': [
      { id: 1, name: 'Corrective', description: 'Fixing an existing issue', color: 'red', inUse: true },
      { id: 2, name: 'Preventive', description: 'Scheduled maintenance to prevent future issues', color: 'green', inUse: true },
      { id: 3, name: 'Calibration', description: 'Adjusting to ensure accuracy', color: 'blue', inUse: true },
      { id: 4, name: 'Upgrade', description: 'Improving hardware/software components', color: 'purple', inUse: true },
      { id: 5, name: 'Inspection', description: 'Routine check-up', color: 'yellow', inUse: true }
    ],
    'maintenance-status': [
      { id: 1, name: 'Open', description: 'Ticket created, awaiting action', color: 'blue', inUse: true },
      { id: 2, name: 'InProgress', description: 'Work has started on the ticket', color: 'yellow', inUse: true },
      { id: 3, name: 'Resolved', description: 'Work completed, solution applied', color: 'green', inUse: true },
      { id: 4, name: 'Closed', description: 'Solution verified, ticket formally closed', color: 'gray', inUse: true },
      { id: 5, name: 'OnHold', description: 'Work temporarily paused', color: 'orange', inUse: true }
    ],
    'priority-status': [
      { id: 1, name: 'Low', description: 'Non-urgent, can be scheduled', color: 'green', inUse: true },
      { id: 2, name: 'Medium', description: 'Normal priority', color: 'yellow', inUse: true },
      { id: 3, name: 'High', description: 'Important, needs attention soon', color: 'orange', inUse: true },
      { id: 4, name: 'Critical', description: 'Requires immediate attention', color: 'red', inUse: true }
    ]
  });

  const tabs = [
    { id: 'interface-status', label: 'Interface Status', icon: 'Settings' },
    { id: 'movement-reason', label: 'Movement Reasons', icon: 'Archive' },
    { id: 'maintenance-type', label: 'Maintenance Types', icon: 'Wrench' },
    { id: 'maintenance-status', label: 'Maintenance Status', icon: 'Clock' },
    { id: 'priority-status', label: 'Priority Levels', icon: 'AlertTriangle' }
  ];

  const colorOptions = [
    { value: 'red', label: 'Red', class: 'bg-red-100 text-red-800' },
    { value: 'yellow', label: 'Yellow', class: 'bg-yellow-100 text-yellow-800' },
    { value: 'green', label: 'Green', class: 'bg-green-100 text-green-800' },
    { value: 'blue', label: 'Blue', class: 'bg-blue-100 text-blue-800' },
    { value: 'purple', label: 'Purple', class: 'bg-purple-100 text-purple-800' },
    { value: 'orange', label: 'Orange', class: 'bg-orange-100 text-orange-800' },
    { value: 'gray', label: 'Gray', class: 'bg-gray-100 text-gray-800' }
  ];

  const getColorClass = (color) => {
    const colorOption = colorOptions.find(option => option.value === color);
    return colorOption ? colorOption.class : 'bg-gray-100 text-gray-800';
  };

  const handleSaveEdit = (id, updatedData) => {
    setEnumData(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].map(item => 
        item.id === id ? { ...item, ...updatedData } : item
      )
    }));
    setEditingItem(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      setEnumData(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].filter(item => item.id !== id)
      }));
    }
  };

  const handleAddNew = () => {
    if (!newItemName.trim()) return;
    
    const newItem = {
      id: Date.now(),
      name: newItemName.trim(),
      description: newItemDescription.trim(),
      color: 'blue',
      inUse: true
    };

    setEnumData(prev => ({
      ...prev,
      [activeTab]: [...prev[activeTab], newItem]
    }));

    setNewItemName('');
    setNewItemDescription('');
    setShowAddModal(false);
  };

  const toggleInUse = (id) => {
    setEnumData(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].map(item => 
        item.id === id ? { ...item, inUse: !item.inUse } : item
      )
    }));
  };

  const EditableItem = ({ item }) => {
    const [editData, setEditData] = useState({
      name: item.name,
      description: item.description,
      color: item.color
    });

    return (
      <tr className="bg-blue-50 border-b border-blue-200">
        <td className="px-6 py-4">
          <input
            type="text"
            value={editData.name}
            onChange={(e) => setEditData({...editData, name: e.target.value})}
            className="w-full px-2 py-1 border rounded text-sm"
          />
        </td>
        <td className="px-6 py-4">
          <textarea
            value={editData.description}
            onChange={(e) => setEditData({...editData, description: e.target.value})}
            className="w-full px-2 py-1 border rounded text-sm resize-none"
            rows={2}
          />
        </td>
        <td className="px-6 py-4">
          <select
            value={editData.color}
            onChange={(e) => setEditData({...editData, color: e.target.value})}
            className="px-2 py-1 border rounded text-sm"
          >
            {colorOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </td>
        <td className="px-6 py-4">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${item.inUse ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {item.inUse ? 'Active' : 'Inactive'}
          </span>
        </td>
        <td className="px-6 py-4 text-right">
          <div className="flex justify-end gap-2">
            <button
              onClick={() => handleSaveEdit(item.id, editData)}
              className="text-green-600 hover:text-green-900 p-1"
            >
              <Save size={16} />
            </button>
            <button
              onClick={() => setEditingItem(null)}
              className="text-gray-600 hover:text-gray-900 p-1"
            >
              <X size={16} />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  const currentData = enumData[activeTab] || [];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600">Manage enum values and system configurations</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {currentData.filter(item => item.inUse).length} active / {currentData.length} total
          </span>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={20} />
            Add New
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              {tabs.find(tab => tab.id === activeTab)?.label}
            </h2>
            <div className="text-sm text-gray-500">
              Manage the available options for {tabs.find(tab => tab.id === activeTab)?.label.toLowerCase()}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Display Color
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentData.map((item) => (
                  editingItem === item.id ? (
                    <EditableItem key={item.id} item={item} />
                  ) : (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {item.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {item.description}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getColorClass(item.color)}`}>
                          {item.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleInUse(item.id)}
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer ${
                            item.inUse ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {item.inUse ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingItem(item.id)}
                            className="text-indigo-600 hover:text-indigo-900 p-1"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-900 p-1"
                            disabled={item.inUse}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
          </div>

          {currentData.length === 0 && (
            <div className="text-center py-12">
              <Settings className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No items found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by adding a new enum value.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add New Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter item name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newItemDescription}
                  onChange={(e) => setNewItemDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Enter item description"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewItemName('');
                  setNewItemDescription('');
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNew}
                disabled={!newItemName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;