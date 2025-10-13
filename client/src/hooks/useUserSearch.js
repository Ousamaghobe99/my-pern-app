import { useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { usersAPI } from '../lib/api'

export function useUserSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    role: 'all',
    status: 'all'
  })
  const [page, setPage] = useState(1)
  const limit = 10

  // Fetch users with current filters
  const { 
    data, 
    isLoading, 
    error, 
    refetch,
    isFetching 
  } = useQuery({
    queryKey: ['users', searchTerm, filters, page, limit],
    queryFn: () => usersAPI.getUsers({ 
      search: searchTerm, 
      ...filters, 
      page, 
      limit 
    }).then(res => res.data),
    keepPreviousData: true,
  })

  const users = data?.data || []
  const pagination = data?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  }

  // Handle search term change
  const handleSearch = useCallback((term) => {
    console.log('Searching for:', term)
    setSearchTerm(term)
    setPage(1)
  }, [])

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters) => {
    console.log('Applying filters:', newFilters)
    setFilters(prev => ({ ...prev, ...newFilters }))
    setPage(1)
  }, [])

  // Navigate to next page
  const nextPage = useCallback(() => {
    if (page < pagination.totalPages) {
      console.log('Going to next page:', page + 1)
      setPage(prev => prev + 1)
    }
  }, [page, pagination.totalPages])

  // Navigate to previous page
  const prevPage = useCallback(() => {
    if (page > 1) {
      console.log('Going to previous page:', page - 1)
      setPage(prev => prev - 1)
    }
  }, [page])

  // Jump to specific page
  const goToPage = useCallback((pageNum) => {
    if (pageNum > 0 && pageNum <= pagination.totalPages) {
      console.log('Going to page:', pageNum)
      setPage(pageNum)
    }
  }, [pagination.totalPages])

  // Clear all filters and search
  const clearFilters = useCallback(() => {
    console.log('Clearing all filters')
    setSearchTerm('')
    setFilters({ role: 'all', status: 'all' })
    setPage(1)
  }, [])

  return {
    // State
    searchTerm,
    filters,
    page,
    users,
    pagination,
    
    // Loading and Error states
    isLoading,
    isFetching,
    error,
    
    // Handlers
    handleSearch,
    handleFilterChange,
    nextPage,
    prevPage,
    goToPage,
    clearFilters,
    refetch
  }
}
