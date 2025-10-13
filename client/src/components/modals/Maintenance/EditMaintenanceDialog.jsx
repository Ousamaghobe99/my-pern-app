import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import MatriculeAutocomplete from "./MatriculeAutocomplete";
import InlineDatePicker from "@/components/InlineDatePicker";
import { 
  Wrench, 
  AlertTriangle, 
  Clock, 
  CheckCircle 
} from "lucide-react";

export default function EditMaintenanceDialog({
  ticket,
  open,
  onOpenChange,
  onSave,
  onCancel,
  isLoading,
  formOptions
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    interfaceId: "",
    priority: "Medium",
    type: "Corrective",
    assignedTo: "",
    dueDate: "",
    status: "Open"
  });

  // Initialize form data when ticket changes
  useEffect(() => {
    if (ticket) {
      let assignedToValue = "";
      if (ticket.assignedTo) {
        if (typeof ticket.assignedTo === 'object' && ticket.assignedTo.id) {
          assignedToValue = ticket.assignedTo.id;
        } else if (typeof ticket.assignedTo === 'string') {
          assignedToValue = ticket.assignedTo;
        }
      }

      setFormData({
        title: ticket.title || "",
        description: ticket.description || "",
        interfaceId: ticket.interfaceId || ticket.interface?.id || "",
        priority: ticket.priority || "Medium",
        type: ticket.type || "Corrective",
        assignedTo: assignedToValue,
        dueDate: ticket.dueDate || "",
        status: ticket.status || "Open"
      });
    }
  }, [ticket]);

  if (!ticket) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateSelect = (date) => {
    if (date) {
      const selectedDate = new Date(date);
      selectedDate.setHours(23, 59, 59, 999);
      setFormData(prev => ({ ...prev, dueDate: selectedDate.toISOString() }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(ticket.id, formData);
  };

  const handleCancel = () => {
    onCancel();
    onOpenChange(false);
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'Critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'High': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'Medium': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'Low': return <Clock className="h-4 w-4 text-green-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Open': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'InProgress': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'Resolved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Closed': return <CheckCircle className="h-4 w-4 text-gray-500" />;
      case 'OnHold': return <Clock className="h-4 w-4 text-orange-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Edit Maintenance Ticket
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title *</Label>
            <Input
              id="edit-title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter ticket title"
              disabled={isLoading}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe the maintenance issue or task"
              disabled={isLoading}
              rows={4}
            />
          </div>

          {/* Interface */}
          <div className="space-y-2">
            <Label>Interface *</Label>
            <Select
              value={formData.interfaceId}
              onValueChange={(value) => handleInputChange("interfaceId", value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select interface" />
              </SelectTrigger>
              <SelectContent>
                {formOptions?.interfaceOptions?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange("status", value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {formOptions?.statusOptions?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(option.value)}
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority *</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleInputChange("priority", value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {formOptions?.priorityOptions?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        {getPriorityIcon(option.value)}
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Maintenance Type */}
          <div className="space-y-2">
            <Label>Maintenance Type *</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleInputChange("type", value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {formOptions?.maintenanceTypeOptions?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Assigned To */}
          <MatriculeAutocomplete
            key={`edit-technician-${open}-${formOptions?.technicianOptions?.length || 0}`}
            value={formData.assignedTo}
            onChange={(userId) => handleInputChange("assignedTo", userId)}
            users={formOptions?.technicianOptions || []}
            disabled={isLoading}
            label="Assigned To"
            placeholder="Enter technician matricule..."
          />

          {/* Due Date */}
          <div className="space-y-2">
            <Label>Due Date *</Label>
            <InlineDatePicker
              value={formData.dueDate}
              onChange={handleDateSelect}
              disabledDates={(date) => date < new Date().setHours(0, 0, 0, 0)}
            />
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                Reported By
              </Label>
              <p className="text-sm">{
                ticket?.reportedBy 
                  ? typeof ticket.reportedBy === 'object' 
                    ? `${ticket.reportedBy.firstName || ''} ${ticket.reportedBy.lastName || ''}`.trim() || 'N/A'
                    : ticket.reportedBy
                  : 'N/A'
              }</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                Last Updated
              </Label>
              <p className="text-sm">
                {ticket?.updatedAt
                  ? format(new Date(ticket.updatedAt), "PPP p")
                  : "N/A"}
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
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
