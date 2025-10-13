import { useCreateLocation, useUpdateLocation, useDeleteLocation } from './useApi';
import { toast } from 'sonner';

export const useLocationOperations = () => {
  const createLocationMutation = useCreateLocation();
  const updateLocationMutation = useUpdateLocation();
  const deleteLocationMutation = useDeleteLocation();

  // Create location handler
  const handleCreateLocation = async (locationData) => {
    try {
      await createLocationMutation.mutateAsync(locationData);
      toast.success('Location created successfully');
      return true;
    } catch (error) {
      console.error('Create location error:', error);
      toast.error(error.response?.data?.message || 'Failed to create location');
      return false;
    }
  };

  // Update location handler
  const handleUpdateLocation = async (locationId, locationData) => {
    try {
      await updateLocationMutation.mutateAsync({ id: locationId, locationData });
      toast.success('Location updated successfully');
      return true;
    } catch (error) {
      console.error('Update location error:', error);
      toast.error(error.response?.data?.message || 'Failed to update location');
      return false;
    }
  };

  // Delete location handler
  const handleDeleteLocation = async (locationId, locationName) => {
    try {
      await deleteLocationMutation.mutateAsync(locationId);
      toast.success(`Location "${locationName}" deleted successfully`);
      return true;
    } catch (error) {
      console.error('Delete location error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete location');
      return false;
    }
  };

  return {
    handleCreateLocation,
    handleUpdateLocation,
    handleDeleteLocation,
    isCreating: createLocationMutation.isPending,
    isUpdating: updateLocationMutation.isPending,
    isDeleting: deleteLocationMutation.isPending
  };
};