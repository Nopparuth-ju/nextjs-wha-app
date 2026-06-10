import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { productSchema } from "@/lib/validations/product"
import type { AdminProduct } from "@/types/admin-types"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const productId = parseInt(id, 10)

  try {
    const body = await request.json()
    const result = productSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json({ success: false, error: 'ข้อมูลไม่ถูกต้อง' }, { status: 400 })
    }

    const { name, description, price, categoryId } = result.data

    const product = await prisma.products.update({
      where: { id: productId },
      data: {
        name,
        description,
        price,
        category_id: parseInt(categoryId, 10)
      },
      include: { categories: true }
    })

    const updatedProduct: AdminProduct = {
      id: String(product.id),
      name: product.name || '',
      description: product.description,
      price: Number(product.price || 0),
      categoryId: String(product.category_id),
      categoryName: product.categories?.name || 'Unknown'
    }

    return NextResponse.json({ success: true, data: updatedProduct })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const productId = parseInt(id, 10)

  try {
    const count = await prisma.order_items.count({ where: { product_id: productId } })
    if (count > 0) {
      return NextResponse.json(
        { success: false, error: `ไม่สามารถลบได้ มีคำสั่งซื้อที่ผูกกับสินค้านี้อยู่ ${count} รายการ` }, 
        { status: 409 }
      )
    }

    await prisma.products.delete({
      where: { id: productId }
    })

    return NextResponse.json({ success: true, data: null })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete product' }, { status: 500 })
  }
}
