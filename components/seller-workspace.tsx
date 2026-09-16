'use client'

import { useCallback, useRef, useState } from 'react'
import { useSWRConfig } from 'swr'
import { UzumPreview } from '@/components/uzum-preview'
import { Starfield } from '@/components/starfield'
import { useLanguage } from '@/components/language-provider'
import {
  Upload,
  Loader2,
  Sparkles,
  X,
  AlertCircle,
  Store,
  ScanSearch,
  Copy,
  Check,
  WandSparkles,
  Eye,
  Settings2,
  FileDown,
} from 'lucide-react'

const UZUM_MARKET_PROMPT = "Uzum Market katalog uslubi: mahsulotni aynan o'zidek saqla, fonni 100% sof oq rangga (#FFFFFF) almashtir. Hech qanday boshqa rang, dekor, buyum, tekstura, gradient yoki matn bo'lmasin. Mahsulot markazda, tekis studiya yorug'ligida, faqat mahsulot tagida juda nozik tabiiy kulrang yumshoq soya bilan. Marketplace katalog rasmi, minimal va professional."
const PROMPT_IDEAS = ['Marmar poydevor va iliq yumshoq yorug\'lik', 'Yashil barglar va suv tomchilari orasida', 'Qora tosh yuzasida dramatik oltin yorug\'lik', 'Minimalistik oq fonda, yumshoq soya bilan']
const ASPECT_RATIOS = [{ label: 'Kvadrat', value: '1:1' }, { label: 'Vertikal', value: '3:4' }, { label: 'Gorizontal', value: '4:3' }, { label: 'Original', value: 'match_input_image' }]

type Analysis = { productName: string; category: string; shortDescription: string; benefits: string[]; features: string[]; audience: string; uzumTitle: string; description: string; keywords: string[]; confidenceNote: string }
type CopyVariant = 'Qisqa' | 'SEO' | 'Sotuvchi' | 'Premium' | 'Uzum uchun'
type HistoryItem = { id: string; timestamp: number; mode: 'analyze' | 'create'; imageUrl: string; previewUrl: string; result: Analysis | string; type: 'analysis' | 'image' }

