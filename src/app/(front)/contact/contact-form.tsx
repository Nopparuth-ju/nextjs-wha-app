"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { contactSchema, type ContactFormValues } from "@/lib/validations/contact"
import { CheckCircle } from "lucide-react"

export function ContactForm() {
  const [isPending, startTransition] = useTransition()
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "" },
  })

  function onSubmit(values: ContactFormValues) {
    startTransition(async () => {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(values),
        headers: { "Content-Type": "application/json" },
      })

      if (res.ok) {
        setIsSuccess(true)
        form.reset()
      } else {
        toast.error("ส่งข้อความไม่สำเร็จ กรุณาลองใหม่อีกครั้ง")
      }
    })
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center text-center gap-4 py-8 border rounded-lg">
        <CheckCircle className="w-12 h-12 text-green-500" />
        <h3 className="text-xl font-semibold">ส่งข้อความเรียบร้อยแล้ว</h3>
        <p className="text-muted-foreground">ขอบคุณที่ติดต่อเรา เราจะติดต่อกลับโดยเร็วที่สุด</p>
        <Button onClick={() => setIsSuccess(false)}>ส่งข้อความอีกครั้ง</Button>
      </div>
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Field>
        <FieldLabel htmlFor="name">ชื่อ</FieldLabel>
        <Input id="name" placeholder="กรอกชื่อของคุณ" {...form.register("name")} />
        <FieldError errors={[form.formState.errors.name]} />
      </Field>
      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input id="email" type="email" placeholder="example@email.com" {...form.register("email")} />
        <FieldError errors={[form.formState.errors.email]} />
      </Field>
      <Field>
        <FieldLabel htmlFor="message">ข้อความ</FieldLabel>
        <Textarea id="message" rows={5} placeholder="พิมพ์ข้อความที่ต้องการ..." {...form.register("message")} />
        <FieldError errors={[form.formState.errors.message]} />
      </Field>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "กำลังส่ง..." : "ส่งข้อความ"}
      </Button>
    </form>
  )
}
