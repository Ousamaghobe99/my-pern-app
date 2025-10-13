import { useLocations, useInterfaces, useUsers } from "../hooks/useApi"
import { useMemo } from "react"

// Interface options (your existing ones)
const STATUS_OPTIONS = [
  { value: "Available", label: "Available" },
  { value: "InUse", label: "InUse" },
  { value: "UnderMaintenance", label: "Maintenance" },
  { value: "Retired", label: "Offline" }
]

const TYPE_OPTIONS = [
  { value: "Storage", label: "Storage Interface" },
  { value: "Input", label: "Input Interface" },
  { value: "Output", label: "Output Interface" },
  { value: "Processing", label: "Processing Interface" }
]

// Maintenance options (add these new static options)
const MAINTENANCE_PRIORITIES = [
  { value: "Low", label: "Low", color: "bg-green-100 text-green-800" },
  { value: "Medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { value: "High", label: "High", color: "bg-orange-100 text-orange-800" },
  { value: "Critical", label: "Critical", color: "bg-red-100 text-red-800" }
]

const MAINTENANCE_TYPES = [
  { value: "Preventive", label: "Preventive" },
  { value: "Corrective", label: "Corrective" },
  { value: "Inspection", label: "Inspection" },
  { value: "Calibration", label: "Calibration" },
  { value: "Emergency", label: "Emergency" }
]

const MAINTENANCE_STATUSES = [
  { value: "Open", label: "Open", color: "bg-red-100 text-red-800" },
  { value: "InProgress", label: "In Progress", color: "bg-blue-100 text-blue-800" },
  { value: "OnHold", label: "On Hold", color: "bg-orange-100 text-orange-800" },
  { value: "Resolved", label: "Resolved", color: "bg-green-100 text-green-800" },
  { value: "Closed", label: "Closed", color: "bg-gray-100 text-gray-800" }
]

export const useFormOptions = () => {
  // Fetch dynamic data from APIs
  const { data: locationsData, isLoading: locationsLoading } = useLocations()
  const { data: interfacesData, isLoading: interfacesLoading } = useInterfaces()
  const { data: usersData, isLoading: usersLoading } = useUsers()
   
  // Transform locations data for form dropdown
  const locationOptions = useMemo(() => {
    if (!locationsData) return []
        
    return locationsData.map(location => ({
      value: location.id,
      label: location.name || `Location ${location.id}`,
      // Add any additional location info you need
      capacity: location.capacity,
      available: location.available
    }))
  }, [locationsData])

  // Transform interfaces data for maintenance ticket dropdowns
  const interfaceOptions = useMemo(() => {
    if (!interfacesData?.data) return []
    
    return interfacesData.data.map(iface => ({
      value: iface.id,
      label: `${iface.interfaceName} (${iface.serialNumber || 'N/A'})`,
      type: iface.type,
      status: iface.status,
      location: iface.currentLocation?.name
    }))
  }, [interfacesData])

  // Transform users data for technician assignment
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


  // Assignee options (includes unassigned + technicians)
  const assigneeOptions = useMemo(() => [
    { value: "", label: "Unassigned" },
    ...technicianOptions
  ], [technicianOptions])

  return {
    // Interface-specific options (your existing ones)
    locationOptions,
    statusOptions: STATUS_OPTIONS,
    typeOptions: TYPE_OPTIONS,
    
    // Maintenance-specific options (new additions)
    priorityOptions: MAINTENANCE_PRIORITIES,
    maintenanceTypeOptions: MAINTENANCE_TYPES,
    maintenanceStatusOptions: MAINTENANCE_STATUSES,
    interfaceOptions, // For selecting which interface needs maintenance
    technicianOptions,
    assigneeOptions,
    
    // Loading states
    locationsLoading,
    interfacesLoading,
    usersLoading,
    isLoading: locationsLoading || interfacesLoading || usersLoading,
    
    // Legacy loading states (keep for backward compatibility)
    statusLoading: false,
    typeLoading: false
  }
}