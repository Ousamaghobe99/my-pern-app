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
import { Badge } from "@/components/ui/badge";
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
import {
  Eye,
  Trash2,
  Edit,
  AlertTriangle,
  Clock,
  CheckCircle,
  Calendar,
  Wrench,
} from "lucide-react";
import { format } from "date-fns";
import {
  getPriorityColor,
  getMaintenanceStatusColor,
} from "@/lib/maintenanceValidation";
import ViewMaintenanceDialog from "./ViewMaintenanceDialog";
import EditMaintenanceDialog from "./EditMaintenanceDialog";
import { parseDateString } from "@/lib/utils";

export default function MaintenanceTable({
  tickets,
  onDelete,
  onStatusUpdate,
  onUpdate,
  isDeleting,
  isUpdating,
  isLoading,
  error,
  onRetry,
  formOptions,
}) {
  const [viewTicket, setViewTicket] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editTicket, setEditTicket] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleViewTicket = (ticketData) => {
    setViewTicket(ticketData);
    setIsViewDialogOpen(true);
  };

  const handleEditTicket = (ticketData) => {
    setEditTicket(ticketData);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async (ticketId, updatedData) => {
    if (onUpdate) {
      const success = await onUpdate(ticketId, updatedData);
      if (success) {
        setIsEditDialogOpen(false);
        setEditTicket(null);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditTicket(null);
  };

  const handleDeleteConfirm = (ticketId, ticketTitle) => {
    onDelete(ticketId, ticketTitle);
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "Critical":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "High":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case "Medium":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "Low":
        return <Clock className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Open":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "InProgress":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "Resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "Closed":
        return <CheckCircle className="h-4 w-4 text-gray-500" />;
      case "OnHold":
        return <Clock className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatRelativeTime = (date) => {
    const now = new Date();
    const targetDate = new Date(date);
    const diffInHours = Math.floor((now - targetDate) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return format(targetDate, "MMM d, yyyy");
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Interface</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={8}>
                <div className="space-y-2">
                  <div className="h-8 bg-gray-200 rounded animate-pulse" />
                  <div className="h-8 bg-gray-200 rounded animate-pulse" />
                  <div className="h-8 bg-gray-200 rounded animate-pulse" />
                </div>
              </TableCell>
            </TableRow>
          ) : error ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                <div className="flex flex-col items-center justify-center">
                  <p className="text-red-500 font-semibold mb-2">
                    Failed to load maintenance tickets
                  </p>
                  <p className="text-muted-foreground mb-4">
                    {error?.message || "Please try again later"}
                  </p>
                  <Button onClick={onRetry}>Retry</Button>
                </div>
              </TableCell>
            </TableRow>
          ) : tickets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                No maintenance tickets found.
              </TableCell>
            </TableRow>
          ) : (
            tickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{ticket.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {ticket.type} • {formatRelativeTime(ticket.createdAt)}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {ticket.interface?.interfaceName || "N/A"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(ticket.status)}
                    <Badge className={getMaintenanceStatusColor(ticket.status)}>
                      {ticket.status}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {getPriorityIcon(ticket.priority)}
                    <Badge className={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  {ticket.assignedTo
                    ? `${ticket.assignedTo.firstName} ${ticket.assignedTo.lastName} (${ticket.assignedTo.matricule})`
                    : "Unassigned"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-3 w-3" />
                    {parseDateString(ticket.scheduledDate)
                      ? format(
                          parseDateString(ticket.scheduledDate),
                          "MMM d, yyyy"
                        )
                      : "N/A"}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewTicket(ticket)}
                    >
                      <Eye className="h-3 w-3 mr-1" /> View
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditTicket(ticket)}
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
                            delete the maintenance ticket
                            <strong> "{ticket.title}" </strong>
                            with ID{" "}
                            <strong>"{ticket.ticketId || ticket.id}"</strong>.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel disabled={isDeleting}>
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              handleDeleteConfirm(ticket.id, ticket.title)
                            }
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            {isDeleting ? "Deleting..." : "Delete Ticket"}
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

      {/* View Ticket Dialog */}
      <ViewMaintenanceDialog
        ticket={viewTicket}
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        onEdit={handleEditTicket}
        canEdit={true}
      />

      {/* Edit Ticket Dialog */}
      <EditMaintenanceDialog
        ticket={editTicket}
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
