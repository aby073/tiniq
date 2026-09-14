import { Wand2, Clock, Layers, ShieldCheck } from 'lucide-react'

const features = [
  {
    icon: Wand2,
    title: 'Aqlli sahna yaratish',
    description:
      'Mahsulotingizni saqlab qolgan holda uni istalgan fon va yorug‘likka joylashtiradi.',
  },
  {
    icon: Clock,
    title: 'Soniyalarda tayyor',
    description:
      'Studiya band qilish shart emas — bir necha soniyada natijani oling.',
  },
  {
    icon: Layers,
    title: 'Cheksiz variantlar',
    description:
      'Turli fon, format va uslublarni sinab, eng mosini tanlang.',
  },
  {
    icon: ShieldCheck,
    title: 'Yuqori sifat',
    description:
      'FLUX modeli reklama va marketpleyslar uchun tayyor toza natija beradi.',
  },
]

export function Features() {
  return (
    <section id="imkoniyatlar" className="scroll-mt-20 border-t border-border bg-secondary/30">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-balance font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
            Nima uchun SkySolve?
          </h2>
          <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
            Onlayn savdo va ijtimoiy tarmoqlar uchun professional fotolar — hamyonbop.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <feature.icon className="h-5 w-5" />
              </span>
              <h3 className="font-medium">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
