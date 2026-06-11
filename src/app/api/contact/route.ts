import { NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validations/contact';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy');

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ success: false, error: 'ข้อมูลไม่ถูกต้อง' }, { status: 400 });
    }

    const { name, email, message } = result.data;

    // Send email logic (Simulated or via Resend as per instructions)
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: process.env.CONTACT_RECEIVER_EMAIL || 'admin@example.com',
      subject: `New contact message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    });

    return NextResponse.json({ success: true, data: 'ส่งข้อความสำเร็จ' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'เกิดข้อผิดพลาดในการส่งข้อความ' }, { status: 500 });
  }
}
