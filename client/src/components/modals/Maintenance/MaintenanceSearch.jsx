import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

export default function MaintenanceSearch({ searchTerm, onSearch, filters, onFilterChange, onClearFilters }) {
  const handleSearchChange = (e) => {
    onSearch(e.target.value);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tickets by title, ID, interface, or assigned person..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="pl-8"
        />
      </div>
      
      {/* Optional: Add filter dropdown if you want to implement advanced filtering */}
      <Button variant="outline" onClick={() => {/* Add filter logic here */}}>
        <Filter className="mr-2 h-4 w-4" />
        Filter
      </Button>
      
      {/* Clear filters button - show only if filters are active */}
      {(filters && Object.values(filters).some(f => f)) && (
        <Button variant="outline" onClick={onClearFilters}>
          Clear Filters
        </Button>
      )}
    </div>
  );
}