'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import type { AdminOrderItem } from "@/types/admin-types"

type RecentOrdersTableProps = {
  orders: AdminOrderItem[]
  loading: boolean
  error: string | null
  onRetry: () => void
}

const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' | 'ghost' | 'link' }> = {
  delivered: { label: 'สำเร็จ', variant: 'default' },
  received: { label: 'ได้รับแล้ว', variant: 'secondary' },
  processing: { label: 'กำลังดำเนินการ', variant: 'outline' },
}

function RecentOrdersTable({ orders, loading, error, onRetry }: RecentOrdersTableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner className="size-8" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 py-10">
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button size="sm" variant="outline" onClick={onRetry}>
          ลองอีกครั้ง
        </Button>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-sm text-muted-foreground">ไม่มีคำสั่งซื้อล่าสุด</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>วันที่</TableHead>
          <TableHead>ลูกค้า</TableHead>
          <TableHead>สถานะ</TableHead>
          <TableHead className="text-right">จำนวน</TableHead>
          <TableHead className="text-right">ยอดรวม</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => {
          const statusConfig = statusMap[order.status] ?? { label: order.status, variant: 'outline' as const }
          return (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{order.date}</TableCell>
              <TableCell>{order.customerName}</TableCell>
              <TableCell>
                <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
              </TableCell>
              <TableCell className="text-right">{order.items}</TableCell>
              <TableCell className="text-right font-medium">
                {new Intl.NumberFormat('th-TH', {
                  style: 'currency',
                  currency: 'THB',
                }).format(order.total)}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export { RecentOrdersTable }
