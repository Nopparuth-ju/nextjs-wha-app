import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { createProductSchema } from "@/lib/validations/product"
import type { ProductResponse } from "@/types/product"

type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string }

export async function GET() {
  try {
    const products = await prisma.products.findMany({
      include: {
        categories: true,
        product_images: { orderBy: { id: "asc" }, take: 1 },
      },
      orderBy: { id: "asc" },
    })

    const data: ProductResponse[] = products.map((p) => ({
      id: p.id,
      name: p.name ?? "ไม่ระบุ",
      price: Number(p.price ?? 0),
      categoryName: p.categories?.name ?? "ไม่ระบุหมวดหมู่",
      imageName: p.product_images[0]?.image_name ?? null,
    }))

    return NextResponse.json<ApiResponse<ProductResponse[]>>(
      { success: true, data },
      { status: 200 }
    )
  } catch {
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "เกิดข้อผิดพลาด" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = createProductSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "ข้อมูลไม่ถูกต้อง" },
        { status: 400 }
      )
    }

    const product = await prisma.products.create({ data: parsed.data })

    return NextResponse.json<ApiResponse<typeof product>>(
      { success: true, data: product },
      { status: 201 }
    )
  } catch {
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "เกิดข้อผิดพลาด" },
      { status: 500 }
    )
  }
}
