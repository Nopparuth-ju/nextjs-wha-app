import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import type { AdminOrdersResponse, AdminOrderItem } from "@/types/admin-types"

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const limit = Math.min(Number(searchParams.get('limit')) || 5, 50)

  const [rows, total] = await Promise.all([
    prisma.orders.findMany({
      take: limit,
      orderBy: { date: 'desc' },
      include: {
        customers: { select: { name: true } },
        order_items: { select: { quantity: true } },
      },
    }),
    prisma.orders.count(),
  ])

  const orders: AdminOrderItem[] = rows.map((row) => ({
    id: row.id,
    date: row.date?.toLocaleDateString('th-TH') ?? '',
    customerName: row.customers?.name ?? '—',
    status: row.status ?? '',
    total: Number(row.total_amount ?? 0),
    items: row.order_items.reduce((sum, item) => sum + item.quantity, 0),
  }))

  const result: AdminOrdersResponse = { orders, total }

  return NextResponse.json(result)
}
