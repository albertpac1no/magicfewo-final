import {
  type LucideIcon,
  Wifi,
  Tv,
  Gamepad2,
  BookOpen,
  Dice1,
  Utensils,
  Snowflake,
  Coffee,
  Microwave,
  Droplets,
  Flame,
  Table,
  Flower2,
  Umbrella,
  Sunset,
  Droplet,
  Waves,
  Trees,
  Baby,
  Palmtree,
  ParkingCircle,
  ParkingSquare,
  Warehouse,
  Car,
  Bike,
  Thermometer,
  Fan,
  Sofa,
  Armchair,
  ShowerHead,
  Bath,
  Brush,
  Trash2,
  Dumbbell,
  Footprints,
  Sailboat,
  Dog,
  Cigarette,
  CigaretteOff,
  AccessibilityIcon,
  School,
  Building2,
  Landmark,
} from 'lucide-react'

export const amenityIconMap: Record<string, LucideIcon> = {
  // Connectivity & Entertainment
  'WLAN': Wifi,
  'WiFi': Wifi,
  'Internet': Wifi,
  'TV': Tv,
  'Fernseher': Tv,
  'Spielkonsole': Gamepad2,
  'Smart TV': Tv,
  'Bücher': BookOpen,
  'Brettspiele': Dice1,

  // Kitchen & Dining
  'Küche': Utensils,
  'Kühlschrank': Snowflake,
  'Restaurant': Coffee,
  'Kaffeemaschine': Coffee,
  'Mikrowelle': Microwave,
  'Geschirrspüler': Droplets,
  'Herd': Flame,
  'Separater Essbereich': Table,
  'Essbereich': Table,
  'Esstisch': Table,

  // Outdoor
  'Garten': Flower2,
  'Terrasse': Umbrella,
  'Terrasse oder Patio': Umbrella,
  'Patio': Umbrella,
  'Balkon': Sunset,
  'Pool': Droplet,
  'Schwimmbad': Droplet,
  'Strand': Waves,
  'Strandnähe': Waves,
  'Strand in der Nähe': Waves,
  'Wald': Trees,
  'Natur': Trees,
  'Grillplatz': Flame,
  'Spielbereich im Freien': Baby,
  'Spielplatz': Baby,
  'Zugang zum Wasserpark': Droplet,
  'Wasserpark': Droplet,
  'Palmen': Palmtree,

  // Parking & Transportation
  'Parkplatz': ParkingCircle,
  'Kostenlose Parkplätze': ParkingCircle,
  'Parkplätze vor Ort': ParkingSquare,
  'Garage': Warehouse,
  'Garagenstellplatz verfügbar': Warehouse,
  'Tiefgarage': Car,
  'Fahrradverleih': Bike,

  // Comfort & Furniture
  'Klimaanlage': Snowflake,
  'Heizung': Thermometer,
  'Ventilator': Fan,
  'Sofa': Sofa,
  'Sessel': Armchair,

  // Bathroom & Cleaning
  'Waschmaschine': Droplets,
  'Trockner': Droplets,
  'Waschmaschine/Trockner': Droplets,
  'Dusche': ShowerHead,
  'Badewanne': Bath,
  'Handtücher': Brush,
  'Reinigung': Brush,
  'Müllabfuhr': Trash2,

  // Sports & Leisure
  'Fitness': Dumbbell,
  'Sauna': Thermometer,
  'Fahrräder': Bike,
  'Wanderwege': Footprints,
  'Bootfahren': Sailboat,
  'Wassersport': Sailboat,

  // Special Features
  'Haustiere erlaubt': Dog,
  'Haustierfreundlich': Dog,
  'Rauchen erlaubt': Cigarette,
  'Nichtraucher': CigaretteOff,
  'Rauchen nicht erlaubt': CigaretteOff,
  'Familienfreundlich': Baby,
  'Barrierefrei': AccessibilityIcon,
  'Rollstuhlgeeignet': AccessibilityIcon,
  'Bildungseinrichtungen in der Nähe': School,
  'Historisches Gebäude': Building2,
  'Denkmalgeschützt': Landmark,
}

export function getAmenityIcon(amenity: string): LucideIcon | null {
  return (
    amenityIconMap[amenity] ??
    Object.entries(amenityIconMap).find(
      ([key]) => amenity.toLowerCase().includes(key.toLowerCase())
    )?.[1] ??
    null
  )
}
