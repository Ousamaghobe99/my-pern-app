import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Edit, 
  MapPin, 
  Building,
  Package,
  Calendar,
  Clock
} from "lucide-react";
import { format } from "date-fns";

export default function ViewLocationDialog({
  location,
  open,
  onOpenChange,
  onEdit,
  canEdit = true
}) {
  if (!location) return null;

  const handleEditClick = () => {
    onOpenChange(false);
    onEdit(location);
  };

  const getUtilizationColor = (current, capacity) => {
    if (!capacity) return 'text-gray-500';
    const percentage = (current / capacity) * 100;
    if (percentage >= 90) return 'text-red-500';
    if (percentage >= 70) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getUtilizationBadgeColor = (current, capacity) => {
    if (!capacity) return 'bg-gray-100 text-gray-800';
    const percentage = (current / capacity) * 100;
    if (percentage >= 90) return 'bg-red-100 text-red-800';
    if (percentage >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const utilizationPercentage = location.capacity 
    ? Math.round(((location.interfaceCount || 0) / location.capacity) * 100)
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Location ID</Label>
              <p className="font-mono text-sm">{location.id}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Created</Label>
              <p className="text-sm">
                {location.createdAt ? format(new Date(location.createdAt), 'PPP p') : 'N/A'}
              </p>
            </div>
          </div>

          <Separator />

          {/* Name and Type */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Location Name</Label>
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" />
                {location.name}
              </h3>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Type</Label>
              <Badge variant="outline" className="w-fit">
                {location.type || 'Unknown'}
              </Badge>
            </div>
          </div>

          {/* Description */}
          {location.description && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Description</Label>
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-sm">{location.description}</p>
              </div>
            </div>
          )}

          {/* Address */}
          {location.address && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Address</Label>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span className="text-sm">{location.address}</span>
              </div>
            </div>
          )}

          {/* Capacity Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Total Capacity</Label>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-blue-500" />
                  <span className="text-lg font-semibold">{location.capacity || 0}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Current Interfaces</Label>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-green-500" />
                  <span className="text-lg font-semibold">{location.interfaceCount || 0}</span>
                </div>
              </div>
            </div>

            {/* Utilization */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium text-muted-foreground">Utilization</Label>
                <Badge className={getUtilizationBadgeColor(location.interfaceCount || 0, location.capacity || 0)}>
                  {location.interfaceCount || 0}/{location.capacity || 0}
                </Badge>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-300 ${
                    utilizationPercentage >= 90 
                      ? 'bg-red-500' 
                      : utilizationPercentage >= 70 
                      ? 'bg-yellow-500' 
                      : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(utilizationPercentage, 100)}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Available: {(location.capacity || 0) - (location.interfaceCount || 0)}</span>
                <span className={getUtilizationColor(location.interfaceCount || 0, location.capacity || 0)}>
                  {utilizationPercentage}%
                </span>
              </div>
            </div>
          </div>

          {/* Status Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Status</Label>
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${
                  utilizationPercentage >= 90 ? 'bg-red-500' :
                  utilizationPercentage >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                }`}></div>
                <span className="text-sm">
                  {utilizationPercentage >= 90 ? 'At Capacity' :
                   utilizationPercentage >= 70 ? 'High Usage' : 'Available'}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Last Updated</Label>
              <p className="text-sm">
                {location.updatedAt ? format(new Date(location.updatedAt), 'PPP p') : 'N/A'}
              </p>
            </div>
          </div>

          {/* Additional Information */}
          {(location.notes || location.manager) && (
            <>
              <Separator />
              <div className="space-y-4">
                {location.manager && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Manager</Label>
                    <p className="text-sm">{location.manager}</p>
                  </div>
                )}
                
                {location.notes && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Notes</Label>
                    <div className="p-3 bg-gray-50 rounded-md">
                      <p className="text-sm">{location.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {canEdit && (
            <Button onClick={handleEditClick}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Location
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
          