export function SellerWorkspace() {
  const { mutate } = useSWRConfig()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { t, language } = useLanguage()
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
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [editingAnalysis, setEditingAnalysis] = useState<Analysis | null>(null)
  const [copyVariant, setCopyVariant] = useState<CopyVariant>('Uzum uchun')
  const [showUzumPreview, setShowUzumPreview] = useState(false)

  const saveToHistory = (item: HistoryItem) => {
    setHistory((current) => [item, ...current.slice(0, 19)])
  }

  const handleFile = useCallback(async (file: File) => {
    setError(null); setResultUrl(null); setAnalysis(null); setEditingAnalysis(null)
    if (!file.type.startsWith('image/')) { setError('Iltimos, rasm faylini tanlang'); return }
    setPreviewUrl(URL.createObjectURL(file)); setIsUploading(true)
    try {
      const formData = new FormData(); formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData }); const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Yuklashda xatolik'); setUploadedUrl(data.url)
    } catch (err) { setError(err instanceof Error ? err.message : 'Yuklashda xatolik'); setPreviewUrl(null) } finally { setIsUploading(false) }
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); const file = e.dataTransfer.files?.[0]; if (file) handleFile(file) }, [handleFile])

  const resetImage = () => {
    setPreviewUrl(null); setUploadedUrl(null); setResultUrl(null); setAnalysis(null); setEditingAnalysis(null)
    setError(null); setPrompt(''); setAspectRatio('match_input_image')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const runAction = async () => {
    if (!uploadedUrl) { setError('Avval mahsulot rasmini yuklang'); return }
    setError(null); setIsBusy(true); setResultUrl(null); setAnalysis(null); setEditingAnalysis(null)
    try {
      const endpoint = mode === 'analyze' ? '/api/analyze' : '/api/generate'
      const body = mode === 'analyze' ? { imageUrl: uploadedUrl } : { prompt, imageUrl: uploadedUrl, aspectRatio }
      if (mode === 'create' && !prompt.trim()) { setError('Qanday foto xohlayotganingizni yozing'); setIsBusy(false); return }
      const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Amal bajarilmadi')
      if (mode === 'analyze') {
        setAnalysis(data.analysis); setEditingAnalysis(data.analysis)
        saveToHistory({ id: Date.now().toString(), timestamp: Date.now(), mode: 'analyze', imageUrl: uploadedUrl, previewUrl: previewUrl || '', result: data.analysis, type: 'analysis' })
      } else {
        setResultUrl(data.url)
        saveToHistory({ id: Date.now().toString(), timestamp: Date.now(), mode: 'create', imageUrl: uploadedUrl, previewUrl: previewUrl || '', result: data.url, type: 'image' })
        mutate('/api/gallery')
      }
    } catch (err) { setError(err instanceof Error ? err.message : 'Amal bajarilmadi') } finally { setIsBusy(false) }
  }

  const getVariantText = (item: Analysis, variant: CopyVariant) => {
    const benefitLine = item.benefits.slice(0, 3).map((benefit) => `• ${benefit}`).join('\\n')
    if (variant === 'Qisqa') return `${item.productName} — ${item.shortDescription}`
    if (variant === 'SEO') return `${item.uzumTitle}. ${item.shortDescription} ${item.keywords.slice(0, 5).join(', ')}.`
    if (variant === 'Sotuvchi') return `${item.uzumTitle}\\n\\n${item.description}\\n\\nAfzalliklari:\\n${benefitLine}`
    if (variant === 'Premium') return `${item.productName} — har kuni uchun o‘ylangan tanlov.\\n\\n${item.description}\\n\\nNega tanlashadi?\\n${benefitLine}`
    return `${item.uzumTitle}\\n\\n${item.description}\\n\\nAsosiy foydalari:\\n${benefitLine}\\n\\nKimlar uchun: ${item.audience}`
  }

  const copyAnalysis = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const exportAsText = (analysis: Analysis) => {
    const text = `UZUM MARKET TAVSIFI\n${'='.repeat(50)}\n\nSARLAVHA:\n${analysis.uzumTitle}\n\nTAVSIF:\n${analysis.description}\n\nAFZALLIKLARI:\n${analysis.benefits.map(b => `• ${b}`).join('\n')}\n\nXUSUSIYATLARI:\n${analysis.features.map(f => `• ${f}`).join('\n')}\n\nKAYSI UCHUN:\n${analysis.audience}\n\nKAYSI SÖZ BILAN TOPILADI:\n${analysis.keywords.join(', ')}\n\n${analysis.confidenceNote ? `ESLATMA: ${analysis.confidenceNote}` : ''}`
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `uzum-tavsif-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const deleteHistoryItem = (id: string) => {
    const updated = history.filter(h => h.id !== id)
    setHistory(updated)
  }

  const loadFromHistory = (item: HistoryItem) => {
    setPreviewUrl(item.previewUrl)
    setUploadedUrl(item.imageUrl)
    setMode(item.mode)
    if (item.type === 'analysis') {
      setAnalysis(item.result as Analysis)
      setEditingAnalysis(item.result as Analysis)
    } else {
      setResultUrl(item.result as string)
    }
    setShowHistory(false)
  }

  return <section id="studio" className="relative isolate scroll-mt-20 overflow-hidden border-t border-border bg-secondary/20"><Starfield /><div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
    <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"><div><div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"><WandSparkles className="h-3.5 w-3.5" /> SkySolve Studio</div><h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">{language === 'ru' ? 'Умный помощник по товарам для Uzum' : 'Uzum uchun aqlli mahsulot yordamchisi'}</h2><p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">{language === 'ru' ? 'Загрузите фото — SkySolve распознает товар, найдёт преимущества и подготовит описание. Создайте рекламное фото или сохраните результат.' : 'Rasmni yuklang — SkySolve mahsulotni taniydi, foydalarini topadi va tayyor opisaniya yozadi. Reklama fotosini yarating yoki ishlarini saqlang.'}</p></div><div className="flex gap-2"><button onClick={() => setShowHistory(!showHistory)} className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-secondary"><Settings2 className="h-4 w-4" /> {history.length > 0 ? `Tarixiy (${history.length})` : 'Tarixiy'}</button><div className="flex rounded-xl border border-border bg-card p-1"><button onClick={() => setMode('analyze')} className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${mode === 'analyze' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}><ScanSearch className="h-4 w-4" /> {t('analyze')}</button><button onClick={() => setMode('create')} className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${mode === 'create' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}><Sparkles className="h-4 w-4" /> Foto yaratish</button></div></div></div>

    {showHistory && history.length > 0 && <div className="mb-6 rounded-2xl border border-border bg-card p-4"><p className="mb-3 text-sm font-semibold">Oxirgi 20 ta ishlar</p><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4"><div className="relative overflow-hidden rounded-lg border border-border bg-background p-3 text-center text-xs text-muted-foreground hover:border-primary cursor-pointer transition-colors"><button onClick={() => { setHistory([]); setShowHistory(false) }} className="w-full py-8 text-xs text-destructive">Barchasini o'chirish</button></div>{history.map(item => <div key={item.id} onClick={() => loadFromHistory(item)} className="group relative overflow-hidden rounded-lg border border-border bg-background hover:border-primary cursor-pointer transition-all"><img src={item.previewUrl} alt="Tarixiy" className="h-24 w-full object-cover group-hover:opacity-80" /><div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"><span className="text-xs font-semibold text-white">{item.type === 'analysis' ? 'Tahlil' : 'Foto'}</span><span className="text-xs text-gray-300">{new Date(item.timestamp).toLocaleDateString('uz-UZ', { month: 'short', day: 'numeric' })}</span></div></div>)}</div></div>}

    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="flex flex-col gap-5 rounded-3xl border border-border bg-card p-5 sm:p-6"><div className="flex items-center justify-between"><span className="text-sm font-semibold">1. Mahsulot rasmi</span><span className="text-xs text-muted-foreground">PNG, JPG · 10MB</span></div>{!previewUrl ? <button type="button" onClick={() => fileInputRef.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={onDrop} className="group flex min-h-64 w-full flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-border bg-background px-6 text-center transition-colors hover:border-primary hover:bg-primary/5"><span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-105"><Upload className="h-6 w-6" /></span><span className="text-sm font-semibold">Rasmni tanlang yoki shu yerga tashlang</span><span className="text-xs text-muted-foreground">Mahsulotni imkon qadar aniq va yorug' joyda suratga oling</span></button> : <div className="relative overflow-hidden rounded-2xl border border-border bg-background"><img src={previewUrl} alt="Yuklangan mahsulot rasmi" className="h-64 w-full object-contain" />{isUploading && <div className="absolute inset-0 flex items-center justify-center bg-background/70"><Loader2 className="size-7 animate-spin text-primary" /></div>}<button type="button" onClick={resetImage} aria-label="Rasmni o'chirish" className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-background/90 shadow hover:bg-background"><X className="h-4 w-4" /></button></div>}<input ref={fileInputRef} type="file" accept="image/*" className="sr-only" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFile(file) }} />
      {mode === 'create' && <div><label htmlFor="prompt" className="mb-2 block text-sm font-semibold">2. Foto uslubi</label><button type="button" onClick={() => { setPrompt(UZUM_MARKET_PROMPT); setAspectRatio('3:4') }} className="mb-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-4 py-3 text-sm font-semibold"><Store className="h-4 w-4 text-primary" /> Uzum Market katalog uslubi</button><p className="-mt-1 mb-3 text-xs text-muted-foreground">Oq fon va biroz soya uslubi</p><textarea id="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={3} placeholder="Masalan: marmar poydevor ustida, iliq studiya yorug'ligi bilan" className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30" /><div className="mt-3 flex flex-wrap gap-2">{PROMPT_IDEAS.map((idea) => <button key={idea} type="button" onClick={() => setPrompt(idea)} className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground hover:border-primary hover:text-foreground">{idea}</button>)}</div><div className="mt-4 flex flex-wrap gap-2">{ASPECT_RATIOS.map((ratio) => <button key={ratio.value} type="button" onClick={() => setAspectRatio(ratio.value)} className={`rounded-lg border px-3 py-2 text-xs font-medium ${aspectRatio === ratio.value ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground'}`}>{ratio.label}</button>)}</div></div>}
      {error && <div className="flex items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"><AlertCircle className="mt-0.5 size-4 shrink-0" /><span>{error}</span></div>}<button type="button" onClick={runAction} disabled={isBusy || isUploading} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">{isBusy ? <><Loader2 className="size-4 animate-spin" /> {mode === 'analyze' ? 'Tahlil qilinmoqda…' : 'Foto yaratilmoqda…'}</> : <>{mode === 'analyze' ? <ScanSearch className="size-4" /> : <Sparkles className="size-4" />} {mode === 'analyze' ? t('analyze') : (language === 'ru' ? 'Создать фото' : 'Foto yaratish')}</>}</button></div>

      <div className="min-h-[520px] rounded-3xl border border-border bg-card p-5 sm:p-6"><div className="mb-4 flex items-center justify-between"><span className="text-sm font-semibold">2. {mode === 'analyze' ? 'Tayyor opisaniya' : 'Yaratilgan foto'}</span>{analysis && editingAnalysis && <button type="button" onClick={() => setShowUzumPreview(!showUzumPreview)} className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${showUzumPreview ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:bg-secondary'}`}><Eye className="size-3.5" /> {showUzumPreview ? 'Tahlilni ko‘rish' : 'Uzum preview'}</button>}{analysis && editingAnalysis && <div className="flex gap-2"><button onClick={() => copyAnalysis(`${editingAnalysis.uzumTitle}\n\n${editingAnalysis.description}\n\nFoydalari:\n${editingAnalysis.benefits.map((x) => `• ${x}`).join('\n')}`)} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold hover:bg-secondary">{copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />} {copied ? 'Nusxalandi' : 'Barchasini nusxalash'}</button><button onClick={() => exportAsText(editingAnalysis)} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold hover:bg-secondary"><FileDown className="size-3.5" /> TXT</button></div>}</div>{showUzumPreview && editingAnalysis ? <UzumPreview imageUrl={resultUrl || previewUrl} title={editingAnalysis.uzumTitle} description={editingAnalysis.description} category={editingAnalysis.category} features={editingAnalysis.features} benefits={editingAnalysis.benefits} /> : isBusy ? <div className="flex h-[440px] flex-col items-center justify-center gap-4 text-center text-muted-foreground"><span className="flex size-16 items-center justify-center rounded-2xl bg-primary/10"><Loader2 className="size-7 animate-spin text-primary" /></span><p className="max-w-xs text-sm">{mode === 'analyze' ? 'Mahsulot xususiyatlari va foydalarini aniqlayapmiz…' : 'AI mahsulotingizni yangi sahnaga joylashtirmoqda…'}</p></div> : analysis && editingAnalysis ? <div className="flex flex-col gap-5 overflow-y-auto max-h-[440px] pr-2"><div><div className="mb-3 rounded-xl border border-primary/20 bg-primary/5 p-3"><div className="mb-2 flex items-center justify-between gap-2"><p className="text-xs font-semibold uppercase tracking-wider text-primary">5 xil opisaniya</p><span className="text-[10px] text-muted-foreground">Tanlang va tahrirlang</span></div><div className="flex flex-wrap gap-1.5">{(['Qisqa', 'SEO', 'Sotuvchi', 'Premium', 'Uzum uchun'] as CopyVariant[]).map((variant) => <button key={variant} type="button" onClick={() => { setCopyVariant(variant); setEditingAnalysis({...editingAnalysis, description: getVariantText(editingAnalysis, variant)}) }} className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors ${copyVariant === variant ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background text-muted-foreground hover:border-primary hover:text-foreground'}`}>{variant}</button>)}</div></div><p className="text-xs font-semibold uppercase tracking-wider text-primary">Uzum Market sarlavhasi</p><div className="mt-1 flex items-start gap-2"><input type="text" value={editingAnalysis.uzumTitle} onChange={(e) => setEditingAnalysis({...editingAnalysis, uzumTitle: e.target.value})} className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold outline-none focus:border-primary" /></div></div><div><p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">Kategoriya va nomi</p><p className="text-sm text-muted-foreground">{editingAnalysis.category} · {editingAnalysis.productName}</p></div><div><p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">Tafsili tavsif</p><textarea value={editingAnalysis.description} onChange={(e) => setEditingAnalysis({...editingAnalysis, description: e.target.value})} rows={3} className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" /></div><div className="grid gap-4 sm:grid-cols-2"><div><p className="mb-2 text-sm font-semibold">Afzalliklari</p><div className="flex flex-col gap-2">{editingAnalysis.benefits.map((b, i) => <div key={i} className="flex gap-2"><span className="text-primary text-xs">✦</span><input type="text" value={b} onChange={(e) => { const updated = [...editingAnalysis.benefits]; updated[i] = e.target.value; setEditingAnalysis({...editingAnalysis, benefits: updated}) }} className="flex-1 rounded border border-border bg-background px-2 py-1 text-sm outline-none focus:border-primary" /></div>)}</div></div><div><p className="mb-2 text-sm font-semibold">Ko'rinadigan xususiyatlar</p><div className="flex flex-col gap-2">{editingAnalysis.features.map((f, i) => <div key={i} className="flex gap-2"><span className="text-primary text-xs">•</span><input type="text" value={f} onChange={(e) => { const updated = [...editingAnalysis.features]; updated[i] = e.target.value; setEditingAnalysis({...editingAnalysis, features: updated}) }} className="flex-1 rounded border border-border bg-background px-2 py-1 text-sm outline-none focus:border-primary" /></div>)}</div></div></div><div><p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">Kalit so'zlar</p><input type="text" value={editingAnalysis.keywords.join(', ')} onChange={(e) => setEditingAnalysis({...editingAnalysis, keywords: e.target.value.split(',').map(k => k.trim())})} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" placeholder="so'z1, so'z2, so'z3" /></div>{editingAnalysis.confidenceNote && <div className="rounded-lg border border-border/50 bg-secondary/30 p-3"><p className="text-xs font-semibold text-muted-foreground">Eslatma:</p><p className="mt-1 text-xs text-muted-foreground">{editingAnalysis.confidenceNote}</p></div>}</div> : resultUrl ? <div className="flex h-[440px] items-center justify-center"><img src={resultUrl} alt="Yaratilgan mahsulot fotosi" className="max-h-full max-w-full rounded-lg object-contain" /></div> : <div className="flex h-[440px] flex-col items-center justify-center text-center text-muted-foreground"><Eye className="mb-2 size-8 opacity-50" /><p className="text-sm">Bu yerda natija ko'rinadi</p></div>}</div></div></div></section>
}
