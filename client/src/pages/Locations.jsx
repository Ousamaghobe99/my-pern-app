import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import AddLocationDialog from "@/components/modals/Locations/AddLocationDialog";
import LocationStats from "@/components/modals/Locations/LocationStats";
import LocationSearch from "@/components/modals/Locations/LocationSearch";
import LocationGrid from "@/components/modals/Locations/LocationGrid";
import AppPagination from "@/components/AppPagination";
import ErrorState from "@/components/ui/ErrorState";
import LoadingState from "@/components/ui/LoadingState";

import { DEFAULT_LOCATION } from "@/constants/locationDefaults";
import { useLocationSearch } from "../hooks/useLocationSearch";
import { useProfile } from "../hooks/useApi";
import { useLocationOperations } from "../hooks/useLocationOperations";

export default function Locations() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newLocation, setNewLocation] = useState(DEFAULT_LOCATION);

  // Hooks
  const {
    searchTerm,
    page,
    locations,
    pagination,
    isLoading,
    error,
    refetch,
    handleSearch,
    nextPage,
    prevPage,
  } = useLocationSearch();

  const { data: currentUser } = useProfile();
  const {
    handleCreateLocation,
    handleUpdateLocation,
    handleDeleteLocation,
    isCreating,
    isUpdating,
    isDeleting,
  } = useLocationOperations();

  // Open add dialog
  const handleOpenDialog = useCallback(() => {
    setNewLocation(DEFAULT_LOCATION);
    setIsAddDialogOpen(true);
  }, []);

  // Add Location
  const handleAddLocation = async (locationData) => {
    const success = await handleCreateLocation({ ...locationData, manager: currentUser?.id });
    if (success) {
      setIsAddDialogOpen(false);
      setNewLocation(DEFAULT_LOCATION);
      refetch();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Locations</h1>
          <p className="text-muted-foreground">Manage facility locations and their capacity</p>
        </div>
        <Button onClick={handleOpenDialog}>
          <Plus className="mr-2 h-4 w-4" /> Add Location
        </Button>
      </div>

      {/* Add Location Dialog */}
      <AddLocationDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddLocation}
        isLoading={isCreating}
      />

      {/* Stats */}
      <LocationStats locations={locations} isLoading={isLoading} />

      {/* Locations List */}
      <Card>
        <CardHeader>
          <CardTitle>Facility Locations</CardTitle>
          <p className="text-xs text-muted-foreground">Monitor and manage all facility locations and capacity</p>
          <div className="mt-4">
            <LocationSearch searchTerm={searchTerm} onSearch={handleSearch} />
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <ErrorState error={error} onRetry={refetch} />
          ) : isLoading ? (
            <LoadingState />
          ) : (
            <>
              <LocationGrid
                locations={locations}
                onDelete={handleDeleteLocation}
                onUpdate={handleUpdateLocation}
                isDeleting={isDeleting}
                isUpdating={isUpdating}
              />
              <AppPagination
                page={page}
                pagination={pagination}
                onPrevious={prevPage}
                onNext={nextPage}
                isLoading={isLoading}
                label="locations"
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
