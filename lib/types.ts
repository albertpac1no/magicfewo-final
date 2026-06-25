// Re-export Settings from the settings module
export type { Settings } from './settings'

// ---------------------------------------------------------------------------
// Property
// ---------------------------------------------------------------------------

export interface PropertyImage {
  url: string
  category?: string
  caption?: string
  position?: number
}

export interface Property {
  id: string
  title: string
  description: string
  price_per_night: number
  location: string
  country: string
  city: string
  bedrooms: number
  bathrooms: number
  max_guests: number
  images: string[]
  amenities: string[]
  owner_id: string
  created_at: string
  updated_at: string
  is_special_offer: boolean
  special_offer_price: number | null
  special_offer_end_date: string | null
  review_overall_rating?: number | null
  review_count?: number | null
  source_id?: string | null
  source_url?: string | null
  last_scraped_at?: string | null
}

export interface PropertyFilters {
  location?: string
  country?: string
  city?: string
  minPrice?: number
  maxPrice?: number
  guests?: number
  bedrooms?: number
  bathrooms?: number
  amenities?: string[]
  specialOffersOnly?: boolean
}

// ---------------------------------------------------------------------------
// Booking
// ---------------------------------------------------------------------------

export interface BookingSettings {
  min_stay_days: number
  max_stay_days: number
  service_fee: number
  cleaning_fee: number
  allowed_payment_methods: string[]
  free_cancellation_hours: number
  cancellation_fee_percentage: number
}

export interface Booking {
  id: string
  user_id: string
  property_id: string
  check_in: string
  check_out: string
  guests: number
  total_price: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  payment_method: string | null
  special_requests?: string
  created_at: string
  updated_at: string
  // Joined relations (optional, populated via select queries)
  property?: Property
  profile?: Profile
}

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  address: string | null
  city: string | null
  postal_code: string | null
  country: string | null
  notification_settings: {
    emailNotifications: boolean
    marketingEmails: boolean
  }
  privacy_settings: {
    profileVisible: boolean
    shareActivity: boolean
  }
  role: 'user' | 'admin'
  created_at: string
  updated_at: string
}

// ---------------------------------------------------------------------------
// Bank Account
// ---------------------------------------------------------------------------

export interface BankAccount {
  id: string
  account_holder: string
  iban: string
  bic: string
  bank_name: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// ---------------------------------------------------------------------------
// Scraping
// ---------------------------------------------------------------------------

export interface ScrapeRun {
  id: string
  started_at: string
  completed_at: string | null
  status: 'running' | 'completed' | 'error' | 'stopped'
  config: Record<string, unknown>
  stats: {
    errors: number
    updated: number
    new_added: number
    total_found: number
    images_processed: number
  }
  created_at: string
  updated_at: string
}

export interface ScrapeLog {
  id: string
  run_id: string
  message: string
  level: 'info' | 'warning' | 'error'
  created_at: string
}
