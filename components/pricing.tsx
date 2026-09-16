import { Check, Sparkles } from 'lucide-react'

export function Pricing() {
  return <section id="narxlar" className="border-t border-border bg-secondary/20">
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <div className="mx-auto mb-10 max-w-2xl text-center"><p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Oddiy va shaffof</p><h2 className="text-balance font-serif text-3xl font-semibold tracking-tight sm:text-4xl">Sotuvni boshlash uchun hammasi tayyor</h2><p className="mt-3 leading-relaxed text-muted-foreground">Avval sinab ko‘ring. Sizning mahsulotingiz uchun yaratilgan vositalar bitta joyda.</p></div>
      <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8"><p className="text-sm font-semibold">Bepul boshlang</p><div className="mt-3 flex items-baseline gap-2"><span className="text-4xl font-semibold">0 so‘m</span><span className="text-sm text-muted-foreground">/ hozir</span></div><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Mahsulotlaringiz uchun dastlabki tavsif va kreativlarni tezda tayyorlang.</p><a href="#studio" className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-xl border border-border text-sm font-semibold transition-colors hover:bg-secondary">Studio'ni ochish</a></div>
        <div className="relative rounded-3xl border border-primary/50 bg-primary/[0.07] p-6 shadow-[0_0_60px_color-mix(in_srgb,var(--primary)_10%,transparent)] sm:p-8"><span className="absolute right-5 top-5 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">Tavsiya</span><p className="flex items-center gap-2 text-sm font-semibold"><Sparkles className="size-4 text-primary" /> Sotuvchi paketi</p><div className="mt-3 flex items-baseline gap-2"><span className="text-4xl font-semibold">SkySolve</span><span className="text-sm text-muted-foreground">bilan o‘sish</span></div><ul className="mt-5 flex flex-col gap-3 text-sm text-muted-foreground">{['5 xil opisaniya uslubi', 'Uzum mahsulot preview', 'Professional reklama fotosi', 'Tahrirlash va nusxalash'].map((item) => <li key={item} className="flex items-center gap-2"><Check className="size-4 text-primary" />{item}</li>)}</ul><a href="#studio" className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">Mahsulotni tayyorlash</a></div>
      </div>
    </div>
  </section>
}
