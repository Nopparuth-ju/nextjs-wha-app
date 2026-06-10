import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { ProductsClient } from "./products-client"

export default async function ProductsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session?.user?.role !== 'admin') {
    redirect('/')
  }

  return <ProductsClient />
}
