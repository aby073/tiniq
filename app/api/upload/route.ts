import { put } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Rasm fayli yuborilmadi' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Faqat rasm fayllari qabul qilinadi' }, { status: 400 })
    }

    const userId = request.headers.get('x-gallery-user-id')
    if (!userId || !/^[a-zA-Z0-9_-]{8,128}$/.test(userId)) {
      return NextResponse.json({ error: 'Foydalanuvchi sessiyasi topilmadi' }, { status: 400 })
    }

    const blob = await put(`uploads/${userId}/${Date.now()}-${file.name}`, file, {
      access: 'public',
      addRandomSuffix: true,
    })

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error('[v0] Upload error:', error)
    return NextResponse.json({ error: 'Rasmni yuklashda xatolik yuz berdi' }, { status: 500 })
  }
}
