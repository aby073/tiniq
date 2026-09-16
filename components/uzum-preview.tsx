"use client"

import { Check, Copy, Pencil, ShoppingBag, Star } from "lucide-react"
import { useState } from "react"

type ProductCardProps = {
  imageUrl: string | null
  title: string
  description: string
  category: string
  features: string[]
  benefits: string[]
  onCopy?: () => void
}

export function UzumPreview({ imageUrl, title, description, category, features, benefits, onCopy }: ProductCardProps) {
  const [price, setPrice] = useState("249 000")
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    await navigator.clipboard.writeText(`${title}\n${description}\n${features.join(", ")}`)
    setCopied(true)
    onCopy?.()
    window.setTimeout(() => setCopied(false), 1600)
  }

  return <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-[0_20px_70px_-30px_rgba(0,0,0,0.55)]">
    <div className="flex items-center justify-between border-b border-border px-4 py-3"><div className="flex items-center gap-2 text-sm font-semibold"><span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary"><ShoppingBag className="size-4" /></span>Uzum preview</div><span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary">Ko‘rish rejimi</span></div>
    <div className="grid gap-4 p-4 sm:grid-cols-[0.9fr_1.1fr]">
      <div className="flex min-h-56 items-center justify-center overflow-hidden rounded-xl bg-white p-3"><>{imageUrl ? <img src={imageUrl} alt={title} className="max-h-64 w-full object-contain" /> : <div className="text-center text-xs text-slate-400">Mahsulot rasmi shu yerda ko‘rinadi</div>}</></div>
      <div className="flex flex-col gap-3"><p className="text-[11px] font-medium text-muted-foreground">{category || "Mahsulot"}</p><h3 className="text-lg font-semibold leading-tight">{title || "Mahsulot nomi"}</h3><div className="flex items-center gap-1 text-amber-500"><Star className="size-3.5 fill-current" /><Star className="size-3.5 fill-current" /><Star className="size-3.5 fill-current" /><Star className="size-3.5 fill-current" /><Star className="size-3.5" /><span className="ml-1 text-xs text-muted-foreground">Yangi mahsulot</span></div><div className="flex items-center gap-2"><input aria-label="Mahsulot narxi" value={price} onChange={(e) => setPrice(e.target.value)} className="w-32 rounded-lg border border-border bg-card px-3 py-2 text-lg font-bold outline-none focus:border-primary" /><span className="text-sm font-semibold">so‘m</span></div><p className="line-clamp-4 text-sm leading-relaxed text-muted-foreground">{description || "Mahsulot tavsifi shu yerda ko‘rinadi."}</p><div className="flex flex-wrap gap-1.5">{features.slice(0, 4).map((feature) => <span key={feature} className="rounded-full border border-border px-2 py-1 text-[10px] text-muted-foreground">{feature}</span>)}</div><div className="mt-auto flex items-center gap-2"><button type="button" onClick={copy} className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">{copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}{copied ? "Nusxalandi" : "Opisaniyani nusxalash"}</button><button type="button" className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold"><Pencil className="size-3.5" />Tahrirlash</button></div></div>
    </div>
    {benefits.length > 0 && <div className="border-t border-border px-4 py-3"><p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-primary">Asosiy foydalari</p><div className="grid gap-2 sm:grid-cols-3">{benefits.slice(0, 3).map((benefit) => <div key={benefit} className="rounded-lg bg-card px-3 py-2 text-xs text-muted-foreground">{benefit}</div>)}</div></div>}
  </div>
}

export function EmptyUzumPreview() { return <UzumPreview imageUrl={null} title="Mahsulot nomi" description="AI tahlilidan keyin Uzum Market kartasi shu yerda ko‘rinadi." category="Mahsulot kategoriyasi" features={[]} benefits={[]} /> }
