import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import type { CategoryOption } from "@/types/admin-types"

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const categories = await prisma.categories.findMany({
      orderBy: { name: 'asc' }
    })

    const options: CategoryOption[] = categories.map(c => ({
      id: String(c.id),
      name: c.name || 'Unknown'
    }))

    return NextResponse.json({ success: true, data: options })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch categories' }, { status: 500 })
  }
}
