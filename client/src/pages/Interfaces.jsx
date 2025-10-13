import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useInterfaceStatistics } from "../hooks/useApi"
import { useInterfaceSearch } from "../hooks/useInterfaceSearch"
import { useInterfaceOperations } from "../hooks/useInterfaceOperations"
import { useFormOptions } from "../hooks/useFormOptions"

import InterfaceStats from "@/components/modals/interfaces/InterfaceStats"
import InterfaceSearch from "@/components/modals/interfaces/InterfaceSearch"
import InterfaceTable from "@/components/modals/interfaces/InterfaceTable"
import InterfacePagination from "@/components/modals/interfaces/InterfacePagination"
import ErrorState from "@/components/ui/ErrorState"
import LoadingState from "@/components/ui/LoadingState"
import AddInterfaceDialog from "@/components/modals/interfaces/AddInterfaceDialog"

import { DEFAULT_INTERFACE } from "@/constants/interfaceDefaults"
import { validateInterfaceData, formatInterfaceData } from "@/lib/interfaceValidation"

export default function Interfaces() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newInterface, setNewInterface] = useState(DEFAULT_INTERFACE)

  // Hooks
  const { searchTerm, page, interfaces, pagination, isLoading, error, refetch, handleSearch, nextPage, prevPage } = useInterfaceSearch()
  const { data: stats, isLoading: statsLoading } = useInterfaceStatistics()
  const { handleDelete, handleStatusUpdate, handleCreateInterface, handleUpdateInterface, isDeleting, isUpdating, isCreating } = useInterfaceOperations()
  const formOptions = useFormOptions()

  // Open dialog handler - initialize form here
  const handleOpenDialog = useCallback(() => {
    const initializedInterface = {
      interfaceName: "",
      serialNumber: "",
      description: "",
      type: formOptions?.typeOptions?.[0]?.value || "",
      status: formOptions?.statusOptions?.[0]?.value || "Available",
      currentLocationId: formOptions?.locationOptions?.[0]?.value || "",
    }
    console.log('Initializing new interface with:', initializedInterface)
    console.log('Form options:', formOptions)
    setNewInterface(initializedInterface)
    setIsAddDialogOpen(true)
  }, [formOptions])

  // Add Interface handlers
  const handleAddInterface = async () => {
    console.log('Submitting interface:', newInterface)
    const errors = validateInterfaceData(newInterface)
    if (errors.length > 0) {
      errors.forEach(err => toast.error(err))
      return
    }

    const success = await handleCreateInterface(formatInterfaceData(newInterface))
    if (success) {
      setIsAddDialogOpen(false)
      setNewInterface(DEFAULT_INTERFACE)
    }
  }

  // Update Interface handler
  const handleUpdateInterfaceData = async (interfaceId, updatedData) => {
    console.log('Updating interface:', interfaceId, updatedData)
    const errors = validateInterfaceData(updatedData)
    if (errors.length > 0) {
      errors.forEach(err => toast.error(err))
      return false
    }

    const success = await handleUpdateInterface(interfaceId, formatInterfaceData(updatedData))
    if (success) {
      toast.success('Interface updated successfully')
      refetch() // Refresh the list to show updated data
    }
    return success
  }

  const handleDialogCancel = () => {
    setIsAddDialogOpen(false)
    setNewInterface(DEFAULT_INTERFACE)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Interfaces</h1>
          <p className="text-muted-foreground">Manage your factory storage interfaces</p>
        </div>

        {/* Open Add Dialog Button */}
        <Button
          className="btn btn-primary"
          onClick={handleOpenDialog}
          disabled={!formOptions} // Disable until formOptions are loaded
        >
          Add Interface
        </Button>

        {/* Add Interface Dialog */}
        <AddInterfaceDialog
          open={isAddDialogOpen}
          setOpen={setIsAddDialogOpen}
          newInterface={newInterface}
          setNewInterface={setNewInterface}
          onSubmit={handleAddInterface}
          onCancel={handleDialogCancel}
          isLoading={isCreating}
          formOptions={formOptions}
        />
      </div>

      {/* Stats */}
      <InterfaceStats stats={stats} isLoading={statsLoading} />

      {/* Interface List */}
      <Card>
        <CardHeader>
          <CardTitle>Interface List</CardTitle>
          <CardDescription>Monitor and manage all storage interfaces</CardDescription>
          <div className="mt-4">
            <InterfaceSearch searchTerm={searchTerm} onSearch={handleSearch} />
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <ErrorState error={error} onRetry={refetch} />
          ) : isLoading ? (
            <LoadingState />
          ) : (
            <>
              <InterfaceTable
                interfaces={interfaces}
                onDelete={handleDelete}
                onStatusUpdate={handleStatusUpdate}
                onUpdate={handleUpdateInterfaceData} // New prop for handling updates
                isDeleting={isDeleting}
                isUpdating={isUpdating}
                formOptions={formOptions} // New prop for form options
              />
              <InterfacePagination
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