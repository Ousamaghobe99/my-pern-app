import { Button } from "@/components/ui/button"

export default function InterfacePagination({ 
  page, 
  pagination, 
  onPrevious, 
  onNext, 
  isLoading 
}) {
  if (!pagination || pagination.total === 0) return null

  const start = (page - 1) * pagination.limit + 1
  const end = Math.min(page * pagination.limit, pagination.total)
  const totalPages = Math.ceil(pagination.total / pagination.limit)

  return (
    <div className="flex items-center justify-between mt-4">
      <p className="text-sm text-muted-foreground">
        Showing {start} to {end} of {pagination.total} results
      </p>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevious}
          disabled={page === 1 || isLoading}
        >
          Previous
        </Button>
        <span className="px-2 text-sm">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={page >= totalPages || isLoading}
        >
          Next
        </Button>
      </div>
    </div>
  )
}