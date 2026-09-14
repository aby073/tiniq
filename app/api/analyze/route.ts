import { type NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'

export const runtime = 'nodejs'
export const maxDuration = 120

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN })
const MODEL = 'google/gemini-2.5-flash'

export async function POST(request: NextRequest) {
  try {
    if (!process.env.REPLICATE_API_TOKEN) return NextResponse.json({ error: 'REPLICATE_API_TOKEN sozlanmagan' }, { status: 500 })
    const { imageUrl } = (await request.json()) as { imageUrl?: string }
    if (!imageUrl) return NextResponse.json({ error: 'Mahsulot rasmi yuklanmadi' }, { status: 400 })

    const prompt = `Siz Uzum Market sotuvchilari uchun mahsulot katalogi mutaxassisisiz. Rasmni diqqat bilan tahlil qiling. Faqat rasmda aniq ko'rinadigan ma'lumotlarga tayaning, taxminiy o'lcham, tarkib yoki sertifikatlarni fakt sifatida yozmang. Javobni FAQAT quyidagi JSON formatida, o'zbek tilida qaytaring: {"productName":"...","category":"...","shortDescription":"...","benefits":["..."],"features":["..."],"audience":"...","uzumTitle":"Uzum qidiruvi uchun 70-120 belgilik sarlavha","description":"Uzum Market uchun 2-3 paragrafli, xaridorga foydali va halol tavsif","keywords":["..."],"confidenceNote":"Rasmda ko'rinmagan ma'lumotlar haqida ehtiyotkor izoh"}. benefits 4-6 ta, features 4-8 ta, keywords 6-10 ta bo'lsin. Marketingni chiroyli qiling, lekin sog'liq va'dalari yoki tasdiqlanmagan xususiyatlarni uydirmang.`
    const output = await replicate.run(MODEL, { input: { prompt, image: imageUrl, temperature: 0.2 } })
    const text = Array.isArray(output) ? output.join('') : String(output)
    const jsonText = text.replace(/```json|```/g, '').trim()
    const analysis = JSON.parse(jsonText)
    return NextResponse.json({ analysis })
  } catch (error) {
    console.error('[v0] Analyze error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Mahsulotni tahlil qilishda xatolik' }, { status: 500 })
  }
}
