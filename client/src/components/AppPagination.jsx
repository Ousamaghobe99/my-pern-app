import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"

export default function AppPagination({
  page,
  pagination,
  onPrevious,
  onNext,
  isLoading,
  label = "results",
}) {
  if (!pagination || pagination.total === 0) return null

  const { total, limit } = pagination
  const totalPages = pagination.totalPages ?? Math.ceil(total / limit)
  const start = (page - 1) * limit + 1
  const end = Math.min(page * limit, total)

  return (
    <div className="flex items-center justify-between mt-4">
      <p className="text-sm text-muted-foreground">
        Showing {start} to {end} of {total} {label}
      </p>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={onPrevious}
              aria-disabled={page <= 1 || isLoading}
              className={page <= 1 || isLoading ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          <PaginationItem>
            <span className="text-sm">
              Page {page} of {totalPages}
            </span>
          </PaginationItem>

          <PaginationItem>
            <PaginationNext
              onClick={onNext}
              aria-disabled={page >= totalPages || isLoading}
              className={page >= totalPages || isLoading ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
