import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Edit, 
  Calendar, 
  User, 
  AlertTriangle, 
  Clock, 
  CheckCircle,
  Wrench,
  FileText
} from "lucide-react";
import { format } from "date-fns";
import { getPriorityColor, getMaintenanceStatusColor } from "@/lib/maintenanceValidation";

export default function ViewMaintenanceDialog({
  ticket,
  open,
  onOpenChange,
  onEdit,
  canEdit = true
}) {
  if (!ticket) return null;

  // Debug log to see ticket structure
  console.log('ViewMaintenanceDialog ticket:', ticket);
  console.log('Ticket assignedTo:', ticket.assignedTo);
  console.log('Ticket reportedBy:', ticket.reportedBy);

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'Critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'High':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'Medium':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'Low':
        return <Clock className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Open':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'InProgress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'Resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Closed':
        return <CheckCircle className="h-4 w-4 text-gray-500" />;
      case 'OnHold':
        return <Clock className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleEditClick = () => {
    onOpenChange(false);
    onEdit(ticket);
  };

  // Format assigned user display text
  const getAssignedToDisplay = (assignedTo) => {
    if (!assignedTo) return 'Unassigned';
    
    // If it's an object (user object)
    if (typeof assignedTo === 'object' && assignedTo.firstName) {
      return `${assignedTo.firstName} ${assignedTo.lastName} (${assignedTo.matricule})`;
    }
    
    // If it's a string
    if (typeof assignedTo === 'string') {
      return assignedTo;
    }
    
    return 'Unassigned';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Maintenance Ticket Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Ticket ID</Label>
              <p className="font-mono text-sm">{ticket.ticketId || ticket.id}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Created</Label>
              <p className="text-sm">
                {ticket.createdAt ? format(new Date(ticket.createdAt), 'PPP p') : 'N/A'}
              </p>
            </div>
          </div>

          <Separator />

          {/* Title */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">Title</Label>
            <h3 className="text-lg font-semibold">{ticket.title}</h3>
          </div>

          {/* Description */}
          {ticket.description && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Description</Label>
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-sm whitespace-pre-wrap">{ticket.description}</p>
              </div>
            </div>
          )}

          {/* Interface Information */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">Interface</Label>
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">
                {ticket.interface?.interfaceName || ticket.interfaceName || 'N/A'}
              </span>
              {ticket.interface?.serialNumber && (
                <span className="text-sm text-muted-foreground">
                  (SN: {ticket.interface.serialNumber})
                </span>
              )}
            </div>
          </div>

          {/* Status and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Status</Label>
              <div className="flex items-center gap-2">
                {getStatusIcon(ticket.status)}
                <Badge className={getMaintenanceStatusColor(ticket.status)}>
                  {ticket.status}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Priority</Label>
              <div className="flex items-center gap-2">
                {getPriorityIcon(ticket.priority)}
                <Badge className={getPriorityColor(ticket.priority)}>
                  {ticket.priority}
                </Badge>
              </div>
            </div>
          </div>

          {/* Type and Assignment */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Type</Label>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>{ticket.type}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Assigned To</Label>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{getAssignedToDisplay(ticket.assignedTo)}</span>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Due Date</Label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  {ticket.dueDate ? format(new Date(ticket.dueDate), 'PPP') : 'Not set'}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Last Updated</Label>
              <p className="text-sm">
                {ticket.updatedAt ? format(new Date(ticket.updatedAt), 'PPP p') : 'N/A'}
              </p>
            </div>
          </div>

          {/* Reporter Information */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">Reported By</Label>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{
                ticket.reportedBy 
                  ? typeof ticket.reportedBy === 'object' 
                    ? `${ticket.reportedBy.firstName || ''} ${ticket.reportedBy.lastName || ''}`.trim() || 'N/A'
                    : ticket.reportedBy
                  : 'N/A'
              }</span>
            </div>
          </div>

          {/* Additional Information */}
          {ticket.estimatedTime && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Estimated Time</Label>
              <p className="text-sm">{String(ticket.estimatedTime)}</p>
            </div>
          )}

          {ticket.actualTime && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Actual Time</Label>
              <p className="text-sm">{String(ticket.actualTime)}</p>
            </div>
          )}

          {/* Maintenance Logs */}
          {ticket.logs && ticket.logs.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Maintenance Logs</Label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {ticket.logs.map((log, index) => (
                  <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">
                        {log.technician 
                          ? typeof log.technician === 'object' 
                            ? `${log.technician.firstName || ''} ${log.technician.lastName || ''}`.trim() || 'Unknown'
                            : log.technician
                          : 'Unknown'
                        }
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {log.timestamp ? format(new Date(log.timestamp), 'MMM d, HH:mm') : 'N/A'}
                      </span>
                    </div>
                    <p>{log.note || ''}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {canEdit && (
            <Button onClick={handleEditClick}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Ticket
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}