'use client'

import { ArrowLeftRight, Sparkles } from 'lucide-react'
import { useState } from 'react'

export function Showcase() {
  const [position, setPosition] = useState(52)
  return <section id="namunalar" className="scroll-mt-20 border-t border-border">
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <div className="mx-auto mb-10 max-w-2xl text-center"><div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"><Sparkles className="size-3.5" /> SkySolve natijasi</div><h2 className="text-balance font-serif text-3xl font-semibold tracking-tight sm:text-4xl">Oddiy rasmdan reklama fotosigacha</h2><p className="mt-3 leading-relaxed text-muted-foreground">Slayderni suring va SkySolve mahsulotni qanday o‘zgartirishini ko‘ring.</p></div>
      <div className="mx-auto max-w-4xl"><div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-border bg-secondary shadow-2xl"><img src="/showcase/after.png" alt="SkySolve yaratgan studiya fotosi" className="absolute inset-0 size-full object-cover" /><div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${position}%` }}><img src="/showcase/before.png" alt="Mahsulotning oddiy telefon rasmi" className="size-full max-w-none object-cover" style={{ width: `${100 / (position / 100)}%` }} /></div><div className="absolute inset-y-0 -translate-x-1/2" style={{ left: `${position}%` }}><div className="h-full w-px bg-white/80 shadow-[0_0_12px_rgba(0,0,0,.5)]" /><span className="absolute left-1/2 top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-background/90 text-foreground shadow-lg"><ArrowLeftRight className="size-4" /></span></div><span className="absolute left-4 top-4 rounded-full bg-background/85 px-3 py-1 text-xs font-semibold backdrop-blur">Oldin</span><span className="absolute right-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">Keyin</span><input aria-label="Oldin va keyin ko‘rinishini solishtirish" type="range" min="12" max="88" value={position} onChange={(event) => setPosition(Number(event.target.value))} className="absolute inset-x-4 bottom-4 w-[calc(100%-2rem)] accent-[var(--primary)]" /></div><p className="mt-4 text-center text-xs text-muted-foreground">Uzum katalogi, ijtimoiy tarmoq yoki reklama uchun tayyor.</p></div>
    </div>
  </section>
}
