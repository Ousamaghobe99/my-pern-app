import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function UserPagination({ 
  page, 
  pagination, 
  onPrevious, 
  onNext, 
  isLoading 
}) {
  const { totalPages = 1, total = 0 } = pagination
  const startItem = ((page - 1) * 10) + 1
  const endItem = Math.min(page * 10, total)

  return (
    <div className="flex items-center justify-between pt-4">
      <div className="text-sm text-gray-500">
        Showing {startItem} to {endItem} of {total} users
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevious}
          disabled={page === 1 || isLoading}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <div className="flex items-center px-4 text-sm">
          Page {page} of {totalPages}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={page >= totalPages || isLoading}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}