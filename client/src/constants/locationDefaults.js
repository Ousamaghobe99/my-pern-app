export const DEFAULT_LOCATION = {
  name: '',
  description: '',
  type: '',
  capacity: '',
  address: '',
  manager: ''
};

export const LOCATION_TYPES = [
  { value: 'Warehouse', label: 'Warehouse' },
  { value: 'Production', label: 'Production' },
  { value: 'Storage', label: 'Storage' },
  { value: 'Maintenance', label: 'Maintenance' },
  { value: 'Laboratory', label: 'Laboratory' },
  { value: 'Office', label: 'Office' },
  { value: 'Other', label: 'Other' }
];

export const LOCATION_STATUS = {
  AVAILABLE: 'Available',
  HIGH_USAGE: 'High Usage',
  AT_CAPACITY: 'At Capacity',
  OVER_CAPACITY: 'Over Capacity'
};

export const getLocationStatus = (currentCount, capacity) => {
  if (!capacity || capacity === 0) return LOCATION_STATUS.AVAILABLE;
  
  const percentage = (currentCount / capacity) * 100;
  
  if (percentage > 100) return LOCATION_STATUS.OVER_CAPACITY;
  if (percentage >= 90) return LOCATION_STATUS.AT_CAPACITY;
  if (percentage >= 70) return LOCATION_STATUS.HIGH_USAGE;
  return LOCATION_STATUS.AVAILABLE;
};