import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { SellerWorkspace } from '@/components/seller-workspace'
import { Showcase } from '@/components/showcase'
import { Features } from '@/components/features'
import { Gallery } from '@/components/gallery'
import { SiteFooter } from '@/components/site-footer'

export default function Page() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <Hero />
      <SellerWorkspace />
      <Showcase />
      <Features />
      <Gallery />
      <SiteFooter />
    </main>
  )
}
