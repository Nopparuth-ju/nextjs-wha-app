import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type KpiCardProps = {
  title: string
  value: string
  icon?: React.ReactNode
}

function KpiCard({ title, value, icon }: KpiCardProps) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon && <span className="text-muted-foreground">{icon}</span>}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold tracking-tight">{value}</p>
      </CardContent>
    </Card>
  )
}

function KpiCardSkeleton() {
  return (
    <Card size="sm">
      <CardHeader>
        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
      </CardHeader>
      <CardContent>
        <div className="h-8 w-28 animate-pulse rounded bg-muted" />
      </CardContent>
    </Card>
  )
}

export { KpiCard, KpiCardSkeleton }
