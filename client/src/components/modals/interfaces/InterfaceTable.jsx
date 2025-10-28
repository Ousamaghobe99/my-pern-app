import { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Eye, Trash2, Edit } from "lucide-react";
import { format } from "date-fns";
import { getStatusColor } from "@/lib/utils";
import ViewInterfaceDialog from "./ViewInterfaceDialog";
import EditInterfaceDialog from "./EditInterfaceDialog";

export default function InterfaceTable({
  interfaces,
  onDelete,
  onStatusUpdate,
  onUpdate, // New prop for handling updates
  isDeleting,
  isUpdating,
  isLoading,
  error,
  onRetry,
  formOptions, // New prop for form options
}) {
  const [viewInterface, setViewInterface] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editInterface, setEditInterface] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleViewInterface = (interfaceData) => {
    setViewInterface(interfaceData);
    setIsViewDialogOpen(true);
  };

  const handleEditInterface = (interfaceData) => {
    setEditInterface(interfaceData);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async (interfaceId, updatedData) => {
    if (onUpdate) {
      const success = await onUpdate(interfaceId, updatedData);
      if (success) {
        setIsEditDialogOpen(false);
        setEditInterface(null);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditInterface(null);
  };

  const handleDeleteConfirm = (interfaceId, interfaceName) => {
    onDelete(interfaceId, interfaceName);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Serial Number</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Last Update</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7}>
                <div className="space-y-2">
                  <div className="h-8 bg-gray-200 rounded animate-pulse" />
                  <div className="h-8 bg-gray-200 rounded animate-pulse" />
                  <div className="h-8 bg-gray-200 rounded animate-pulse" />
                </div>
              </TableCell>
            </TableRow>
          ) : error ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                <div className="flex flex-col items-center justify-center">
                  <p className="text-red-500 font-semibold mb-2">
                    Failed to load interfaces
                  </p>
                  <p className="text-muted-foreground mb-4">
                    {error?.message || "Please try again later"}
                  </p>
                  <Button onClick={onRetry}>Retry</Button>
                </div>
              </TableCell>
            </TableRow>
          ) : interfaces.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                No interfaces found.
              </TableCell>
            </TableRow>
          ) : (
            interfaces.map((i) => (
              <TableRow key={i.id}>
                <TableCell className="font-medium">
                  {i.interfaceName || "N/A"}
                </TableCell>
                <TableCell>{i.serialNumber || "N/A"}</TableCell>
                <TableCell>{i.type}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                      i.status
                    )}`}
                  >
                    {i.status}
                  </span>
                </TableCell>
                <TableCell>
                  {i.currentLocation?.name || "No Location"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {i.updatedAt ? format(new Date(i.updatedAt), "Pp") : "N/A"}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewInterface(i)}
                    >
                      <Eye className="h-3 w-3 mr-1" /> View
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditInterface(i)}
                      disabled={isUpdating}
                      className="border-blue-200 text-blue-700 hover:bg-blue-50"
                    >
                      <Edit className="h-3 w-3 mr-1" /> Edit
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={isDeleting}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the interface
                            <strong> "{i.interfaceName}" </strong>
                            with serial number{" "}
                            <strong>"{i.serialNumber}"</strong>.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel disabled={isDeleting}>
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              handleDeleteConfirm(i.id, i.interfaceName)
                            }
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            {isDeleting ? "Deleting..." : "Delete Interface"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* View Interface Dialog */}
      <ViewInterfaceDialog
        interface={viewInterface}
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        onEdit={handleEditInterface}
        canEdit={true}
      />

      {/* Edit Interface Dialog */}
      <EditInterfaceDialog
        interface={editInterface}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
        isLoading={isUpdating}
        formOptions={formOptions}
      />
    </>
  );
}
