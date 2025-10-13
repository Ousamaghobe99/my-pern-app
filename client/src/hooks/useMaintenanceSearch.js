import { useState, useCallback, useMemo } from 'react'
import { useMaintenanceTickets } from './useApi'
import { useDebouncedValue } from './useDebouncedValue.js'

export const useMaintenanceSearch = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    type: '',
    assignedTo: ''
  })

  // Debounce search term to avoid too many API calls
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 300)

  // Build query parameters
  const queryParams = useMemo(() => {
    const params = {
      page,
      limit: 10,
    }

    if (debouncedSearchTerm) {
      params.search = debouncedSearchTerm
    }

    // Add filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params[key] = value
      }
    })

    return params
  }, [debouncedSearchTerm, page, filters])

  // Fetch maintenance tickets with query
  const {
    data,
    isLoading,
    error,
    refetch
  } = useMaintenanceTickets(queryParams)

  // Extract tickets and pagination from response
  const tickets = Array.isArray(data) ? data : (data?.tickets || data?.data || [])

  const pagination = data?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  }

  // Search handler
  const handleSearch = useCallback((term) => {
    setSearchTerm(term)
    setPage(1) // Reset to first page when searching
  }, [])

  // Filter handlers
  const handleFilterChange = useCallback((filterKey, value) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }))
    setPage(1) // Reset to first page when filtering
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({
      status: '',
      priority: '',
      type: '',
      assignedTo: ''
    })
    setPage(1)
  }, [])

  // Pagination handlers
  const nextPage = useCallback(() => {
    if (page < pagination.totalPages) {
      setPage(prev => prev + 1)
    }
  }, [page, pagination.totalPages])

  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage(prev => prev - 1)
    }
  }, [page])

  const goToPage = useCallback((pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= pagination.totalPages) {
      setPage(pageNumber)
    }
  }, [pagination.totalPages])

  return {
    // Search state
    searchTerm,
    debouncedSearchTerm,
    handleSearch,

    // Filter state
    filters,
    handleFilterChange,
    clearFilters,

    // Pagination state
    page,
    pagination,
    nextPage,
    prevPage,
    goToPage,

    // Data state
    tickets,
    isLoading,
    error,
    refetch,

    // Query params (useful for debugging)
    queryParams
  }
}