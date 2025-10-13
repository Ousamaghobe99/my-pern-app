import { INTERFACE_STATUSES } from "../constants/interfaceDefaults";

// utils/interfaceValidation.js
export const validateInterfaceData = (data) => {
  const errors = []

  // Interface Name
  if (!data.interfaceName?.trim()) {
    errors.push("Interface name is required")
  } else if (data.interfaceName.trim().length < 3) {
    errors.push("Interface name must be at least 3 characters")
  }

  // Type
  if (!data.type?.trim()) {
    errors.push("Type is required")
  }

  // Serial Number (required and positive)
  if (data.serialNumber == null || data.serialNumber === '') {
    errors.push("Serial number is required")
  } else if (isNaN(data.serialNumber) || data.serialNumber <= 0) {
    errors.push("Serial number must be a positive number")
  }

  // Status
  if (!data.status?.trim()) {
    errors.push("Status is required")
  }

  return errors
}

export const formatInterfaceData = (data) => {
  const validStatuses = ['Available', 'InUse', 'UnderMaintenance', 'Retired', 'Disposed'];

  return {
    interfaceName: data.interfaceName.trim(),
    serialNumber: parseInt(data.serialNumber), // guaranteed not null here
    description: data.description?.trim() || null,
    type: data.type.trim(),
    status: validStatuses.includes(data.status) ? data.status : 'Available',
    currentLocationId: data.currentLocationId || null,
  }
}
