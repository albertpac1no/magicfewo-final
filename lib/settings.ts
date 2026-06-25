import { unstable_cache } from 'next/cache'
import { createClient } from '@supabase/supabase-js'

export interface Settings {
  id: number
  platform_name: string
  page_title: string
  primary_color: string
  secondary_color: string
  logo_light_url: string | null
  logo_dark_url: string | null
  favicon_url: string | null
  company_name: string | null
  company_email: string | null
  company_phone: string | null
  company_address: string | null
  company_city: string | null
  company_postal_code: string | null
  company_country: string | null
  company_registration: string | null
  company_tax_id: string | null
  company_vat_id: string | null
  meta_description: string | null
  meta_keywords: string | null
  booking_min_stay_days: number
  booking_max_stay_days: number
  booking_service_fee: number
  booking_cleaning_fee: number
  booking_allowed_payment_methods: string[]
  booking_free_cancellation_hours: number
  booking_cancellation_fee_percentage: number
  created_at: string
  updated_at: string
}

export const defaultSettings: Settings = {
  id: 1,
  platform_name: 'Gesino Reisen',
  page_title: 'Gesino Reisen – Ihr Reisebüro in Frankfurt',
  primary_color: '#FF385C',
  secondary_color: '#0A2463',
  logo_light_url: null,
  logo_dark_url: null,
  favicon_url: null,
  company_name: 'GeSino GmbH',
  company_email: 'info@gesino-reisen.com',
  company_phone: null,
  company_address: 'Mart-Stam-Str. 59',
  company_city: 'Frankfurt am Main',
  company_postal_code: '60438',
  company_country: 'Deutschland',
  company_registration: 'Amtsgericht Frankfurt am Main HRB 119093',
  company_tax_id: 'DE329335447',
  company_vat_id: 'DE329335447',
  meta_description: 'Ihr Reisebüro in Frankfurt – Urlaub, Reisepakete und Ferienwohnungen weltweit buchen',
  meta_keywords: 'Reisebüro Frankfurt, Urlaub buchen, Reisepakete, Ferienwohnung, GeSino',
  booking_min_stay_days: 1,
  booking_max_stay_days: 30,
  booking_service_fee: 29,
  booking_cleaning_fee: 75,
  booking_allowed_payment_methods: ['bank-transfer', 'credit-card', 'paypal'],
  booking_free_cancellation_hours: 48,
  booking_cancellation_fee_percentage: 50,
  created_at: '',
  updated_at: '',
}

export const getSettings = unstable_cache(
  async (): Promise<Settings> => {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .single()

      if (error || !data) {
        console.error('Failed to fetch settings:', error?.message)
        return defaultSettings
      }

      return {
        ...defaultSettings,
        ...data,
        // Map DB column names to our interface (DB uses short names, interface uses booking_ prefix)
        booking_service_fee: data.service_fee ?? defaultSettings.booking_service_fee,
        booking_cleaning_fee: data.cleaning_fee ?? defaultSettings.booking_cleaning_fee,
        booking_min_stay_days: data.min_stay_days ?? defaultSettings.booking_min_stay_days,
        booking_max_stay_days: data.max_stay_days ?? defaultSettings.booking_max_stay_days,
        booking_allowed_payment_methods: data.allowed_payment_methods ?? defaultSettings.booking_allowed_payment_methods,
        booking_free_cancellation_hours: data.free_cancellation_hours ?? defaultSettings.booking_free_cancellation_hours,
        booking_cancellation_fee_percentage: data.cancellation_fee_percentage ?? defaultSettings.booking_cancellation_fee_percentage,
      } as Settings
    } catch (e) {
      console.error('Settings fetch error:', e)
      return defaultSettings
    }
  },
  ['platform-settings'],
  { revalidate: 3600, tags: ['settings'] }
)
