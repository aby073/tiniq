import { put } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'

export const runtime = 'nodejs'
export const maxDuration = 300

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

// FLUX Kontext — mahsulot rasmini prompt asosida yangi sahnaga joylashtiradi (image-to-image)
const MODEL = 'black-forest-labs/flux-kontext-pro'

export async function POST(request: NextRequest) {
  try {
    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json(
        { error: 'REPLICATE_API_TOKEN sozlanmagan' },
        { status: 500 },
      )
    }

    const body = await request.json()
    const { prompt, imageUrl, aspectRatio } = body as {
      prompt?: string
      imageUrl?: string
      aspectRatio?: string
    }

    if (!prompt || !prompt.trim()) {
      return NextResponse.json({ error: 'Prompt (matn) kiritilmadi' }, { status: 400 })
    }

    if (!imageUrl) {
      return NextResponse.json({ error: 'Mahsulot rasmi yuklanmadi' }, { status: 400 })
    }

    const output = await replicate.run(MODEL, {
      input: {
        prompt: prompt.trim(),
        input_image: imageUrl,
        aspect_ratio: aspectRatio || 'match_input_image',
        output_format: 'png',
        safety_tolerance: 2,
      },
    })

    // Replicate natijasini URL ga aylantiramiz (FileOutput yoki massiv bo'lishi mumkin)
    let resultUrl: string | null = null
    const single = Array.isArray(output) ? output[0] : output

    if (single && typeof (single as { url?: () => URL }).url === 'function') {
      resultUrl = (single as { url: () => URL }).url().toString()
    } else if (typeof single === 'string') {
      resultUrl = single
    }

    if (!resultUrl) {
      return NextResponse.json(
        { error: 'Model natija qaytarmadi' },
        { status: 502 },
      )
    }

    // Natijani Blob storage'ga saqlaymiz (galereya uchun doimiy saqlash)
    const imageRes = await fetch(resultUrl)
    if (!imageRes.ok) {
      return NextResponse.json(
        { error: 'Yaratilgan rasmni yuklab olishda xatolik' },
        { status: 502 },
      )
    }
    const arrayBuffer = await imageRes.arrayBuffer()

    const blob = await put(`generations/${Date.now()}.png`, Buffer.from(arrayBuffer), {
      access: 'public',
      contentType: 'image/png',
      addRandomSuffix: true,
    })

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error('[v0] Generate error:', error)
    const message =
      error instanceof Error ? error.message : 'Rasm yaratishda nomaʼlum xatolik'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
