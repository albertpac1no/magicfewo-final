import { createSupabaseServer } from '@/lib/supabase/server'
import { HeroSlider } from '@/components/HeroSlider'
import { SearchBar } from '@/components/search/SearchBar'
import { FeaturedProperties } from '@/components/FeaturedProperties'
import { ValueProps } from '@/components/ValueProps'
import { TravelRecommendations } from '@/components/TravelRecommendations'
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
    <div>
      <div className="relative">
        <HeroSlider />
        <div className="container mx-auto px-4 relative z-20 -mt-16">
          <SearchBar />
        </div>
      </div>

      <div className="container mx-auto px-4">
        <FeaturedProperties properties={(featured ?? []) as Property[]} />
        <ValueProps />
        <TravelRecommendations properties={(recommended ?? []) as Property[]} />
        <Newsletter />
      </div>
    </div>
  )
}
