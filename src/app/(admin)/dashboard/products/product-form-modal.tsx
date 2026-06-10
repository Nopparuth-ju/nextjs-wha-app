'use client'

import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { productSchema, type ProductFormValues } from "@/lib/validations/product"
import type { AdminProduct, CategoryOption } from "@/types/admin-types"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"

type ProductFormModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: AdminProduct | null
  categories: CategoryOption[]
  onSubmit: (data: ProductFormValues) => void
  loading: boolean
}

const defaultValues: ProductFormValues = {
  name: "",
  description: "",
  price: 0,
  categoryId: "",
}

export function ProductFormModal({
  open,
  onOpenChange,
  product,
  categories,
  onSubmit,
  loading
}: ProductFormModalProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues
  })

  useEffect(() => {
    if (open) {
      if (product) {
        form.reset({
          name: product.name,
          description: product.description || "",
          price: product.price,
          categoryId: product.categoryId,
        })
      } else {
        form.reset(defaultValues)
      }
    }
  }, [open, product, form])

  const handleSubmit = (data: ProductFormValues) => {
    onSubmit(data)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{product ? "แก้ไขสินค้า" : "เพิ่มสินค้า"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>ชื่อสินค้า</FieldLabel>
                <Input disabled={loading} placeholder="ระบุชื่อสินค้า..." {...field} />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="categoryId"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>หมวดหมู่</FieldLabel>
                <Select
                  disabled={loading}
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกหมวดหมู่" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="price"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>ราคา</FieldLabel>
                <Input 
                  disabled={loading} 
                  type="number" 
                  step="0.01" 
                  placeholder="0.00" 
                  {...field} 
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="description"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>รายละเอียด (ไม่บังคับ)</FieldLabel>
                <Textarea 
                  disabled={loading} 
                  placeholder="เพิ่มรายละเอียด..." 
                  className="resize-none"
                  {...field} 
                  value={field.value || ''}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              ยกเลิก
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Spinner className="mr-2 size-4" /> : null}
              บันทึก
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
