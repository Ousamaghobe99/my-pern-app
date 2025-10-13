// Validation function for maintenance ticket data
export const validateMaintenanceData = (data) => {
  const errors = [];

  // Title validation
  if (!data.title || data.title.trim() === '') {
    errors.push('Title is required');
  } else if (data.title.length > 200) {
    errors.push('Title must be less than 200 characters');
  }

  // Description validation (optional but if provided, check length)
  if (data.description && data.description.length > 1000) {
    errors.push('Description must be less than 1000 characters');
  }

  // Interface ID validation
  if (!data.interfaceId || data.interfaceId.trim() === '') {
    errors.push('Interface selection is required');
  }

  // Priority validation
  const validPriorities = ['Low', 'Medium', 'High', 'Critical'];
  if (!data.priority || !validPriorities.includes(data.priority)) {
    errors.push('Valid priority is required');
  }

  // Type validation
  const validTypes = ['Preventive', 'Corrective', 'Inspection', 'Calibration', 'Emergency'];
  if (!data.type || !validTypes.includes(data.type)) {
    errors.push('Valid maintenance type is required');
  }

  // Assigned To validation (optional)
  if (data.assignedTo && data.assignedTo.length > 100) {
    errors.push('Assigned To must be less than 100 characters');
  }

  // Due Date validation
  if (!data.dueDate) {
    errors.push('Due date is required');
  } else {
    const dueDate = new Date(data.dueDate);
    const now = new Date();
    if (dueDate < now) {
      errors.push('Due date cannot be in the past');
    }
  }

  return errors;
};

// Format maintenance data for API submission
export const formatMaintenanceData = (data, currentUserId) => {
  return {
    interfaceId: data.interfaceId,
    type: data.type,
    description: data.description?.trim() || '',
    priority: data.priority,
    reportedById: currentUserId, // Current user who creates the ticket
    assignedToId: data.assignedTo || null, // Now this will be a user ID
    scheduledDate: data.dueDate
  };
};

// Helper function to get priority color
export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'Critical':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'High':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'Medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Low':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// Helper function to get status color
export const getMaintenanceStatusColor = (status) => {
  switch (status) {
    case 'Open':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'InProgress':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'OnHold':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'Resolved':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'Closed':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};