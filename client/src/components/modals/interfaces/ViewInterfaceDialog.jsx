import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { getStatusColor } from "@/lib/utils";

export default function ViewInterfaceDialog({ 
  interface: selectedInterface, 
  open, 
  onOpenChange, 
  onEdit,
  canEdit = true 
}) {
  if (!selectedInterface) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Interface Details
            <Badge className={getStatusColor(selectedInterface.status)}>
              {selectedInterface.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Complete information about {selectedInterface.interfaceName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3 border-b pb-1">
                Basic Information
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="font-medium text-gray-600 min-w-[100px]">Name:</span>
                  <span className="text-right flex-1 font-medium">
                    {selectedInterface.interfaceName || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="font-medium text-gray-600 min-w-[100px]">Serial Number:</span>
                  <span className="text-right flex-1 font-mono text-sm bg-gray-50 px-2 py-1 rounded">
                    {selectedInterface.serialNumber || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="font-medium text-gray-600 min-w-[100px]">Type:</span>
                  <span className="text-right flex-1">
                    {selectedInterface.type}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="font-medium text-gray-600 min-w-[100px]">Status:</span>
                  <Badge className={`${getStatusColor(selectedInterface.status)} text-xs`}>
                    {selectedInterface.status}
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* Location Information */}
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3 border-b pb-1">
                Location
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="font-medium text-gray-600 min-w-[100px]">Current Location:</span>
                  <span className="text-right flex-1">
                    {selectedInterface.currentLocation?.name || 'No Location'}
                  </span>
                </div>
                {selectedInterface.currentLocation?.id && (
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-gray-600 min-w-[100px]">Location ID:</span>
                    <span className="text-right flex-1 font-mono text-sm bg-gray-50 px-2 py-1 rounded">
                      {selectedInterface.currentLocation.id}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Description and System Info */}
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3 border-b pb-1">
                Description
              </h4>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {selectedInterface.description || 'No description available'}
                </p>
              </div>
            </div>
            
            {/* Timestamps */}
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3 border-b pb-1">
                Timestamps
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="font-medium text-gray-600 min-w-[100px]">Created:</span>
                  <div className="text-right flex-1">
                    <div className="text-sm">
                      {selectedInterface.createdAt ? format(new Date(selectedInterface.createdAt), 'PPP') : 'N/A'}
                    </div>
                    {selectedInterface.createdAt && (
                      <div className="text-xs text-gray-500">
                        {format(new Date(selectedInterface.createdAt), 'p')}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <span className="font-medium text-gray-600 min-w-[100px]">Last Updated:</span>
                  <div className="text-right flex-1">
                    <div className="text-sm">
                      {selectedInterface.updatedAt ? format(new Date(selectedInterface.updatedAt), 'PPP') : 'N/A'}
                    </div>
                    {selectedInterface.updatedAt && (
                      <div className="text-xs text-gray-500">
                        {format(new Date(selectedInterface.updatedAt), 'p')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* System Information */}
            {selectedInterface.id && (
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3 border-b pb-1">
                  System Information
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-gray-600 min-w-[100px]">ID:</span>
                    <span className="text-right flex-1 font-mono text-sm bg-gray-50 px-2 py-1 rounded">
                      {selectedInterface.id}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-gray-500">
            Interface #{selectedInterface.serialNumber || selectedInterface.id}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            {canEdit && onEdit && (
              <Button 
                variant="default" 
                onClick={() => {
                  onEdit(selectedInterface);
                  onOpenChange(false); // Close view dialog when opening edit
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit Interface
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}