'use client'

import { useCallback, useRef, useState } from 'react'
import { useSWRConfig } from 'swr'
import { galleryHeaders } from '@/lib/gallery-identity'
import {
  Upload,
  Loader2,
  Sparkles,
  Download,
  X,
  ImageIcon,
  AlertCircle,
  Store,
  ScanSearch,
  Copy,
  Check,
  WandSparkles,
} from 'lucide-react'

const UZUM_MARKET_PROMPT =
  "Uzum Market uslubidagi toza mahsulot fotosi: mahsulotni aynan o'zidek saqla, fonni sof oq studiya foniga almashtir. Mahsulot markazda, yumshoq bir tekis yorug'lik va tabiiy soya bilan, boshqa buyum, matn yoki bezaksiz."
const PROMPT_IDEAS = ['Marmar poydevor va iliq yumshoq yorug‘lik', 'Yashil barglar va suv tomchilari orasida', 'Qora tosh yuzasida dramatik oltin yorug‘lik', 'Minimalistik oq fonda, yumshoq soya bilan']
const ASPECT_RATIOS = [{ label: 'Kvadrat', value: '1:1' }, { label: 'Vertikal', value: '3:4' }, { label: 'Gorizontal', value: '4:3' }, { label: 'Original', value: 'match_input_image' }]

type Analysis = { productName: string; category: string; shortDescription: string; benefits: string[]; features: string[]; audience: string; uzumTitle: string; description: string; keywords: string[]; confidenceNote: string }

