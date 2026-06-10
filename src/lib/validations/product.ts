import { z } from "zod"

export const createProductSchema = z.object({
  name: z.string().min(1, "กรุณากรอกชื่อสินค้า"),
  price: z.number().positive("ราคาต้องมากกว่า 0"),
  category_id: z.number().int(),
  description: z.string().optional(),
})

export const updateProductSchema = createProductSchema.partial()
