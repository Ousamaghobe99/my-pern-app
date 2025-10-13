import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function ErrorState({ error, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
      <h3 className="text-lg font-semibold mb-2">Failed to load interfaces</h3>
      <p className="text-muted-foreground mb-4 text-center max-w-md">
        {error?.response?.data?.message || "There was an error loading the interface data."}
      </p>
      <Button onClick={onRetry}>Retry</Button>
    </div>
  )
}