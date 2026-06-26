import { createSupabaseServer } from '@/lib/supabase/server'
import { HeroSlider } from '@/components/HeroSlider'
import { SearchBar } from '@/components/search/SearchBar'
import { FeaturedProperties } from '@/components/FeaturedProperties'
import { HowItWorks } from '@/components/HowItWorks'
import { PopularDestinations } from '@/components/PopularDestinations'
import { TrustStats } from '@/components/TrustStats'
import { ValueProps } from '@/components/ValueProps'
import { TravelRecommendations } from '@/components/TravelRecommendations'
import { CtaBanner } from '@/components/CtaBanner'
import { Newsletter } from '@/components/Newsletter'
import type { Property } from '@/lib/types'

export default async function HomePage() {
  const supabase = await createSupabaseServer()

  const [{ data: featured }, { data: recommended }] = await Promise.all([
    supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(6),
    supabase
      .from('properties')
      .select('*')
      .eq('is_special_offer', true)
      .order('created_at', { ascending: false })
      .limit(3),
  ])

  return (
    <div className="overflow-hidden">
      {/* Hero + Search */}
      <div className="relative">
        <HeroSlider />
        <div className="container mx-auto px-4 relative z-20 -mt-16">
          <SearchBar />
        </div>
      </div>

      {/* Featured Properties */}
      <div className="container mx-auto px-4">
        <FeaturedProperties properties={(featured ?? []) as Property[]} />
      </div>

      {/* How It Works */}
      <div className="container mx-auto px-4">
        <HowItWorks />
      </div>

      {/* Trust Stats Banner (full-width dark) */}
      <TrustStats />

      {/* Popular Destinations */}
      <div className="container mx-auto px-4">
        <PopularDestinations />
      </div>

      {/* Value Props */}
      <div className="container mx-auto px-4">
        <ValueProps />
      </div>

      {/* Premium / Special Offer Properties */}
      <div className="container mx-auto px-4">
        <TravelRecommendations properties={(recommended ?? []) as Property[]} />
      </div>

      {/* CTA Banner */}
      <div className="container mx-auto px-4">
        <CtaBanner />
      </div>

      {/* Newsletter */}
      <div className="container mx-auto px-4 pb-8">
        <Newsletter />
      </div>
    </div>
  )
}
