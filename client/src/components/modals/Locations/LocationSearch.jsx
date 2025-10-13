import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function LocationSearch({ searchTerm, onSearch }) {
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search locations by name, type, or description..."
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        className="pl-8"
      />
    </div>
  );
}