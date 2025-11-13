import { useState, useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { usersAPI } from '../lib/api'


export function useUserOperations() {
  const queryClient = useQueryClient()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isSendingCredentials, setIsSendingCredentials] = useState(false)

  // Create User Mutation
  const createMutation = useMutation({
    mutationFn: async (userData) => {
      console.log('Creating user with data:', userData)
      const response = await usersAPI.createUser(userData)
      console.log('User created successfully:', response)
      return response.data.data
    },
    onSuccess: (data) => {
      console.log('Invalidating queries after user creation')
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['users', 'statistics'] })
      toast.success('User created successfully')
    },
    onError: (error) => {
      console.error('Error creating user:', error)
      const errorMessage = error?.response?.data?.message || error.message || 'Failed to create user'
      toast.error(errorMessage)
    }
  })

  // Update User Mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, userData }) => {
      console.log('Updating user:', id, 'with data:', userData)
      const response = await usersAPI.updateUser(id, userData)
      console.log('User updated successfully:', response)
      return response.data.data
    },
    onSuccess: (data) => {
      console.log('Invalidating queries after user update')
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User updated successfully')
    },
    onError: (error) => {
      console.error('Error updating user:', error)
      const errorMessage = error?.response?.data?.message || error.message || 'Failed to update user'
      toast.error(errorMessage)
    }
  })

  // Delete User Mutation
  const deleteMutation = useMutation({
    mutationFn: async (userId) => {
      console.log('Deleting user:', userId)
      const response = await usersAPI.deleteUser(userId)
      console.log('User deleted successfully')
      return response.data
    },
    onSuccess: (data) => {
      console.log('Invalidating queries after user deletion')
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['users', 'statistics'] })
      toast.success('User deleted successfully')
    },
    onError: (error) => {
      console.error('Error deleting user:', error)
      const errorMessage = error?.response?.data?.message || error.message || 'Failed to delete user'
      toast.error(errorMessage)
    }
  })

  // Send Credentials Mutation
  const sendCredentialsMutation = useMutation({
    mutationFn: async ({ userId, email }) => {
      console.log('Sending credentials to user:', userId, email)
      const response = await usersAPI.sendUserCredentials(userId, email)
      console.log('Credentials sent successfully')
      return response.data
    },
    onSuccess: () => {
      toast.success('Credentials sent successfully')
    },
    onError: (error) => {
      console.error('Error sending credentials:', error)
      const errorMessage = error?.response?.data?.message || error.message || 'Failed to send credentials'
      toast.error(errorMessage)
    }
  })

  // Handle Create User
 const handleCreateUser = useCallback(async (userData) => {
  setIsCreating(true)
  try {
    console.log('Creating user with data:', userData)
    const result = await createMutation.mutateAsync(userData)
    console.log('User created successfully:', result)
    return { success: true, data: result }
  } catch (error) {
    console.error('Error creating user:', error)
    
    const status = error?.response?.status
    // Get the error message from backend
    const message = error?.response?.data?.message || error.message || 'Failed to create user'
    
    // The backend already sends specific messages, just use them!
    if (status === 409) {
      // Conflict: email or matricule already exists
      toast.error(message)
      return { success: false, error: message, type: 'conflict' }
    } else if (status === 422) {
      // Validation errors
      const errorData = error?.response?.data
      const fieldErrors = {}
      if (errorData?.errors) {
        errorData.errors.forEach(err => {
          fieldErrors[err.field] = err.message
        })
      }
      toast.error('Please fix the validation errors')
      return { success: false, fieldErrors, type: 'validation' }
    } else if (status === 404) {
      // Invalid role
      toast.error(message)
      return { success: false, error: message, type: 'not_found' }
    } else {
      // Any other error
      toast.error(message)
      return { success: false, error: message, type: 'unknown' }
    }
  } finally {
    setIsCreating(false)
  }
}, [createMutation])

  // Handle Update User
  const handleUpdateUser = useCallback(async (userId, userData) => {
    setIsUpdating(true)
    try {
      console.log('Starting user update process for user:', userId)
      await updateMutation.mutateAsync({ id: userId, userData })
      return true
    } catch (error) {
      console.error('Error in handleUpdateUser:', error)
      return false
    } finally {
      setIsUpdating(false)
    }
  }, [updateMutation])

  // Handle Delete User
  const handleDelete = useCallback(async (userId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this user? This action cannot be undone.'
    )
    
    if (!confirmed) {
      console.log('User deletion cancelled')
      return false
    }

    setIsDeleting(true)
    try {
      console.log('Starting user deletion for user:', userId)
      await deleteMutation.mutateAsync(userId)
      return true
    } catch (error) {
      console.error('Error in handleDelete:', error)
      return false
    } finally {
      setIsDeleting(false)
    }
  }, [deleteMutation])

  // Handle Send Credentials
  const handleSendCredentials = useCallback(async (userId, email) => {
    try {
      console.log('Starting credential send process for user:', userId, email)
      setIsSendingCredentials(true)
      await sendCredentialsMutation.mutateAsync({ userId, email })
      return true
    } catch (error) {
      console.error('Error in handleSendCredentials:', error)
      return false
    } finally {
      setIsSendingCredentials(false)
    }
  }, [sendCredentialsMutation])

  // Resend password for user
  const handleResendPassword = useCallback(async (userId, email) => {
    try {
      console.log('Resending password to user:', userId)
      const confirmed = window.confirm(
        'Generate a new temporary password and send it to ' + email + '?'
      )
      
      if (!confirmed) return false

      setIsSendingCredentials(true)
      await sendCredentialsMutation.mutateAsync({ userId, email })
      return true
    } catch (error) {
      console.error('Error in handleResendPassword:', error)
      return false
    } finally {
      setIsSendingCredentials(false)
    }
  }, [sendCredentialsMutation])

  return {
    // Handlers
    handleCreateUser,
    handleUpdateUser,
    handleDelete,
    handleSendCredentials,
    handleResendPassword,
    
    // Loading states
    isCreating,
    isUpdating,
    isDeleting,
    isSendingCredentials,
    isLoading: isCreating || isUpdating || isDeleting || isSendingCredentials,
    
    // Mutations (for direct access if needed)
    createMutation,
    updateMutation,
    deleteMutation,
    sendCredentialsMutation
  }
}

