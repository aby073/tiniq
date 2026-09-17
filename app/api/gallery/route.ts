import { del, list } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

function getUserId(request: NextRequest) {
  const userId = request.headers.get('x-gallery-user-id')
  return userId && /^[a-zA-Z0-9_-]{8,128}$/.test(userId) ? userId : null
}

export async function GET(request: NextRequest) {
  try {
    const userId = getUserId(request)
    if (!userId) return NextResponse.json({ error: 'Foydalanuvchi sessiyasi topilmadi' }, { status: 400 })
    const { blobs } = await list({ prefix: `generations/${userId}/` })
    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000
    const activeBlobs = blobs.filter((blob) => new Date(blob.uploadedAt).getTime() >= cutoff)
    const expiredBlobs = blobs.filter((blob) => new Date(blob.uploadedAt).getTime() < cutoff)
    if (expiredBlobs.length) await del(expiredBlobs.map((blob) => blob.url))

    const items = activeBlobs
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
    const userId = getUserId(request)
    const { url } = (await request.json()) as { url?: string }
    if (!userId || !url) {
      return NextResponse.json({ error: 'Noto‘g‘ri so‘rov' }, { status: 400 })
    }
    const { blobs } = await list({ prefix: `generations/${userId}/` })
    if (!blobs.some((blob) => blob.url === url)) {
      return NextResponse.json({ error: 'Rasm topilmadi' }, { status: 404 })
    }
    await del(url)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] Gallery delete error:', error)
    return NextResponse.json({ error: 'Oʼchirishda xatolik' }, { status: 500 })
  }
}
