import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const todayEnd = new Date()
  todayEnd.setHours(23, 59, 59, 999)

  const [todayOrders, pendingOrders, totalProducts, totalUsers, todayAgg] = await Promise.all([
    prisma.orders.count({
      where: { date: { gte: todayStart, lte: todayEnd } },
    }),
    prisma.orders.count({
      where: { status: 'processing' },
    }),
    prisma.products.count(),
    prisma.user.count(),
    prisma.orders.aggregate({
      _sum: { total_amount: true },
      where: {
        date: { gte: todayStart, lte: todayEnd },
        status: { in: ['delivered', 'received'] },
      },
    }),
  ])

  return NextResponse.json({
    todaySales: Number(todayAgg._sum.total_amount ?? 0),
    todayOrders,
    pendingOrders,
    totalProducts,
    totalUsers,
  })
}
