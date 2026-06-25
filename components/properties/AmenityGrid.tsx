import { getAmenityIcon } from './AmenityIconMap'
import { Coffee } from 'lucide-react'

interface AmenityGridProps {
  amenities: string[]
}

export function AmenityGrid({ amenities }: AmenityGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {amenities.map((amenity) => {
        const Icon = getAmenityIcon(amenity) ?? Coffee
        return (
          <div key={amenity} className="flex items-center gap-2 text-sm text-gray-700">
            <Icon className="h-5 w-5 text-primary flex-shrink-0" />
            <span>{amenity}</span>
          </div>
        )
      })}
    </div>
  )
}
