import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import type { RevenuePoint } from "@/types/admin-types"

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const period = searchParams.get('period') ?? '30d'

  const daysMap: Record<string, number> = { '7d': 7, '30d': 30, '90d': 90 }
  const days = daysMap[period] ?? 30

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  startDate.setHours(0, 0, 0, 0)

  const orders = await prisma.orders.findMany({
    where: {
      date: { gte: startDate },
      status: { in: ['delivered', 'received'] },
    },
    select: { date: true, total_amount: true },
    orderBy: { date: 'asc' },
  })

  const map = new Map<string, { revenue: number; orders: number }>()

  for (let i = 0; i < days; i++) {
    const d = new Date(startDate)
    d.setDate(d.getDate() + i)
    const key = d.toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit' })
    map.set(key, { revenue: 0, orders: 0 })
  }

  for (const order of orders) {
    if (!order.date) continue
    const key = order.date.toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit' })
    const entry = map.get(key)
    if (entry) {
      entry.revenue += Number(order.total_amount ?? 0)
      entry.orders += 1
    }
  }

  const result: RevenuePoint[] = Array.from(map.entries()).map(([date, data]) => ({
    date,
    revenue: data.revenue,
    orders: data.orders,
  }))

  return NextResponse.json(result)
}
