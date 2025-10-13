import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Eye, Trash2, Edit, MapPin, Package } from "lucide-react";
import { getCapacityColor, getCapacityBadgeColor } from "@/lib/locationValidation";
import ViewLocationDialog from "./ViewLocationDialog";
import EditLocationDialog from "./EditLocationDialog";

export default function LocationGrid({ 
  locations, 
  onDelete, 
  onUpdate,
  isDeleting, 
  isUpdating
}) {
  const [viewLocation, setViewLocation] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editLocation, setEditLocation] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleViewLocation = (locationData) => {
    setViewLocation(locationData);
    setIsViewDialogOpen(true);
  };

  const handleEditLocation = (locationData) => {
    setEditLocation(locationData);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async (locationId, updatedData) => {
    if (onUpdate) {
      const success = await onUpdate(locationId, updatedData);
      if (success) {
        setIsEditDialogOpen(false);
        setEditLocation(null);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditLocation(null);
  };

  const handleDeleteConfirm = (locationId, locationName) => {
    onDelete(locationId, locationName);
  };

  return (
    <>
      {locations.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No locations found.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {locations.map((location) => (
            <Card key={location.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{location.name}</CardTitle>
                  </div>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleViewLocation(location)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditLocation(location)}
                      disabled={isUpdating}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          disabled={isDeleting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the location
                            <strong> "{location.name}"</strong> with ID{" "}
                            <strong>"{location.id}"</strong> and all associated data.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel disabled={isDeleting}>
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteConfirm(location.id, location.name)}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            {isDeleting ? "Deleting..." : "Delete Location"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <Badge variant="outline" className="w-fit">
                  {location.type || 'Unknown'}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {location.description || 'No description available'}
                </p>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Interfaces</span>
                    <Badge className={getCapacityBadgeColor(location.interfaceCount || 0, location.capacity || 0)}>
                      {location.interfaceCount || 0}/{location.capacity || 0}
                    </Badge>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div 
                      className={`h-2 rounded-full ${
                        !location.capacity ? 'bg-gray-400' :
                        ((location.interfaceCount || 0) / location.capacity) >= 0.9 
                          ? 'bg-red-500' 
                          : ((location.interfaceCount || 0) / location.capacity) >= 0.7 
                          ? 'bg-yellow-500' 
                          : 'bg-green-500'
                      }`}
                      style={{ 
                        width: location.capacity 
                          ? `${Math.min(((location.interfaceCount || 0) / location.capacity) * 100, 100)}%`
                          : '0%'
                      }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Utilization</span>
                    <span className={getCapacityColor(location.interfaceCount || 0, location.capacity || 0)}>
                      {location.capacity 
                        ? Math.round(((location.interfaceCount || 0) / location.capacity) * 100)
                        : 0
                      }%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* View Location Dialog */}
      <ViewLocationDialog
        location={viewLocation}
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        onEdit={handleEditLocation}
        canEdit={true}
      />

      {/* Edit Location Dialog */}
      <EditLocationDialog
        location={editLocation}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
        isLoading={isUpdating}
      />
    </>
  );
}