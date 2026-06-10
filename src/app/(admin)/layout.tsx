import type { Metadata } from "next"
import { Prompt, Roboto, Lora } from "next/font/google"
import { cn } from "@/lib/utils"
import "../globals.css"
import Navbar from "@/components/navbar"
import { Suspense } from "react"
import { Toaster } from "sonner"

const loraHeading = Lora({ subsets: ['latin'], variable: '--font-heading' })
const roboto = Roboto({ subsets: ['latin'], variable: '--font-sans' })
export const promptFont = Prompt({
  weight: ['400', '500', '700'],
  subsets: ['thai'],
  display: 'swap'
})

export const metadata: Metadata = {
  title: "ระบบจัดการหลังบ้าน (Admin)",
  description: "Dashboard และ Product Management",
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="th"
      className={cn(promptFont.className, "font-sans", roboto.variable, loraHeading.variable)}
    >
      <body>
        <Suspense fallback={<div className="h-16 border-b bg-background" />}>
          <Navbar />
        </Suspense>
        
        <main className="container mx-auto p-4 md:p-8">
          {children}
        </main>

        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
