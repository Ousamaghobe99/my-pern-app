import { useMemo } from "react";
import { useLocations, useInterfaces, useUsers, useRoles } from "../hooks/useApi";

// Interface options
const STATUS_OPTIONS = [
  { value: "Available", label: "Available" },
  { value: "InUse", label: "InUse" },
  { value: "UnderMaintenance", label: "Maintenance" },
  { value: "Retired", label: "Offline" }
];

const TYPE_OPTIONS = [
  { value: "Storage", label: "Storage Interface" },
  { value: "Input", label: "Input Interface" },
  { value: "Output", label: "Output Interface" },
  { value: "Processing", label: "Processing Interface" }
];

// Maintenance options
const MAINTENANCE_PRIORITIES = [
  { value: "Low", label: "Low", color: "bg-green-100 text-green-800" },
  { value: "Medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { value: "High", label: "High", color: "bg-orange-100 text-orange-800" },
  { value: "Critical", label: "Critical", color: "bg-red-100 text-red-800" }
];

const MAINTENANCE_TYPES = [
  { value: "Preventive", label: "Preventive" },
  { value: "Corrective", label: "Corrective" },
  { value: "Inspection", label: "Inspection" },
  { value: "Calibration", label: "Calibration" },
  { value: "Emergency", label: "Emergency" }
];

const MAINTENANCE_STATUSES = [
  { value: "Open", label: "Open", color: "bg-red-100 text-red-800" },
  { value: "InProgress", label: "In Progress", color: "bg-blue-100 text-blue-800" },
  { value: "OnHold", label: "On Hold", color: "bg-orange-100 text-orange-800" },
  { value: "Resolved", label: "Resolved", color: "bg-green-100 text-green-800" },
  { value: "Closed", label: "Closed", color: "bg-gray-100 text-gray-800" }
];

export const useFormOptions = () => {
  // Fetch dynamic data from APIs
  const { data: locationsData, isLoading: locationsLoading } = useLocations();
  const { data: interfacesData, isLoading: interfacesLoading } = useInterfaces();
  const { data: usersData, isLoading: usersLoading } = useUsers();
  const { data: rolesData, isLoading: rolesLoading } = useRoles();

  // Transform locations for dropdown
  const locationOptions = useMemo(() => {
    if (!locationsData) return [];
    return locationsData.map(location => ({
      value: location.id,
      label: location.name || `Location ${location.id}`,
      capacity: location.capacity,
      available: location.available
    }));
  }, [locationsData]);

  // Transform interfaces for dropdown
const interfaceOptions = useMemo(() => {
  if (!interfacesData) return []

  const items = Array.isArray(interfacesData)
    ? interfacesData
    : interfacesData.data || []

  return items.map(iface => ({
    value: iface.id,
    label: `${iface.interfaceName} (${iface.serialNumber || 'N/A'})`,
    type: iface.type,
    status: iface.status,
    location: iface.currentLocation?.name
  }))
}, [interfacesData])


  // Transform users for technician dropdown
  const technicianOptions = useMemo(() => {
    if (!usersData) return [];
    return usersData.map(user => ({
      id: user.id,
      value: user.id,
      label: `${user.firstName} ${user.lastName}`,
      matricule: user.matricule,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    }));
  }, [usersData]);

  // Assignee options (includes unassigned)
  const assigneeOptions = useMemo(() => [
    { value: "", label: "Unassigned" },
    ...technicianOptions
  ], [technicianOptions]);

  // Transform roles from backend for dropdown
  const roleOptions = useMemo(() => {
    if (!rolesData) return [];
    return rolesData.map(role => ({
      value: role.id,  // or role.name if you prefer
      label: role.name
    }));
  }, [rolesData]);

  return {
    // Interface options
    locationOptions,
    statusOptions: STATUS_OPTIONS,
    typeOptions: TYPE_OPTIONS,
    interfaceOptions,
    technicianOptions,
    assigneeOptions,

    // Maintenance options
    priorityOptions: MAINTENANCE_PRIORITIES,
    maintenanceTypeOptions: MAINTENANCE_TYPES,
    maintenanceStatusOptions: MAINTENANCE_STATUSES,

    // Role options
    roleOptions,

    // Loading states
    locationsLoading,
    interfacesLoading,
    usersLoading,
    rolesLoading,
    isLoading: locationsLoading || interfacesLoading || usersLoading || rolesLoading,

    // Legacy loading states
    statusLoading: false,
    typeLoading: false
  };
};
