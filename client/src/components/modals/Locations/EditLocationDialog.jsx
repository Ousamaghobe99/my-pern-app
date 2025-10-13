import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Edit } from "lucide-react";

const LOCATION_TYPES = [
  { value: 'Warehouse', label: 'Warehouse' },
  { value: 'Production', label: 'Production' },
  { value: 'Storage', label: 'Storage' },
  { value: 'Maintenance', label: 'Maintenance' },
  { value: 'Laboratory', label: 'Laboratory' },
  { value: 'Office', label: 'Office' },
  { value: 'Other', label: 'Other' }
];

export default function EditLocationDialog({ open, onOpenChange, location, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    capacity: '',
    address: ''
  });

  // Initialize form when location changes
  useEffect(() => {
    if (location) {
      setFormData({
        name: location.name || '',
        description: location.description || '',
        type: location.type || '',
        capacity: location.capacity ? location.capacity.toString() : '',
        address: location.address || ''
      });
    }
  }, [location]);

  if (!location) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert capacity to number
    const submitData = {
      ...formData,
      capacity: formData.capacity ? parseInt(formData.capacity, 10) : 0
    };
    
    onSubmit(location.id, submitData);
  };

  const handleCancel = () => {
    // Reset to original location data
    if (location) {
      setFormData({
        name: location.name || '',
        description: location.description || '',
        type: location.type || '',
        capacity: location.capacity ? location.capacity.toString() : '',
        address: location.address || ''
      });
    }
    onOpenChange(false);
  };

  const isFormValid = () => {
    return formData.name.trim() && formData.type && formData.capacity;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Location
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Location ID (Read-only) */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">
              Location ID
            </Label>
            <Input
              value={location.id || ''}
              disabled
              className="bg-gray-50"
            />
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="edit-name">Location Name *</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter location name"
              disabled={isLoading}
              required
            />
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label>Type *</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleInputChange("type", value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select location type" />
              </SelectTrigger>
              <SelectContent>
                {LOCATION_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Capacity */}
          <div className="space-y-2">
            <Label htmlFor="edit-capacity">Interface Capacity *</Label>
            <Input
              id="edit-capacity"
              type="number"
              min="0"
              value={formData.capacity}
              onChange={(e) => handleInputChange("capacity", e.target.value)}
              placeholder="Enter maximum interface capacity"
              disabled={isLoading}
              required
            />
            {location.interfaceCount > 0 && (
              <p className="text-sm text-muted-foreground">
                Current interfaces: {location.interfaceCount}. 
                {parseInt(formData.capacity) < location.interfaceCount && 
                  <span className="text-red-600 ml-1">
                    Warning: New capacity is less than current interface count.
                  </span>
                }
              </p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="edit-address">Address</Label>
            <Input
              id="edit-address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="Enter location address"
              disabled={isLoading}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter location description"
              disabled={isLoading}
              rows={3}
            />
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                Current Interfaces
              </Label>
              <p className="text-sm">{location.interfaceCount || 0}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                Utilization
              </Label>
              <p className="text-sm">
                {location.capacity 
                  ? `${Math.round(((location.interfaceCount || 0) / location.capacity) * 100)}%`
                  : '0%'
                }
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !isFormValid()}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}