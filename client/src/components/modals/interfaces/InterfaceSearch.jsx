import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function InterfaceSearch({ searchTerm, onSearch }) {
  return (
    <div className="relative flex-1 max-w-sm">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search interfaces..."
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        className="pl-8"
      />
    </div>
  )
}