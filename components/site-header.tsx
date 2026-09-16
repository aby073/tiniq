'use client'

import { Aperture, ChevronDown, Menu, X } from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { label: 'Studio', href: '#studio' },
  { label: 'Namunalar', href: '#namunalar' },
  { label: 'Imkoniyatlar', href: '#imkoniyatlar' },
  { label: 'Narxlar', href: '#narxlar' },
]

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  return <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl"><div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6"><a href="#" className="flex items-center gap-2" aria-label="SkySolve bosh sahifa"><span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm"><Aperture className="size-5" strokeWidth={2} /></span><span className="font-serif text-xl font-semibold tracking-tight">SkySolve</span></a><nav className="hidden items-center gap-7 md:flex">{navItems.map((item) => <a key={item.href} href={item.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">{item.label}</a>)}</nav><div className="flex items-center gap-2"><button type="button" className="hidden items-center gap-1 rounded-lg px-2.5 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground sm:inline-flex" aria-label="Tilni tanlash">UZ <ChevronDown className="size-3" /></button><a href="#studio" className="hidden h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 sm:inline-flex">Boshlash</a><button type="button" onClick={() => setMenuOpen(!menuOpen)} className="inline-flex size-9 items-center justify-center rounded-lg border border-border md:hidden" aria-label={menuOpen ? 'Menyuni yopish' : 'Menyuni ochish'}>{menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}</button></div></div>{menuOpen && <nav className="border-t border-border bg-background px-4 py-3 md:hidden">{navItems.map((item) => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground">{item.label}</a>)}<a href="#studio" onClick={() => setMenuOpen(false)} className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">Boshlash</a></nav>}</header>
}
