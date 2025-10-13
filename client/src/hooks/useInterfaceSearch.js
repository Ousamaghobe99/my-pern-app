import { useState, useMemo } from "react"
import { useInterfaces } from "../hooks/useApi"

export const useInterfaceSearch = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const limit = 10

  const {
    data: interfacesData,
    isLoading,
    error,
    refetch,
  } = useInterfaces({ search: searchTerm, page, limit })

  const interfaces = useMemo(() => 
    interfacesData?.data || interfacesData || [], 
    [interfacesData]
  )
  
  const pagination = interfacesData?.pagination

  const handleSearch = (term) => {
    setSearchTerm(term)
    setPage(1)
  }

  const nextPage = () => setPage(p => p + 1)
  const prevPage = () => setPage(p => Math.max(1, p - 1))

  return {
    searchTerm,
    page,
    interfaces,
    pagination,
    isLoading,
    error,
    refetch,
    handleSearch,
    nextPage,
    prevPage
  }
}
