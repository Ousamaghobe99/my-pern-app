import { useDeleteInterface, useUpdateInterface, useCreateInterface } from "../hooks/useApi"
import { toast } from "sonner"

export const useInterfaceOperations = () => {
  const deleteInterfaceMutation = useDeleteInterface()
  const updateInterfaceMutation = useUpdateInterface()
  const createInterfaceMutation = useCreateInterface()

  const handleDelete = async (id, name) => {
    try {
      await deleteInterfaceMutation.mutateAsync(id)
      toast.success("Interface deleted successfully", {
        description: `${name} has been removed from the system`,
      })
    } catch (error) {
      toast.error("Failed to delete interface", {
        description: error?.response?.data?.message || "Please try again later",
      })
    }
  }

  const handleStatusUpdate = async (id, name, newStatus) => {
    try {
      await updateInterfaceMutation.mutateAsync({
        id,
        interfaceData: { status: newStatus },
      })
      toast.success("Interface status updated", {
        description: `${name} status changed to ${newStatus}`,
      })
    } catch (error) {
      toast.error("Failed to update status", {
        description: error?.response?.data?.message || "Please try again later",
      })
    }
  }

  const handleCreateInterface = async (interfaceData) => {
    try {
      await createInterfaceMutation.mutateAsync(interfaceData)
      toast.success("Interface created successfully", {
        description: `${interfaceData.interfaceName} has been added to the system`,
      })
      return true
    } catch (error) {
      toast.error("Failed to create interface", {
        description: error?.response?.data?.message || error?.message || "Please try again later",
      })
      return false
    }
  }

  const handleUpdateInterface = async (interfaceId, interfaceData) => {
    try {
      await updateInterfaceMutation.mutateAsync({
        id: interfaceId,
        interfaceData: interfaceData,
      })
     
      return true
    } catch (error) {
      toast.error("Failed to update interface", {
        description: error?.response?.data?.message || error?.message || "Please try again later",
      })
      return false
    }
  }


  return {
    handleDelete,
    handleStatusUpdate,
    handleCreateInterface,
    handleUpdateInterface,
    isDeleting: deleteInterfaceMutation.isPending,
    isUpdating: updateInterfaceMutation.isPending,
    isCreating: createInterfaceMutation.isPending,
  }
}
