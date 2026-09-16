import { Check, Sparkles, Users, Zap } from 'lucide-react'

const stats = [
  { value: '10K+', label: 'tayyorlangan foto', icon: Sparkles },
  { value: '3×', label: 'tezroq kontent', icon: Zap },
  { value: '98%', label: 'sotuvchi mamnuniyati', icon: Users },
]

export function TrustStrip() {
  return (
    <section className="border-y border-border/70 bg-card/40">
      <div className="mx-auto grid max-w-6xl gap-px sm:grid-cols-3">
        {stats.map(({ value, label, icon: Icon }) => (
          <div key={label} className="flex items-center gap-3 px-4 py-5 sm:justify-center">
            <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary"><Icon className="size-4" /></span>
            <div><p className="text-lg font-semibold tracking-tight">{value}</p><p className="text-xs text-muted-foreground">{label}</p></div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function SellerPromise() {
  return <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
    {['Ma’lumotlaringiz xavfsiz', 'Uzum uchun mos', 'Tahrirlash mumkin'].map((item) => <span key={item} className="inline-flex items-center gap-1.5"><Check className="size-3.5 text-primary" />{item}</span>)}
  </div>
}
