import { Sparkles, Zap, ImageIcon } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
        <div className="flex flex-col items-start gap-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            FLUX AI bilan ishlaydi
          </span>

          <h1 className="text-balance font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Mahsulotingiz uchun studiya sifatidagi fotolar
          </h1>

          <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
            Oddiy telefon rasmini yuklang, nima xohlayotganingizni yozing va bir
            necha soniyada professional reklama fotosini oling. Fotograf, studiya
            yoki qimmat jihozlar shart emas.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#studio"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Rasm yaratishni boshlash
            </a>
            <a
              href="#namunalar"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-background px-6 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              Namunalarni ko&apos;rish
            </a>
          </div>

          <div className="flex flex-wrap gap-6 pt-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" /> Soniyalarda tayyor
            </span>
            <span className="inline-flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-primary" /> Yuqori sifat
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="grid grid-cols-2 gap-4">
            <img
              src="/showcase/perfume.png"
              alt="Atir shishasi studiya fotosi"
              className="aspect-[3/4] w-full rounded-2xl border border-border object-cover shadow-lg"
            />
            <img
              src="/showcase/watch.png"
              alt="Hashamatli soat studiya fotosi"
              className="mt-8 aspect-[3/4] w-full rounded-2xl border border-border object-cover shadow-lg"
            />
            <img
              src="/showcase/sneaker.png"
              alt="Krossovka studiya fotosi"
              className="aspect-[3/4] w-full rounded-2xl border border-border object-cover shadow-lg"
            />
            <img
              src="/showcase/cosmetic.png"
              alt="Kosmetika mahsuloti studiya fotosi"
              className="mt-8 aspect-[3/4] w-full rounded-2xl border border-border object-cover shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
