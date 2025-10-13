import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Activity, AlertTriangle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

const StatCard = ({ title, value, subtitle, icon: Icon, isLoading }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <Skeleton className="h-8 w-16" />
      ) : (
        <>
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </>
      )}
    </CardContent>
  </Card>
)

export default function InterfaceStats({ stats, isLoading }) {
  const statsConfig = [
    {
      title: "Total Interfaces",
      value: stats?.total || 0,
      subtitle: `${stats?.active || 0} active`,
      icon: Package
    },
    {
      title: "Average Capacity",
      value: `${stats?.averageCapacity || 0}%`,
      subtitle: "Across all interfaces",
      icon: Activity
    },
    {
      title: "Maintenance Required",
      value: stats?.maintenanceRequired || 0,
      subtitle: "Interfaces need attention",
      icon: AlertTriangle
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {statsConfig.map((stat, index) => (
        <StatCard key={index} {...stat} isLoading={isLoading} />
      ))}
    </div>
  )
}