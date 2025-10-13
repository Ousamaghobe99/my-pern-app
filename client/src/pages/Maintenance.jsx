import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useMaintenanceStatistics } from "../hooks/useApi"
import { useMaintenanceSearch } from "../hooks/useMaintenanceSearch"
import { useMaintenanceOperations } from "../hooks/useMaintenanceOperations"
import { useFormOptions } from "../hooks/useFormOptions"

import MaintenanceStats from "@/components/modals/Maintenance/MaintenanceStats"
import MaintenanceSearch from "@/components/modals/Maintenance/MaintenanceSearch"
import MaintenanceTable from "@/components/modals/Maintenance/MaintenanceTable"
import MaintenancePagination from "@/components/modals/Maintenance/MaintenancePagination"
import ErrorState from "@/components/ui/ErrorState"
import LoadingState from "@/components/ui/LoadingState"
import AddMaintenanceDialog from "@/components/modals/Maintenance/AddMaintenanceDialog"
import { useProfile } from "../hooks/useApi"
import { DEFAULT_MAINTENANCE_TICKET } from "@/constants/maintenanceDefaults"
import { validateMaintenanceData, formatMaintenanceData } from "@/lib/maintenanceValidation"

export default function Maintenance() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newTicket, setNewTicket] = useState(DEFAULT_MAINTENANCE_TICKET)

  // Hooks
  const { searchTerm, page, tickets, pagination, isLoading, error, refetch, handleSearch, nextPage, prevPage } = useMaintenanceSearch()
  const { data: stats, isLoading: statsLoading } = useMaintenanceStatistics()
  const { handleDelete, handleStatusUpdate, handleCreateTicket, handleUpdateTicket, isDeleting, isUpdating, isCreating } = useMaintenanceOperations()
  const formOptions = useFormOptions()
  const { data: currentUser } = useProfile()

  // Open dialog handler - simplified, let the dialog handle initialization
  const handleOpenDialog = useCallback(() => {
    console.log('Opening dialog...')
    console.log('Form options available:', !!formOptions)
    
    // Reset to empty form - let the dialog's useEffect handle defaults
    setNewTicket({
      title: "",
      description: "",
      interfaceId: "",
      priority: "",
      type: "",
      assignedTo: "",
      dueDate: "",
    })
    
    setIsAddDialogOpen(true)
  }, [formOptions])

  // Add Ticket handlers
  const handleAddTicket = async () => {
    console.log('Attempting to create ticket:', newTicket)
    
    const errors = validateMaintenanceData(newTicket)
    if (errors.length > 0) {
      errors.forEach(err => toast.error(err))
      return
    }

    const success = await handleCreateTicket(formatMaintenanceData(newTicket, currentUser?.id))
    if (success) {
      setIsAddDialogOpen(false)
      setNewTicket(DEFAULT_MAINTENANCE_TICKET)
      toast.success('Maintenance ticket created successfully')
    }
  }

  // Update Ticket handler
  const handleUpdateTicketData = async (ticketId, updatedData) => {
    console.log('Updating ticket:', ticketId, updatedData)
    const errors = validateMaintenanceData(updatedData)
    if (errors.length > 0) {
      errors.forEach(err => toast.error(err))
      return false
    }

    const success = await handleUpdateTicket(ticketId, formatMaintenanceData(updatedData))
    if (success) {
      toast.success('Maintenance ticket updated successfully')
      refetch() // Refresh the list to show updated data
    }
    return success
  }

  const handleDialogCancel = () => {
    console.log('Dialog cancelled')
    setIsAddDialogOpen(false)
    setNewTicket(DEFAULT_MAINTENANCE_TICKET)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Maintenance</h1>
          <p className="text-muted-foreground">Track and manage maintenance tickets</p>
        </div>

        {/* Open Add Dialog Button */}
        <Button
          className="btn btn-primary"
          onClick={handleOpenDialog}
          disabled={!formOptions} // Disable until formOptions are loaded
        >
          Create Ticket
        </Button>
      </div>

      {/* Add Maintenance Dialog */}
      <AddMaintenanceDialog
        open={isAddDialogOpen}
        setOpen={setIsAddDialogOpen}
        newTicket={newTicket}
        setNewTicket={setNewTicket}
        onSubmit={handleAddTicket}
        onCancel={handleDialogCancel}
        isLoading={isCreating}
        formOptions={formOptions}
      />

      {/* Stats */}
      <MaintenanceStats stats={stats} isLoading={statsLoading} />

      {/* Maintenance List */}
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Tickets</CardTitle>
          <CardDescription>Monitor and manage all maintenance activities</CardDescription>
          <div className="mt-4">
            <MaintenanceSearch searchTerm={searchTerm} onSearch={handleSearch} />
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <ErrorState error={error} onRetry={refetch} />
          ) : isLoading ? (
            <LoadingState />
          ) : (
            <>
              <MaintenanceTable
                tickets={tickets}
                onDelete={handleDelete}
                onStatusUpdate={handleStatusUpdate}
                onUpdate={handleUpdateTicketData}
                isDeleting={isDeleting}
                isUpdating={isUpdating}
                formOptions={formOptions}
              />
              <MaintenancePagination
                page={page}
                pagination={pagination}
                onPrevious={prevPage}
                onNext={nextPage}
                isLoading={isLoading}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}