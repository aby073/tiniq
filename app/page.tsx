import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { Generator } from '@/components/generator'
import { Showcase } from '@/components/showcase'
import { Features } from '@/components/features'
import { Gallery } from '@/components/gallery'
import { SiteFooter } from '@/components/site-footer'

export default function Page() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <Hero />
      <Generator />
      <Showcase />
      <Features />
      <Gallery />
      <SiteFooter />
    </main>
  )
}
