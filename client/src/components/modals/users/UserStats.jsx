import { Card } from "@/components/ui/card"
import { UserPlus, Users, Shield, Wrench } from 'lucide-react'

export default function UserStats({ stats, isLoading }) {
  const statsData = [
    {
      title: "Total Users",
      value: stats?.total || 0,
      icon: Users,
      colorClass: "bg-blue-100 text-blue-600"
    },
    {
      title: "Active Users",
      value: stats?.active || 0,
      icon: UserPlus,
      colorClass: "bg-green-100 text-green-600"
    },
    {
      title: "Admins",
      value: stats?.admins || 0,
      icon: Shield,
      colorClass: "bg-purple-100 text-purple-600"
    },
    {
      title: "Technicians",
      value: stats?.technicians || 0,
      icon: Wrench,
      colorClass: "bg-orange-100 text-orange-600"
    }
  ]

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {statsData.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-semibold">{stat.value}</p>
              </div>
              <div className={`p-2 rounded-lg ${stat.colorClass}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}