export function Generator() {
  const { mutate } = useSWRConfig()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [mode, setMode] = useState<'analyze' | 'create'>('analyze')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')
  const [aspectRatio, setAspectRatio] = useState('match_input_image')
  const [isUploading, setIsUploading] = useState(false)
  const [isBusy, setIsBusy] = useState(false)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleFile = useCallback(async (file: File) => {
    setError(null); setResultUrl(null); setAnalysis(null)
    if (!file.type.startsWith('image/')) { setError('Iltimos, rasm faylini tanlang'); return }
    setPreviewUrl(URL.createObjectURL(file)); setIsUploading(true)
    try {
      const formData = new FormData(); formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData, headers: galleryHeaders() }); const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Yuklashda xatolik'); setUploadedUrl(data.url)
    } catch (err) { setError(err instanceof Error ? err.message : 'Yuklashda xatolik'); setPreviewUrl(null) } finally { setIsUploading(false) }
  }, [])
  const onDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); const file = e.dataTransfer.files?.[0]; if (file) handleFile(file) }, [handleFile])
  const resetImage = () => { setPreviewUrl(null); setUploadedUrl(null); setResultUrl(null); setAnalysis(null); setError(null); if (fileInputRef.current) fileInputRef.current.value = '' }
  const runAction = async () => {
    if (!uploadedUrl) { setError('Avval mahsulot rasmini yuklang'); return }
    setError(null); setIsBusy(true); setResultUrl(null); setAnalysis(null)
    try {
      const endpoint = mode === 'analyze' ? '/api/analyze' : '/api/generate'
      const body = mode === 'analyze' ? { imageUrl: uploadedUrl } : { prompt, imageUrl: uploadedUrl, aspectRatio }
      if (mode === 'create' && !prompt.trim()) { setError('Qanday foto xohlayotganingizni yozing'); setIsBusy(false); return }
      const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', ...galleryHeaders() }, body: JSON.stringify(body) }); const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Amal bajarilmadi')
      if (mode === 'analyze') setAnalysis(data.analysis); else { setResultUrl(data.url); mutate('/api/gallery') }
    } catch (err) { setError(err instanceof Error ? err.message : 'Amal bajarilmadi') } finally { setIsBusy(false) }
  }
  const copyAnalysis = async () => { if (!analysis) return; await navigator.clipboard.writeText(`${analysis.uzumTitle}\n\n${analysis.description}\n\nFoydalari:\n${analysis.benefits.map((x) => `• ${x}`).join('\n')}`); setCopied(true); setTimeout(() => setCopied(false), 1800) }

  return <section id="studio" className="scroll-mt-20 border-t border-border bg-secondary/20"><div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
    <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"><div><div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"><WandSparkles className="h-3.5 w-3.5" /> SkySolve Studio</div><h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Uzum uchun aqlli mahsulot yordamchisi</h2><p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">Rasmni yuklang — SkySolve mahsulotni taniydi, foydalarini topadi va tayyor opisaniya yozadi.</p></div><div className="flex rounded-xl border border-border bg-card p-1"><button onClick={() => setMode('analyze')} className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${mode === 'analyze' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}><ScanSearch className="h-4 w-4" /> Tahlil qilish</button><button onClick={() => setMode('create')} className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${mode === 'create' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}><Sparkles className="h-4 w-4" /> Foto yaratish</button></div></div>
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="flex flex-col gap-5 rounded-3xl border border-border bg-card p-5 sm:p-6"><div className="flex items-center justify-between"><span className="text-sm font-semibold">1. Mahsulot rasmi</span><span className="text-xs text-muted-foreground">PNG, JPG · 10MB</span></div>{!previewUrl ? <button type="button" onClick={() => fileInputRef.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={onDrop} className="group flex min-h-64 w-full flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-border bg-background px-6 text-center transition-colors hover:border-primary hover:bg-primary/5"><span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-105"><Upload className="h-6 w-6" /></span><span className="text-sm font-semibold">Rasmni tanlang yoki shu yerga tashlang</span><span className="text-xs text-muted-foreground">Mahsulotni imkon qadar aniq va yorug‘ joyda suratga oling</span></button> : <div className="relative overflow-hidden rounded-2xl border border-border bg-background"><img src={previewUrl} alt="Yuklangan mahsulot rasmi" className="h-64 w-full object-contain" />{isUploading && <div className="absolute inset-0 flex items-center justify-center bg-background/70"><Loader2 className="size-7 animate-spin text-primary" /></div>}<button type="button" onClick={resetImage} aria-label="Rasmni o‘chirish" className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-background/90 shadow"><X className="h-4 w-4" /></button></div>}<input ref={fileInputRef} type="file" accept="image/*" className="sr-only" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFile(file) }} />
      {mode === 'create' && <div><label htmlFor="prompt" className="mb-2 block text-sm font-semibold">2. Foto uslubi</label><button type="button" onClick={() => { setPrompt(UZUM_MARKET_PROMPT); setAspectRatio('3:4') }} className="mb-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-4 py-3 text-sm font-semibold"><Store className="h-4 w-4 text-primary" /> Uzum Market katalog uslubi</button><textarea id="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={3} placeholder="Masalan: marmar poydevor ustida, iliq studiya yorug‘ligi bilan" className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30" /><div className="mt-3 flex flex-wrap gap-2">{PROMPT_IDEAS.map((idea) => <button key={idea} type="button" onClick={() => setPrompt(idea)} className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground hover:border-primary hover:text-foreground">{idea}</button>)}</div><div className="mt-4 flex flex-wrap gap-2">{ASPECT_RATIOS.map((ratio) => <button key={ratio.value} type="button" onClick={() => setAspectRatio(ratio.value)} className={`rounded-lg border px-3 py-2 text-xs font-medium ${aspectRatio === ratio.value ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground'}`}>{ratio.label}</button>)}</div></div>}
      {error && <div className="flex items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"><AlertCircle className="mt-0.5 size-4 shrink-0" /><span>{error}</span></div>}<button type="button" onClick={runAction} disabled={isBusy || isUploading} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">{isBusy ? <><Loader2 className="size-4 animate-spin" /> {mode === 'analyze' ? 'Mahsulot tahlil qilinmoqda…' : 'Foto yaratilmoqda…'}</> : <>{mode === 'analyze' ? <ScanSearch className="size-4" /> : <Sparkles className="size-4" />} {mode === 'analyze' ? 'Mahsulotni tahlil qilish' : 'Foto yaratish'}</>}</button></div>
      <div className="min-h-[520px] rounded-3xl border border-border bg-card p-5 sm:p-6"><div className="mb-4 flex items-center justify-between"><span className="text-sm font-semibold">2. {mode === 'analyze' ? 'Tayyor opisaniya' : 'Yaratilgan foto'}</span>{analysis && <button onClick={copyAnalysis} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold hover:bg-secondary">{copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />} {copied ? 'Nusxalandi' : 'Barchasini nusxalash'}</button>}</div>{isBusy ? <div className="flex h-[440px] flex-col items-center justify-center gap-4 text-center text-muted-foreground"><span className="flex size-16 items-center justify-center rounded-2xl bg-primary/10"><Loader2 className="size-7 animate-spin text-primary" /></span><p className="max-w-xs text-sm">{mode === 'analyze' ? 'Mahsulot xususiyatlari va foydalarini aniqlayapmiz…' : 'AI mahsulotingizni yangi sahnaga joylashtirmoqda…'}</p></div> : analysis ? <div className="flex flex-col gap-5"><div><p className="text-xs font-semibold uppercase tracking-wider text-primary">Uzum Market sarlavhasi</p><h3 className="mt-1 text-xl font-semibold">{analysis.uzumTitle}</h3><p className="mt-2 text-sm text-muted-foreground">{analysis.category} · {analysis.productName}</p></div><div className="rounded-2xl bg-secondary/60 p-4"><p className="text-sm leading-relaxed">{analysis.description}</p></div><div className="grid gap-4 sm:grid-cols-2"><div><p className="mb-2 text-sm font-semibold">Afzalliklari</p><ul className="flex flex-col gap-2 text-sm text-muted-foreground">{analysis.benefits.map((x) => <li key={x} className="flex gap-2"><span className="text-primary">✦</span>{x}</li>)}</ul></div><div><p className="mb-2 text-sm font-semibold">Ko‘rinadigan xususiyatlar</p><ul className="flex flex-col gap-2 text-sm text-muted-foreground">{analysis.features.map((x) => <li key={x} className="flex gap-2"><span className="text-primary">•</span>{x}</li>)}</ul></div></div><div className="border-t border-border pt-4 text-sm"><span className="font-semibold">Kimlar uchun: </span><span className="text-muted-foreground">{analysis.audience}</span><div className="mt-3 flex flex-wrap gap-2">{analysis.keywords.map((x) => <span key={x} className="rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary">#{x}</span>)}</div></div><p className="text-xs text-muted-foreground">Eslatma: {analysis.confidenceNote}</p></div> : resultUrl ? <div className="flex flex-col gap-4"><img src={resultUrl} alt="AI yaratgan mahsulot fotosi" className="max-h-[440px] w-full rounded-2xl object-contain" /><a href={resultUrl} download target="_blank" rel="noreferrer" className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border px-4 text-sm font-medium hover:bg-secondary"><Download className="size-4" /> Yuklab olish</a></div> : <div className="flex h-[440px] flex-col items-center justify-center gap-3 text-center text-muted-foreground"><span className="flex size-14 items-center justify-center rounded-2xl bg-secondary"><ImageIcon className="size-6" /></span><p className="max-w-xs text-sm">{mode === 'analyze' ? 'Mahsulot rasmi yuklang — tayyor opisaniya shu yerda paydo bo‘ladi.' : 'Yaratilgan foto shu yerda paydo bo‘ladi.'}</p></div>}</div>
    </div></div></section>
}
