// Default maintenance ticket structure
export const DEFAULT_MAINTENANCE_TICKET = {
  title: "",
  description: "",
  interfaceId: "",
  priority: "Medium",
  type: "Corrective",
  assignedTo: "",
  dueDate: "",
  status: "Open",
  category: "Mechanical",
  urgency: "Medium",
  estimatedDuration: "2hours",
  skillsRequired: [],
  recurring: "none"
}

// Maintenance priorities
export const MAINTENANCE_PRIORITIES = [
  { value: "Low", label: "Low", color: "bg-green-100 text-green-800" },
  { value: "Medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { value: "High", label: "High", color: "bg-orange-100 text-orange-800" },
  { value: "Critical", label: "Critical", color: "bg-red-100 text-red-800" }
]

// Maintenance types
export const MAINTENANCE_TYPES = [
  { value: "Preventive", label: "Preventive" },
  { value: "Corrective", label: "Corrective" },
  { value: "Inspection", label: "Inspection" },
  { value: "Calibration", label: "Calibration" },
  { value: "Emergency", label: "Emergency" }
]

// Maintenance statuses
export const MAINTENANCE_STATUSES = [
  { value: "Open", label: "Open", color: "bg-red-100 text-red-800" },
  { value: "InProgress", label: "In Progress", color: "bg-blue-100 text-blue-800" },
  { value: "OnHold", label: "On Hold", color: "bg-orange-100 text-orange-800" },
  { value: "Resolved", label: "Resolved", color: "bg-green-100 text-green-800" },
  { value: "Closed", label: "Closed", color: "bg-gray-100 text-gray-800" }
]

// Additional maintenance options
export const MAINTENANCE_CATEGORIES = [
  { value: "Electrical", label: "Electrical" },
  { value: "Mechanical", label: "Mechanical" },
  { value: "Software", label: "Software" },
  { value: "Calibration", label: "Calibration" },
  { value: "Cleaning", label: "Cleaning" },
  { value: "Replacement", label: "Replacement" }
]

export const URGENCY_LEVELS = [
  { value: "Low", label: "Low - Can wait weeks", color: "bg-green-100 text-green-800" },
  { value: "Medium", label: "Medium - Should be done this week", color: "bg-yellow-100 text-yellow-800" },
  { value: "High", label: "High - Needs attention soon", color: "bg-orange-100 text-orange-800" },
  { value: "Urgent", label: "Urgent - Immediate attention", color: "bg-red-100 text-red-800" }
]

export const ESTIMATED_DURATION = [
  { value: "15min", label: "15 minutes" },
  { value: "30min", label: "30 minutes" },
  { value: "1hour", label: "1 hour" },
  { value: "2hours", label: "2 hours" },
  { value: "4hours", label: "4 hours" },
  { value: "1day", label: "1 day" },
  { value: "2days", label: "2 days" },
  { value: "1week", label: "1 week" },
  { value: "custom", label: "Custom duration" }
]

export const SKILLS_REQUIRED = [
  { value: "electrical", label: "Electrical Work" },
  { value: "mechanical", label: "Mechanical Work" },
  { value: "software", label: "Software/Programming" },
  { value: "calibration", label: "Calibration" },
  { value: "safety", label: "Safety Procedures" },
  { value: "welding", label: "Welding" },
  { value: "pneumatics", label: "Pneumatics" },
  { value: "hydraulics", label: "Hydraulics" }
]

export const RECURRING_OPTIONS = [
  { value: "none", label: "One-time" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "annually", label: "Annually" }
]