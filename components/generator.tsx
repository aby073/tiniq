'use client'

import { useCallback, useRef, useState } from 'react'
import { useSWRConfig } from 'swr'
import {
  Upload,
  Loader2,
  Sparkles,
  Download,
  X,
  ImageIcon,
  AlertCircle,
  Store,
} from 'lucide-react'

// Uzum Market / Wildberries kabi marketplace uchun toza oq fon uslubi.
// Bu matn FLUX Kontext modeliga mahsulotni saqlab, fonni toza oq studiyaga
// almashtirishni aniq buyuradi.
const UZUM_MARKET_PROMPT =
  "Uzum Market uslubidagi toza mahsulot fotosi: mahsulotni aynan o'zidek saqla, faqat fonni to'liq olib tashlab, sof oq (#ffffff) studiya foniga joylashtir. Mahsulot markazda, tik va to'liq ko'rinishda, ostida juda yengil tabiiy soya, boshqa hech qanday buyum, matn yoki bezak bo'lmasin. Yumshoq bir tekis yorug'lik, real e-commerce katalog uslubi."

const PROMPT_IDEAS = [
  'Marmar poydevor ustida, yumshoq iliq yorug‘lik va nafis soyalar bilan',
  'Yashil barglar va suv tomchilari orasida, tabiiy yorug‘lik',
  'Qora tosh yuzasida dramatik yorug‘lik va oltin aksentlar bilan',
  'Minimalistik oq fonda, yumshoq soya va toza reklama uslubida',
]

const ASPECT_RATIOS = [
  { label: 'Kvadrat', value: '1:1' },
  { label: 'Vertikal', value: '3:4' },
  { label: 'Gorizontal', value: '4:3' },
  { label: 'Original', value: 'match_input_image' },
]

export function Generator() {
  const { mutate } = useSWRConfig()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')
  const [aspectRatio, setAspectRatio] = useState('match_input_image')
  const [isUploading, setIsUploading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFile = useCallback(async (file: File) => {
    setError(null)
    setResultUrl(null)
    if (!file.type.startsWith('image/')) {
      setError('Iltimos, rasm faylini tanlang')
      return
    }
    setPreviewUrl(URL.createObjectURL(file))
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Yuklashda xatolik')
      setUploadedUrl(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Yuklashda xatolik')
      setPreviewUrl(null)
    } finally {
      setIsUploading(false)
    }
  }, [])

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const file = e.dataTransfer.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  const resetImage = () => {
    setPreviewUrl(null)
    setUploadedUrl(null)
    setResultUrl(null)
    setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleGenerate = async () => {
    if (!uploadedUrl) {
      setError('Avval mahsulot rasmini yuklang')
      return
    }
    if (!prompt.trim()) {
      setError('Qanday foto xohlayotganingizni yozing')
      return
    }
    setError(null)
    setIsGenerating(true)
    setResultUrl(null)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, imageUrl: uploadedUrl, aspectRatio }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Rasm yaratishda xatolik')
      setResultUrl(data.url)
      mutate('/api/gallery')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Rasm yaratishda xatolik')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <section id="studio" className="scroll-mt-20 border-t border-border bg-secondary/30">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-balance font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
            Studio
          </h2>
          <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
            Mahsulot rasmini yuklang, kerakli sahnani tasvirlab yozing va AI siz
            uchun professional foto tayyorlaydi.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Kirish paneli */}
          <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6">
            <div>
              <label className="mb-2 block text-sm font-medium">
                1. Mahsulot rasmi
              </label>
              {!previewUrl ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={onDrop}
                  className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-background px-6 py-12 text-center transition-colors hover:border-primary hover:bg-secondary/50"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                    <Upload className="h-5 w-5 text-muted-foreground" />
                  </span>
                  <span className="text-sm font-medium">
                    Rasmni tanlang yoki bu yerga tashlang
                  </span>
                  <span className="text-xs text-muted-foreground">
                    PNG, JPG — 10MB gacha
                  </span>
                </button>
              ) : (
                <div className="relative overflow-hidden rounded-xl border border-border bg-background">
                  <img
                    src={previewUrl || '/placeholder.svg'}
                    alt="Yuklangan mahsulot rasmi"
                    className="h-56 w-full object-contain"
                  />
                  {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/70">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={resetImage}
                    aria-label="Rasmni o'chirish"
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow transition-colors hover:bg-background"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFile(file)
                }}
              />
            </div>

            <div>
              <label htmlFor="prompt" className="mb-2 block text-sm font-medium">
                2. Qanday foto xohlaysiz?
              </label>
              <button
                type="button"
                onClick={() => {
                  setPrompt(UZUM_MARKET_PROMPT)
                  setAspectRatio('3:4')
                }}
                className="mb-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary bg-primary/10 px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-primary/20"
              >
                <Store className="h-4 w-4 text-primary" />
                Uzum market uslubi (toza oq fon)
              </button>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                placeholder="Masalan: marmar poydevor ustida, yumshoq iliq studiya yorug‘ligi bilan"
                className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm leading-relaxed outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/30"
              />
              <div className="mt-3 flex flex-wrap gap-2">
                {PROMPT_IDEAS.map((idea) => (
                  <button
                    key={idea}
                    type="button"
                    onClick={() => setPrompt(idea)}
                    className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                  >
                    {idea.length > 40 ? `${idea.slice(0, 40)}…` : idea}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                3. Format
              </label>
              <div className="flex flex-wrap gap-2">
                {ASPECT_RATIOS.map((ratio) => (
                  <button
                    key={ratio.value}
                    type="button"
                    onClick={() => setAspectRatio(ratio.value)}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                      aspectRatio === ratio.value
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-background text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {ratio.label}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating || isUploading}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Yaratilmoqda…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Foto yaratish
                </>
              )}
            </button>
          </div>

          {/* Natija paneli */}
          <div className="flex flex-col rounded-2xl border border-border bg-card p-6">
            <span className="mb-2 block text-sm font-medium">Natija</span>
            <div className="flex flex-1 items-center justify-center rounded-xl border border-border bg-background p-4">
              {isGenerating ? (
                <div className="flex flex-col items-center gap-3 text-center text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm">
                    AI mahsulotingizni yangi sahnaga joylashtirmoqda…
                  </p>
                </div>
              ) : resultUrl ? (
                <div className="flex w-full flex-col gap-4">
                  <img
                    src={resultUrl || '/placeholder.svg'}
                    alt="AI yaratgan mahsulot fotosi"
                    className="max-h-[420px] w-full rounded-lg object-contain"
                  />
                  <a
                    href={resultUrl}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-secondary"
                  >
                    <Download className="h-4 w-4" />
                    Yuklab olish
                  </a>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 py-12 text-center text-muted-foreground">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                    <ImageIcon className="h-5 w-5" />
                  </span>
                  <p className="text-sm">
                    Yaratilgan foto shu yerda paydo bo&apos;ladi
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
