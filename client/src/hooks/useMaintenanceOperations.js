import { useDeleteMaintenanceTicket, useUpdateMaintenanceTicket, useCreateMaintenanceTicket } from "./useApi"
import { toast } from "sonner"

export const useMaintenanceOperations = () => {
  const deleteTicketMutation = useDeleteMaintenanceTicket()
  const updateTicketMutation = useUpdateMaintenanceTicket()
  const createTicketMutation = useCreateMaintenanceTicket()

  const handleDelete = async (id, title) => {
    try {
      await deleteTicketMutation.mutateAsync(id)
      toast.success("Maintenance ticket deleted successfully", {
        description: `${title} has been removed from the system`,
      })
    } catch (error) {
      toast.error("Failed to delete maintenance ticket", {
        description: error?.response?.data?.message || "Please try again later",
      })
    }
  }

  const handleStatusUpdate = async (id, title, newStatus) => {
    try {
      await updateTicketMutation.mutateAsync({
        id,
        ticketData: { status: newStatus },
      })
      toast.success("Maintenance ticket status updated", {
        description: `${title} status changed to ${newStatus}`,
      })
    } catch (error) {
      toast.error("Failed to update status", {
        description: error?.response?.data?.message || "Please try again later",
      })
    }
  }

  const handleCreateTicket = async (ticketData) => {
    try {
      await createTicketMutation.mutateAsync(ticketData)
      toast.success("Maintenance ticket created successfully", {
        description: `${ticketData.title} has been added to the system`,
      })
      return true
    } catch (error) {
      toast.error("Failed to create maintenance ticket", {
        description: error?.response?.data?.message || error?.message || "Please try again later",
      })
      return false
    }
  }

  const handleUpdateTicket = async (ticketId, ticketData) => {
    try {
      await updateTicketMutation.mutateAsync({
        id: ticketId,
        ticketData: ticketData,
      })
      // Don't show toast here - let the calling component handle it
      return true
    } catch (error) {
      toast.error("Failed to update maintenance ticket", {
        description: error?.response?.data?.message || error?.message || "Please try again later",
      })
      return false
    }
  }

  return {
    handleDelete,
    handleStatusUpdate,
    handleCreateTicket,
    handleUpdateTicket,
    isDeleting: deleteTicketMutation.isPending,
    isUpdating: updateTicketMutation.isPending,
    isCreating: createTicketMutation.isPending,
  }
}