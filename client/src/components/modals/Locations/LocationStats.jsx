import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Package, MapPin, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function LocationStats({ locations, isLoading }) {
  if (isLoading) {
    // Skeleton loading state
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
              </CardTitle>
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded animate-pulse w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Compute stats dynamically
  const totalLocations = locations.length;
  const totalInterfaces = locations.reduce((acc, loc) => acc + (loc.totalInterfaces || 0), 0);
  const totalCapacity = locations.reduce((acc, loc) => acc + (loc.totalCapacity || 0), 0);
  const avgUtilization =
    totalCapacity > 0
      ? Math.round((totalInterfaces / totalCapacity) * 100)
      : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Locations</CardTitle>
          <Building className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalLocations}</div>
          <p className="text-xs text-muted-foreground">Active facility locations</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Interfaces</CardTitle>
          <Package className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalInterfaces}</div>
          <p className="text-xs text-muted-foreground">Across all locations</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
          <MapPin className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCapacity}</div>
          <p className="text-xs text-muted-foreground">Maximum interface slots</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Utilization</CardTitle>
          <TrendingUp className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgUtilization}%</div>
          <p className="text-xs text-muted-foreground">Capacity utilization</p>
        </CardContent>
      </Card>
    </div>
  );
}
