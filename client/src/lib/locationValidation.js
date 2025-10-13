export const validateLocationData = (locationData) => {
  const errors = [];

  // Required fields validation
  if (!locationData.name || !locationData.name.trim()) {
    errors.push('Location name is required');
  }

  if (!locationData.type || !locationData.type.trim()) {
    errors.push('Location type is required');
  }

  if (!locationData.capacity && locationData.capacity !== 0) {
    errors.push('Capacity is required');
  }

  // Capacity validation
  if (locationData.capacity < 0) {
    errors.push('Capacity must be a positive number');
  }

  // Name validation
  if (locationData.name && locationData.name.length > 100) {
    errors.push('Location name must be less than 100 characters');
  }

  // Description validation
  if (locationData.description && locationData.description.length > 500) {
    errors.push('Description must be less than 500 characters');
  }

  // Address validation
  if (locationData.address && locationData.address.length > 250) {
    errors.push('Address must be less than 250 characters');
  }

  return errors;
};

export const formatLocationData = (locationData, currentUserId = null) => {
  return {
    name: locationData.name?.trim(),
    description: locationData.description?.trim() || '',
    type: locationData.type?.trim(),
    capacity: parseInt(locationData.capacity, 10) || 0,
    address: locationData.address?.trim() || '',
    manager: locationData.manager?.trim() || '',
    createdBy: currentUserId,
    updatedAt: new Date().toISOString()
  };
};

export const getCapacityColor = (current, capacity) => {
  if (!capacity) return 'text-gray-500';
  const percentage = (current / capacity) * 100;
  if (percentage >= 90) return 'text-red-500';
  if (percentage >= 70) return 'text-yellow-500';
  return 'text-green-500';
};

export const getCapacityBadgeColor = (current, capacity) => {
  if (!capacity) return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  const percentage = (current / capacity) * 100;
  if (percentage >= 90) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
  if (percentage >= 70) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
  return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
};