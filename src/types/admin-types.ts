export type AdminStats = {
  todaySales: number
  todayOrders: number
  pendingOrders: number
  totalProducts: number
  totalUsers: number
}

export type RevenuePoint = {
  date: string
  revenue: number
  orders: number
}

export type AdminOrderItem = {
  id: number
  date: string
  customerName: string
  status: string
  total: number
  items: number
}

export type AdminOrdersResponse = {
  orders: AdminOrderItem[]
  total: number
}

export type Period = '7d' | '30d' | '90d'

export type ApiResponse<T> = { success: true; data: T } | { success: false; error: string }

export type AdminProduct = {
  id: string
  name: string
  description: string | null
  price: number
  categoryId: string
  categoryName: string
}

export type CategoryOption = {
  id: string
  name: string
}
