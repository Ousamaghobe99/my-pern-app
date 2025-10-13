import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Save, X } from "lucide-react";
import { getStatusColor } from "@/lib/utils";

export default function EditInterfaceDialog({ 
  interface: selectedInterface, 
  open, 
  onOpenChange, 
  onSave,
  onCancel,
  isLoading = false,
  formOptions 
}) {
  const [editData, setEditData] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize form data when interface changes
  useEffect(() => {
    if (selectedInterface && open) {
      const initialData = {
        interfaceName: selectedInterface.interfaceName || "",
        serialNumber: selectedInterface.serialNumber || "",
        description: selectedInterface.description || "",
        type: selectedInterface.type || "",
        status: selectedInterface.status || "",
        currentLocationId: selectedInterface.currentLocation?.id ? selectedInterface.currentLocation.id : "no-location",
      };
      setEditData(initialData);
      setHasChanges(false);
    }
  }, [selectedInterface, open]);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  // Handle form submission
  const handleSubmit = () => {
    if (onSave && selectedInterface) {
      // Convert "no-location" back to empty string for the API
      const submitData = {
        ...editData,
        currentLocationId: editData.currentLocationId === "no-location" ? "" : editData.currentLocationId
      };
      onSave(selectedInterface.id, submitData);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm("You have unsaved changes. Are you sure you want to cancel?")) {
        if (onCancel) onCancel();
        onOpenChange(false);
        setHasChanges(false);
      }
    } else {
      if (onCancel) onCancel();
      onOpenChange(false);
    }
  };

  if (!selectedInterface) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Edit Interface
            <Badge className={getStatusColor(selectedInterface.status)}>
              {selectedInterface.serialNumber || selectedInterface.id}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Update the information for {selectedInterface.interfaceName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3 border-b pb-1">
                Basic Information
              </h4>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="interfaceName">Interface Name *</Label>
                  <Input
                    id="interfaceName"
                    value={editData.interfaceName || ""}
                    onChange={(e) => handleInputChange("interfaceName", e.target.value)}
                    placeholder="Enter interface name"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="serialNumber">Serial Number *</Label>
                  <Input
                    id="serialNumber"
                    value={editData.serialNumber || ""}
                    onChange={(e) => handleInputChange("serialNumber", e.target.value)}
                    placeholder="Enter serial number"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="type">Type *</Label>
                  <Select 
                    value={editData.type || ""} 
                    onValueChange={(value) => handleInputChange("type", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select interface type" />
                    </SelectTrigger>
                    <SelectContent>
                      {formOptions?.typeOptions?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      )) || (
                        <SelectItem value="loading" disabled>Loading options...</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Status and Location */}
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3 border-b pb-1">
                Status & Location
              </h4>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="status">Status *</Label>
                  <Select 
                    value={editData.status || ""} 
                    onValueChange={(value) => handleInputChange("status", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {formOptions?.statusOptions?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      )) || (
                        <SelectItem value="loading" disabled>Loading options...</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="location">Current Location</Label>
                  <Select 
                    value={editData.currentLocationId || ""} 
                    onValueChange={(value) => handleInputChange("currentLocationId", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no-location">No Location</SelectItem>
                      {formOptions?.locationOptions?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      )) || (
                        <SelectItem value="loading" disabled>Loading options...</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description - Full Width */}
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3 border-b pb-1">
              Description
            </h4>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editData.description || ""}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Enter interface description..."
                className="mt-1 min-h-[100px] resize-none"
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {(editData.description || "").length}/500 characters
              </p>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-gray-500">
            {hasChanges && (
              <span className="text-amber-600 font-medium">
                • Unsaved changes
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleCancel}
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isLoading || !hasChanges}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 mr-1 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-1" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}