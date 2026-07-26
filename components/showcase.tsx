import { ArrowRight } from 'lucide-react'

export function Showcase() {
  return (
    <section id="namunalar" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-balance font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
            Oddiy rasmdan reklama fotosigacha
          </h2>
          <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
            Telefonda olingan oddiy suratni professional studiya fotosiga
            aylantiring.
          </p>
        </div>

        <div className="mx-auto grid max-w-3xl items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
          <figure className="flex flex-col gap-3">
            <img
              src="/showcase/before.png"
              alt="Oldin: oddiy telefon rasmi"
              className="aspect-square w-full rounded-2xl border border-border object-cover"
            />
            <figcaption className="text-center text-sm text-muted-foreground">
              Oldin — oddiy telefon rasmi
            </figcaption>
          </figure>

          <div className="flex justify-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <ArrowRight className="h-5 w-5" />
            </span>
          </div>

          <figure className="flex flex-col gap-3">
            <img
              src="/showcase/after.png"
              alt="Keyin: AI yaratgan studiya fotosi"
              className="aspect-square w-full rounded-2xl border border-border object-cover shadow-lg"
            />
            <figcaption className="text-center text-sm text-muted-foreground">
              Keyin — AI studiya fotosi
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
