import { type NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 120

const MODEL = 'claude-opus-5'
const USER_ERROR = 'Tahlil qilishda xatolik yuz berdi, qaytadan urinib ko‘ring.'

type AnthropicResponse = { content?: Array<{ type: string; text?: string }> }

type Analysis = {
  productName: string
  category: string
  shortDescription: string
  features: string[]
  benefits: string[]
  audience: string
  uzumTitle: string
  description: string
  keywords: string[]
  confidenceNote: string
}

function cleanJson(text: string) {
  return text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
}

function normalizeAnalysis(value: unknown): Analysis {
  if (!value || typeof value !== 'object') throw new Error('Invalid analysis')
  const result = value as Record<string, unknown>
  const stringValue = (key: string) => typeof result[key] === 'string' ? result[key] as string : ''
  const arrayValue = (key: string) => Array.isArray(result[key]) ? result[key].filter((item): item is string => typeof item === 'string') : []
  const productName = stringValue('productName') || stringValue('nomi')
  const category = stringValue('category') || stringValue('kategoriya')
  const features = arrayValue('features').length ? arrayValue('features') : arrayValue('xususiyatlar')
  const benefits = arrayValue('benefits').length ? arrayValue('benefits') : arrayValue('foydalari')
  const description = stringValue('description') || stringValue('opisaniya')
  if (!productName || !description) throw new Error('Incomplete analysis')
  return {
    productName,
    category,
    features,
    benefits,
    description,
    shortDescription: description.split(/[.!?]/)[0] || description,
    audience: 'Mahsulotdan foydalanishi mumkin bo‘lgan xaridorlar',
    uzumTitle: productName,
    keywords: [productName, category].filter(Boolean),
    confidenceNote: 'Xususiyatlar faqat rasmda ko‘rinadigan belgilar asosida yozildi.',
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) return NextResponse.json({ error: USER_ERROR }, { status: 500 })
    const body = await request.json() as { imageUrl?: string; imageBase64?: string; mediaType?: string }
    let imageBase64 = body.imageBase64?.replace(/^data:image\/(?:jpeg|jpg|png|webp);base64,/, '')
    let mediaType = body.mediaType || 'image/jpeg'

    if (!imageBase64 && body.imageUrl) {
      const imageResponse = await fetch(body.imageUrl)
      if (!imageResponse.ok) throw new Error('Image download failed')
      const imageBuffer = Buffer.from(await imageResponse.arrayBuffer())
      imageBase64 = imageBuffer.toString('base64')
      mediaType = imageResponse.headers.get('content-type') || mediaType
    }
    if (!imageBase64 || !['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(mediaType)) {
      return NextResponse.json({ error: USER_ERROR }, { status: 400 })
    }

    const prompt = 'Bu mahsulot rasmini tahlil qil. Mahsulot turini, kategoriyasini, ko‘rinadigan xususiyatlarini (rang, material, dizayn) aniqlа. Keyin Uzum Market uchun sotuvni oshiruvchi, professional opisaniya yoz. Faqat rasmda aniq ko‘rinadigan ma’lumotlardan foydalan, tasdiqlanmagan tibbiy yoki texnik va’dalarni uydirma. Javobni FAQAT quyidagi JSON formatida qaytar, hech qanday qo‘shimcha matn yoki izohsiz: {"nomi":"","kategoriya":"","xususiyatlar":[""],"foydalari":[""],"opisaniya":""}'
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({ model: MODEL, max_tokens: 1024, messages: [{ role: 'user', content: [{ type: 'image', source: { type: 'base64', media_type: mediaType, data: imageBase64 } }, { type: 'text', text: prompt }] }] }),
    })
    if (!response.ok) throw new Error(`Anthropic request failed: ${response.status}`)
    const data = await response.json() as AnthropicResponse
    const text = data.content?.find((item) => item.type === 'text')?.text
    if (!text) throw new Error('Empty model response')
    const analysis = normalizeAnalysis(JSON.parse(cleanJson(text)))
    return NextResponse.json({ analysis })
  } catch (error) {
    console.error('[v0] Analyze error:', error)
    return NextResponse.json({ error: USER_ERROR }, { status: 500 })
  }
}
