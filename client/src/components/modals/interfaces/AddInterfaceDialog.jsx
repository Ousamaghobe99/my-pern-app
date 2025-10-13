// components/modals/interfaces/AddInterfaceDialog.jsx
import React, { useState, useMemo } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

// Import your validation functions
import { validateInterfaceData } from "@/lib/interfaceValidation"

export default function AddInterfaceDialog({
  open,
  setOpen,
  newInterface,
  setNewInterface,
  onSubmit,
  onCancel,
  isLoading,
  formOptions,
}) {
  const [touched, setTouched] = useState({})

  const handleChange = (field, value) => {
    console.log(`Changing ${field} to:`, value)
    setNewInterface((prev) => ({ ...prev, [field]: value }))
    
    // Mark field as touched when user interacts with it
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  // Get validation errors
  const validationErrors = useMemo(() => {
    return validateInterfaceData(newInterface)
  }, [newInterface])

  // Get field-specific errors
  const getFieldError = (field) => {
    if (!touched[field]) return null
    
    const fieldErrors = {
      interfaceName: validationErrors.find(err => err.includes("Interface name")),
      type: validationErrors.find(err => err.includes("Type")),
    }
    
    return fieldErrors[field] || null
  }

  // Check if form is valid
  const isFormValid = validationErrors.length === 0 && 
    newInterface.interfaceName?.trim() && 
    newInterface.type?.trim()

  // Debug: Log current interface state
  console.log("Current newInterface:", newInterface)
  console.log("Validation errors:", validationErrors)
  console.log("Is form valid:", isFormValid)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Interface</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new interface.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Name */}
          <div className="grid grid-cols-1 gap-2">
            <Label className={getFieldError("interfaceName") ? "text-red-500" : ""}>
              Name *
            </Label>
            <Input
              value={newInterface.interfaceName || ""}
              onChange={(e) => handleChange("interfaceName", e.target.value)}
              onBlur={() => handleBlur("interfaceName")}
              placeholder="Interface Name"
              className={getFieldError("interfaceName") ? "border-red-500" : ""}
            />
            {getFieldError("interfaceName") && (
              <span className="text-sm text-red-500">{getFieldError("interfaceName")}</span>
            )}
          </div>

          {/* Serial Number */}
          <div className="grid grid-cols-1 gap-2">
            <Label>Serial Number</Label>
            <Input
              value={newInterface.serialNumber || ""}
              onChange={(e) => handleChange("serialNumber", e.target.value)}
              onBlur={() => handleBlur("serialNumber")}
              placeholder="Optional"
              type="number"
            />
          </div>

          {/* Description */}
          <div className="grid grid-cols-1 gap-2">
            <Label>Description</Label>
            <Input
              value={newInterface.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              onBlur={() => handleBlur("description")}
              placeholder="Optional"
            />
          </div>

          {/* Type */}
          <div className="grid grid-cols-1 gap-2">
            <Label className={getFieldError("type") ? "text-red-500" : ""}>
              Type *
            </Label>
            <Select
              value={newInterface.type || undefined}
              onValueChange={(value) => handleChange("type", value)}
            >
              <SelectTrigger className={getFieldError("type") ? "border-red-500" : ""}>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {formOptions?.typeOptions?.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                )) || []}
              </SelectContent>
            </Select>
            {getFieldError("type") && (
              <span className="text-sm text-red-500">{getFieldError("type")}</span>
            )}
          </div>

          {/* Status */}
          <div className="grid grid-cols-1 gap-2">
            <Label>Status</Label>
            <Select
              value={newInterface.status || undefined}
              onValueChange={(value) => handleChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {formOptions?.statusOptions?.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                )) || []}
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 gap-2">
            <Label>Location</Label>
            <Select
              value={newInterface.currentLocationId || undefined}
              onValueChange={(value) => handleChange("currentLocationId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {formOptions?.locationOptions?.map((location) => (
                  <SelectItem key={location.value} value={location.value}>
                    {location.label}
                  </SelectItem>
                )) || []}
              </SelectContent>
            </Select>
          </div>

          {/* Show all validation errors at the bottom */}
          {validationErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <h4 className="text-sm font-medium text-red-800 mb-2">Please fix the following errors:</h4>
              <ul className="text-sm text-red-700 space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <DialogFooter className="space-x-2">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            onClick={onSubmit} 
            disabled={isLoading || !isFormValid}
            className={!isFormValid ? "opacity-50 cursor-not-allowed" : ""}
          >
            {isLoading ? "Adding..." : "Add Interface"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}