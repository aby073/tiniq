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
const WHITE_CATALOG_TERMS = ['100% sof oq', '#ffffff', 'oq fon va biroz soya', 'oq fon', 'white background', 'pure white']

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

    // FLUX Kontext "tasvirlash" emas, "tahrirlash buyrug'i" bilan yaxshi ishlaydi.
    // Foydalanuvchi promptini aniq fon-almashtirish buyrug'iga o'raymiz, shunda
    // model mahsulotni saqlab qolib, fon va sahnani to'liq qayta yaratadi.
    const isWhiteCatalog = WHITE_CATALOG_TERMS.some((term) => prompt.toLowerCase().includes(term))
    const enhancedPrompt = [
      'Professional studio product photograph.',
      'Keep the main product exactly the same — identical shape, color, material, text and label, do not change or distort the product itself.',
      'Completely replace the entire background and surroundings, removing the original floor, table and any clutter.',
      isWhiteCatalog ? 'Place the product on a completely pure white (#FFFFFF) background with no other colors, props, decorations, texture, gradient or text. Keep only a very subtle soft natural gray contact shadow directly beneath the product.' : `Place the product in this new scene: ${prompt.trim()}.`,
      isWhiteCatalog ? 'Uzum Market catalog style: centered product, even neutral lighting, no colored reflections or extra objects, clean white negative space, sharp focus, photorealistic.' : 'High-end commercial advertising photography, realistic soft studio lighting, natural contact shadow under the product, clean composition, sharp focus, photorealistic.',
    ].join(' ')

    const output = await replicate.run(MODEL, {
      input: {
        prompt: enhancedPrompt,
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
