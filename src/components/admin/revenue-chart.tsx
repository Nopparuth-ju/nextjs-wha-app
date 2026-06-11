'use client'

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import type { RevenuePoint } from "@/types/admin-types"

type RevenueChartProps = {
  data: RevenuePoint[]
  loading: boolean
  error: string | null
  onRetry: () => void
}

function RevenueChart({ data, loading, error, onRetry }: RevenueChartProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>รายได้</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-16">
          <Spinner className="size-8" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>รายได้</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-3 py-10">
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button size="sm" variant="outline" onClick={onRetry}>
            ลองอีกครั้ง
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>รายได้</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                stroke="var(--muted-foreground)"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="var(--muted-foreground)"
                tickFormatter={(v: number) =>
                  v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)
                }
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: 'var(--card-foreground)',
                }}
                formatter={(value) =>
                  new Intl.NumberFormat('th-TH', {
                    style: 'currency',
                    currency: 'THB',
                  }).format(Number(value))
                }
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={3}
                dot={true}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export { RevenueChart }
