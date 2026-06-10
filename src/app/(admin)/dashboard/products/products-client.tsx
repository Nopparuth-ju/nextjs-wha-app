'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { RiAddLine, RiEdit2Line, RiDeleteBinLine } from "@remixicon/react"
import type { AdminProduct, CategoryOption } from "@/types/admin-types"
import type { ProductFormValues } from "@/lib/validations/product"

import { ProductFormModal } from "./product-form-modal"
import { DeleteConfirmDialog } from "./delete-confirm-dialog"

export function ProductsClient() {
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  
  const [inputVal, setInputVal] = useState('')
  const [search, setSearch] = useState('')

  const [formOpen, setFormOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<AdminProduct | null>(null)
  
  const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/categories')
      const json = await res.json()
      if (json.success) setCategories(json.data)
    } catch {
      toast.error('ไม่สามารถโหลดหมวดหมู่ได้')
    }
  }, [])

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/products?search=${encodeURIComponent(search)}&page=${page}`)
      const json = await res.json()
      if (json.success) {
        setProducts(json.data.products)
        setTotal(json.data.total)
      } else {
        toast.error(json.error || 'เกิดข้อผิดพลาด')
      }
    } catch {
      toast.error('ไม่สามารถโหลดสินค้าได้')
    } finally {
      setLoading(false)
    }
  }, [search, page])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(inputVal)
      setPage(1)
    }, 300)
    return () => clearTimeout(t)
  }, [inputVal])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleOpenCreate = () => {
    setEditProduct(null)
    setFormOpen(true)
  }

  const handleOpenEdit = (p: AdminProduct) => {
    setEditProduct(p)
    setFormOpen(true)
  }

  const handleOpenDelete = (p: AdminProduct) => {
    setDeleteTarget(p)
  }

  const handleFormSubmit = async (data: ProductFormValues) => {
    setActionLoading(true)
    try {
      const url = editProduct 
        ? `/api/admin/products/${editProduct.id}`
        : '/api/admin/products'
      
      const method = editProduct ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      const json = await res.json()
      
      if (json.success) {
        toast.success(editProduct ? 'แก้ไขสินค้าสำเร็จ' : 'เพิ่มสินค้าสำเร็จ')
        setFormOpen(false)
        fetchProducts()
      } else {
        toast.error(json.error || 'เกิดข้อผิดพลาด')
      }
    } catch {
      toast.error('การเชื่อมต่อล้มเหลว')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setActionLoading(true)
    try {
      const res = await fetch(`/api/admin/products/${deleteTarget.id}`, {
        method: 'DELETE'
      })
      const json = await res.json()
      if (json.success) {
        toast.success('ลบสินค้าสำเร็จ')
        setDeleteTarget(null)
        fetchProducts()
      } else {
        toast.error(json.error || 'เกิดข้อผิดพลาด')
      }
    } catch {
      toast.error('การเชื่อมต่อล้มเหลว')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">จัดการสินค้า</h1>
        <Button onClick={handleOpenCreate}>
          <RiAddLine className="mr-2 size-4" />
          เพิ่มสินค้าใหม่
        </Button>
      </div>

      <div className="flex items-center">
        <Input 
          placeholder="ค้นหาสินค้า..." 
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border bg-card relative overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>ชื่อสินค้า</TableHead>
              <TableHead>หมวดหมู่</TableHead>
              <TableHead className="text-right">ราคา</TableHead>
              <TableHead className="text-right">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <Spinner className="size-6 mx-auto" />
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  ไม่พบสินค้า
                </TableCell>
              </TableRow>
            ) : (
              products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.id}</TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>{p.categoryName}</TableCell>
                  <TableCell className="text-right">
                    {new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(p.price)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(p)}>
                      <RiEdit2Line className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleOpenDelete(p)}>
                      <RiDeleteBinLine className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {loading && products.length > 0 && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
            <Spinner className="size-8" />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          แสดงรายการทั้งหมด {total} รายการ
        </p>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            disabled={page === 1 || loading}
            onClick={() => setPage(p => p - 1)}
          >
            ก่อนหน้า
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            disabled={page * 10 >= total || loading}
            onClick={() => setPage(p => p + 1)}
          >
            ถัดไป
          </Button>
        </div>
      </div>

      <ProductFormModal 
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editProduct}
        categories={categories}
        onSubmit={handleFormSubmit}
        loading={actionLoading}
      />

      <DeleteConfirmDialog 
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        product={deleteTarget}
        onConfirm={handleDeleteConfirm}
        loading={actionLoading}
      />
    </div>
  )
}
