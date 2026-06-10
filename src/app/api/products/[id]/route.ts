import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { updateProductSchema } from "@/lib/validations/product"

type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string }

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const product = await prisma.products.findUnique({
      where: { id: Number(id) },
      include: { categories: true, product_images: true },
    })

    if (!product) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "ไม่พบสินค้า" },
        { status: 404 }
      )
    }

    return NextResponse.json<ApiResponse<typeof product>>({ success: true, data: product }, { status: 200 })
  } catch {
    return NextResponse.json<ApiResponse<never>>({ success: false, error: "เกิดข้อผิดพลาด" }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const parsed = updateProductSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json<ApiResponse<never>>({ success: false, error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 })
    }

    const updated = await prisma.products.update({
      where: { id: Number(id) },
      data: parsed.data,
    })

    return NextResponse.json<ApiResponse<typeof updated>>({ success: true, data: updated }, { status: 200 })
  } catch {
    return NextResponse.json<ApiResponse<never>>({ success: false, error: "เกิดข้อผิดพลาด" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.products.delete({ where: { id: Number(id) } })
    return NextResponse.json<ApiResponse<null>>({ success: true, data: null }, { status: 204 })
  } catch {
    return NextResponse.json<ApiResponse<never>>({ success: false, error: "เกิดข้อผิดพลาด" }, { status: 500 })
  }
}
