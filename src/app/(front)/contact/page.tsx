import { Separator } from "@/components/ui/separator"
import { ContactForm } from "./contact-form"
import { Mail, Phone, Clock } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="container mx-auto py-12 md:py-20">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.6fr] gap-8 md:gap-12">
        {/* Info Column */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-4">ติดต่อเรา</h1>
            <p className="text-muted-foreground">มีข้อสงสัยหรือต้องการสอบถามข้อมูลเพิ่มเติม สามารถติดต่อเราได้ผ่านช่องทางด้านล่างนี้</p>
          </div>
          <Separator />
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-primary" />
              <span className="text-muted-foreground">contact@example.com</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-primary" />
              <span className="text-muted-foreground">02-XXX-XXXX</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-muted-foreground">เปลี่ยนแปลง</span>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div>
          <ContactForm />
        </div>
      </div>
    </div>
  )
}
