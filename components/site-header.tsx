import { Aperture } from 'lucide-react'

const navItems = [
  { label: 'Studio', href: '#studio' },
  { label: 'Namunalar', href: '#namunalar' },
  { label: 'Imkoniyatlar', href: '#imkoniyatlar' },
  { label: 'Galereya', href: '#galereya' },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Aperture className="h-5 w-5" strokeWidth={2} />
          </span>
          <span className="font-serif text-xl font-semibold tracking-tight">
            ManaRasm
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="#studio"
          className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Boshlash
        </a>
      </div>
    </header>
  )
}
