import { del, list } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const { blobs } = await list({ prefix: 'generations/' })

    const items = blobs
      .sort(
        (a, b) =>
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
      )
      .map((blob) => ({
        url: blob.url,
        uploadedAt: blob.uploadedAt,
      }))

    return NextResponse.json({ items })
  } catch (error) {
    console.error('[v0] Gallery list error:', error)
    return NextResponse.json({ error: 'Galereyani yuklashda xatolik' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { url } = (await request.json()) as { url?: string }
    if (!url) {
      return NextResponse.json({ error: 'URL yuborilmadi' }, { status: 400 })
    }
    await del(url)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] Gallery delete error:', error)
    return NextResponse.json({ error: 'Oʼchirishda xatolik' }, { status: 500 })
  }
}
