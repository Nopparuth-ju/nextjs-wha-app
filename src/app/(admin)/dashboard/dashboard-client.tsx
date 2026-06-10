'use client'

import { useEffect, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { KpiCard, KpiCardSkeleton } from "@/components/admin/kpi-card"
import { RecentOrdersTable } from "@/components/admin/recent-orders-table"
import { PeriodSelector } from "@/components/admin/period-selector"
import { RiShoppingBagLine, RiMoneyDollarCircleLine, RiTimerLine, RiBox3Line, RiGroupLine } from "@remixicon/react"
import type { AdminStats, AdminOrderItem, RevenuePoint, Period } from "@/types/admin-types"

const RevenueChart = dynamic(
  () => import('@/components/admin/revenue-chart').then((m) => ({ default: m.RevenueChart })),
  { ssr: false, loading: () => (
    <Card>
      <CardHeader><CardTitle>รายได้</CardTitle></CardHeader>
      <CardContent className="flex items-center justify-center py-16">
        <Spinner className="size-8" />
      </CardContent>
    </Card>
  )}
)

function DashboardClient() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [statsError, setStatsError] = useState<string | null>(null)

  const [revenue, setRevenue] = useState<RevenuePoint[]>([])
  const [revenueLoading, setRevenueLoading] = useState(true)

  const [period, setPeriod] = useState<Period>('30d')

  const [orders, setOrders] = useState<AdminOrderItem[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)

  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true)
      setStatsError(null)
      const res = await fetch('/api/admin/stats')
      if (!res.ok) throw new Error('ไม่สามารถโหลดข้อมูลสถิติได้')
      const data: AdminStats = await res.json()
      setStats(data)
    } catch (e) {
      setStatsError(e instanceof Error ? e.message : 'เกิดข้อผิดพลาด')
    } finally {
      setStatsLoading(false)
    }
  }, [])

  const fetchOrders = useCallback(async () => {
    try {
      setOrdersLoading(true)
      const res = await fetch('/api/admin/orders?limit=5')
      if (!res.ok) throw new Error('ไม่สามารถโหลดคำสั่งซื้อล่าสุดได้')
      const data = await res.json()
      setOrders(data.orders)
    } catch {
      // orders error handled in table
    } finally {
      setOrdersLoading(false)
    }
  }, [])

  const fetchRevenue = useCallback(async (p: Period) => {
    try {
      setRevenueLoading(true)
      const res = await fetch(`/api/admin/revenue?period=${p}`)
      if (!res.ok) throw new Error('ไม่สามารถโหลดข้อมูลรายได้ได้')
      const data: RevenuePoint[] = await res.json()
      setRevenue(data)
    } catch {
      // revenue error handled in chart
    } finally {
      setRevenueLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
    fetchOrders()
  }, [fetchStats, fetchOrders])

  useEffect(() => {
    fetchRevenue(period)
  }, [period, fetchRevenue])

  useEffect(() => {
    const interval = setInterval(() => {
      fetchStats()
      fetchOrders()
    }, 30_000)
    return () => clearInterval(interval)
  }, [fetchStats, fetchOrders])

  const fmtCurrency = (value: number) =>
    new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(value)

  const fmtNumber = (value: number) =>
    new Intl.NumberFormat('th-TH').format(value)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">แดชบอร์ด</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statsLoading ? (
          <>
            {Array.from({ length: 5 }).map((_, i) => (
              <KpiCardSkeleton key={i} />
            ))}
          </>
        ) : statsError ? (
          <div className="col-span-full flex flex-col items-center gap-3 py-6">
            <p className="text-sm text-muted-foreground">{statsError}</p>
            <Button size="sm" variant="outline" onClick={fetchStats}>
              ลองอีกครั้ง
            </Button>
          </div>
        ) : stats ? (
          <>
            <KpiCard
              title="ยอดขายวันนี้"
              value={fmtCurrency(stats.todaySales)}
              icon={<RiMoneyDollarCircleLine className="size-4" />}
            />
            <KpiCard
              title="ออเดอร์วันนี้"
              value={fmtNumber(stats.todayOrders)}
              icon={<RiShoppingBagLine className="size-4" />}
            />
            <KpiCard
              title="รอดำเนินการ"
              value={fmtNumber(stats.pendingOrders)}
              icon={<RiTimerLine className="size-4" />}
            />
            <KpiCard
              title="สินค้าทั้งหมด"
              value={fmtNumber(stats.totalProducts)}
              icon={<RiBox3Line className="size-4" />}
            />
            <KpiCard
              title="ผู้ใช้ทั้งหมด"
              value={fmtNumber(stats.totalUsers)}
              icon={<RiGroupLine className="size-4" />}
            />
          </>
        ) : null}
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">รายได้</h2>
        <PeriodSelector value={period} onChange={setPeriod} />
      </div>

      <RevenueChart
        data={revenue}
        loading={revenueLoading}
        error={null}
        onRetry={() => fetchRevenue(period)}
      />

      <div>
        <h2 className="mb-3 text-lg font-semibold">คำสั่งซื้อล่าสุด</h2>
        <Card>
          <RecentOrdersTable
            orders={orders}
            loading={ordersLoading}
            error={null}
            onRetry={fetchOrders}
          />
        </Card>
      </div>
    </div>
  )
}

export { DashboardClient }
