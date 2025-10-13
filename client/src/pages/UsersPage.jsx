import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { UserPlus } from 'lucide-react'

import { useUserStatistics } from "../hooks/useApi"
import { useUserSearch } from "../hooks/useUserSearch"
import { useUserOperations } from "../hooks/useUserOperations"
import { useFormOptions } from "../hooks/useFormOptions"

import UserStats from "@/components/modals/users/UserStats"
import UserSearch from "@/components/modals/users/UserSearch"
import UserTable from "@/components/modals/users/UserTable"
import UserPagination from "@/components/modals/users/UserPagination"
import ErrorState from "@/components/ui/ErrorState"
import LoadingState from "@/components/ui/LoadingState"
import AddUserDialog from "@/components/modals/users/AddUserDialog"

import { DEFAULT_USER } from "@/constants/userDefaults"
import { validateUserData, formatUserData } from "@/lib/userValidation"

export default function Users() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newUser, setNewUser] = useState(DEFAULT_USER)

  // Hooks
  const { 
    searchTerm, 
    filters, 
    page, 
    users, 
    pagination, 
    isLoading, 
    error, 
    refetch, 
    handleSearch, 
    handleFilterChange,
    nextPage, 
    prevPage 
  } = useUserSearch()
  
  const { data: stats, isLoading: statsLoading } = useUserStatistics()
  const { 
    handleDelete, 
    handleCreateUser, 
    handleUpdateUser,
    handleSendCredentials,
    isDeleting, 
    isUpdating, 
    isCreating 
  } = useUserOperations()
  
  const formOptions = useFormOptions()

  // Open dialog handler - initialize form here
  const handleOpenDialog = useCallback(() => {
    const initializedUser = {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      roleId: formOptions?.roleOptions?.[0]?.value || "",
    }
    console.log('Initializing new user with:', initializedUser)
    console.log('Form options:', formOptions)
    setNewUser(initializedUser)
    setIsAddDialogOpen(true)
  }, [formOptions])

  // Add User handler
  const handleAddUser = async () => {
    console.log('Submitting user:', newUser)
    const errors = validateUserData(newUser)
    if (errors.length > 0) {
      errors.forEach(err => toast.error(err))
      return
    }

    const success = await handleCreateUser(formatUserData(newUser))
    if (success) {
      setIsAddDialogOpen(false)
      setNewUser(DEFAULT_USER)
      refetch()
    }
  }

  // Update User handler
  const handleUpdateUserData = async (userId, updatedData) => {
    console.log('Updating user:', userId, updatedData)
    const errors = validateUserData(updatedData)
    if (errors.length > 0) {
      errors.forEach(err => toast.error(err))
      return false
    }

    const success = await handleUpdateUser(userId, formatUserData(updatedData))
    if (success) {
      toast.success('User updated successfully')
      refetch() // Refresh the list to show updated data
    }
    return success
  }

  const handleDialogCancel = () => {
    setIsAddDialogOpen(false)
    setNewUser(DEFAULT_USER)
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Users Management</h1>
          <p className="text-muted-foreground">Manage system users and their permissions</p>
        </div>

        {/* Open Add Dialog Button */}
        <Button
          className="btn btn-primary"
          onClick={handleOpenDialog}
          disabled={!formOptions}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>

        {/* Add User Dialog */}
        <AddUserDialog
          open={isAddDialogOpen}
          setOpen={setIsAddDialogOpen}
          newUser={newUser}
          setNewUser={setNewUser}
          onSubmit={handleAddUser}
          onCancel={handleDialogCancel}
          isLoading={isCreating}
          formOptions={formOptions}
        />
      </div>

      {/* Stats */}
      <UserStats stats={stats} isLoading={statsLoading} />

      {/* User List */}
      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
          <CardDescription>Monitor and manage all system users</CardDescription>
          <div className="mt-4">
            <UserSearch 
              searchTerm={searchTerm} 
              filters={filters}
              onSearch={handleSearch}
              onFilterChange={handleFilterChange}
              roleOptions={formOptions?.roleOptions}
            />
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <ErrorState error={error} onRetry={refetch} />
          ) : isLoading ? (
            <LoadingState />
          ) : (
            <>
              <UserTable
                users={users}
                onDelete={handleDelete}
                onUpdate={handleUpdateUserData}
                onSendCredentials={handleSendCredentials}
                isDeleting={isDeleting}
                isUpdating={isUpdating}
                formOptions={formOptions}
              />
              <UserPagination
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