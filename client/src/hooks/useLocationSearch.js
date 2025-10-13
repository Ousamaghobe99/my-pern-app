import { useState, useMemo, useCallback } from "react";
import { useLocations } from "./useApi";

export const useLocationSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Fetch locations from API
  const { data: response, isLoading, error, refetch } = useLocations({
    search: searchTerm,
    page,
    limit,
  });

  // Extract locations list
  const locations = useMemo(() => response?.data || response || [], [response]);

  // Pagination info
  const pagination = useMemo(() => ({
    page: response?.pagination?.page || page,
    totalPages: response?.pagination?.totalPages || 1,
    hasNextPage: response?.pagination ? response.pagination.page < response.pagination.totalPages : false,
    hasPrevPage: response?.pagination ? response.pagination.page > 1 : false,
    total: response?.pagination?.total || locations.length,
  }), [response, page, locations.length]);

  // Handlers
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    setPage(1);
  }, []);

  const nextPage = useCallback(() => {
    if (pagination.hasNextPage) setPage(prev => prev + 1);
  }, [pagination.hasNextPage]);

  const prevPage = useCallback(() => {
    if (pagination.hasPrevPage) setPage(prev => prev - 1);
  }, [pagination.hasPrevPage]);

  return {
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
  };
};
