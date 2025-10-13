export const DEFAULT_INTERFACE = {
  interfaceName: "",
  serialNumber: "",
  description: "",
  type: "",
  status: "",
  currentLocationId: "",
}

export const INTERFACE_STATUSES = {
  Available: "Available",
  InUse: "InUse",
  Maintenance: "UnderMaintenance", // UI label → backend enum
  Offline: "Disposed"              // UI label → backend enum
}
