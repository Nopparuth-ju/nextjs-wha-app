import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { productSchema } from "@/lib/validations/product"
import type { AdminProduct } from "@/types/admin-types"

const ITEMS_PER_PAGE = 10

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') || ''
  const page = parseInt(searchParams.get('page') || '1', 10)
  
  try {
    const whereClause = search ? {
      name: { contains: search }
    } : {}

    const [total, products] = await Promise.all([
      prisma.products.count({ where: whereClause }),
      prisma.products.findMany({
        where: whereClause,
        include: { categories: true },
        orderBy: { id: 'desc' },
        skip: (page - 1) * ITEMS_PER_PAGE,
        take: ITEMS_PER_PAGE
      })
    ])

    const formattedProducts: AdminProduct[] = products.map(p => ({
      id: String(p.id),
      name: p.name || '',
      description: p.description,
      price: Number(p.price || 0),
      categoryId: String(p.category_id),
      categoryName: p.categories?.name || 'Unknown'
    }))

    return NextResponse.json({ 
      success: true, 
      data: { products: formattedProducts, total } 
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const result = productSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json({ success: false, error: 'ข้อมูลไม่ถูกต้อง' }, { status: 400 })
    }

    const { name, description, price, categoryId } = result.data

    const product = await prisma.products.create({
      data: {
        name,
        description,
        price,
        category_id: parseInt(categoryId, 10)
      },
      include: { categories: true }
    })

    const newProduct: AdminProduct = {
      id: String(product.id),
      name: product.name || '',
      description: product.description,
      price: Number(product.price || 0),
      categoryId: String(product.category_id),
      categoryName: product.categories?.name || 'Unknown'
    }

    return NextResponse.json({ success: true, data: newProduct })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 })
  }
}
