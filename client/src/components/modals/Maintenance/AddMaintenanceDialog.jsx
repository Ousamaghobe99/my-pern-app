import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import MatriculeAutocomplete from "./MatriculeAutocomplete";
import InterfaceAutocomplete from "./InterfaceAutocomplete";

import InlineDatePicker from "../../InlineDatePicker";


export default function AddMaintenanceDialog({
  open,
  setOpen,
  newTicket,
  setNewTicket,
  onSubmit,
  onCancel,
  isLoading,
  formOptions,
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Initialize form when dialog opens
  useEffect(() => {
    if (open && formOptions) {
      if (
        !newTicket.title &&
        !newTicket.interfaceId &&
        !newTicket.priority &&
        !newTicket.type
      ) {
        setNewTicket({
          title: "",
          description: "",
          interfaceId: "",
          priority: formOptions?.priorityOptions?.[0]?.value || "Medium",
          type: formOptions?.maintenanceTypeOptions?.[0]?.value || "Corrective",
          assignedTo: "",
          dueDate: "",
        });
      }
    }
  }, [open, formOptions, newTicket, setNewTicket]);

  const handleInputChange = (field, value) => {
    setNewTicket((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid()) {
      onSubmit();
    }
  };

  const isFormValid = () => {
    return (
      newTicket.title &&
      newTicket.interfaceId &&
      newTicket.priority &&
      newTicket.type &&
      newTicket.dueDate
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Maintenance Ticket</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={newTicket.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter ticket title"
              disabled={isLoading}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newTicket.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe the maintenance issue or task"
              disabled={isLoading}
              rows={4}
            />
          </div>

          {/* Interface */}
          <InterfaceAutocomplete
            key={`interface-${open}-${formOptions?.interfaceOptions?.length || 0}`}
            value={newTicket.interfaceId}
            onChange={(interfaceId) => handleInputChange("interfaceId", interfaceId)}
            interfaces={formOptions?.interfaceOptions || []}
            disabled={isLoading}
            label="Interface"
            placeholder="Enter interface name..."
            required={true}
          />

          {/* Priority & Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Priority *</Label>
              <Select
                value={newTicket.priority}
                onValueChange={(value) => handleInputChange("priority", value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {formOptions?.priorityOptions?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Type *</Label>
              <Select
                value={newTicket.type}
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
          </div>

          {/* Technician */}
          <MatriculeAutocomplete
            key={`technician-${open}-${formOptions?.technicianOptions?.length || 0}`}
            value={newTicket.assignedTo}
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
              value={newTicket.dueDate}
              onChange={(date) => handleInputChange("dueDate", date)}
              disabledDates={(date) => date < today}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !isFormValid()}>
              {isLoading ? "Creating..." : "Create Ticket"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}