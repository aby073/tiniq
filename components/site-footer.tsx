import { Aperture } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-10 sm:flex-row sm:justify-between sm:px-6">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Aperture className="h-4 w-4" />
          </span>
          <span className="font-serif text-lg font-semibold">SkySolve</span>
        </div>
        <p className="text-sm text-muted-foreground">
          FLUX AI asosida mahsulot fotostudiyasi
        </p>
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} SkySolve
        </p>
      </div>
    </footer>
  )
}
