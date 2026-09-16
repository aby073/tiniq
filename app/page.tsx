import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { SellerWorkspace } from '@/components/seller-workspace'
import { Showcase } from '@/components/showcase'
import { Features } from '@/components/features'
import { Gallery } from '@/components/gallery'
import { SiteFooter } from '@/components/site-footer'
import { TrustStrip } from '@/components/trust-strip'
import { Pricing } from '@/components/pricing'

export default function Page() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <Hero />
      <TrustStrip />
      <SellerWorkspace />
      <Showcase />
      <Features />
      <Gallery />
      <Pricing />
      <SiteFooter />
    </main>
  )
}
