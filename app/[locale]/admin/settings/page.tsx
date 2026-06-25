'use client'

import { useState, useEffect, useTransition } from 'react'
import NextImage from 'next/image'
import {
  Globe, Mail, Phone, MapPin, Building2, Calendar, Upload,
  Image as ImageIcon, Loader2, CheckCircle, Shield,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { createSupabaseClient } from '@/lib/supabase/client'
import { updateSettings } from '@/app/actions/settings'

type Tab = 'company' | 'bookings'

interface CompanySettings {
  platform_name: string
  page_title: string
  company_name: string
  company_email: string
  company_phone: string
  company_address: string
  company_city: string
  company_postal_code: string
  company_country: string
  company_registration: string
  company_tax_id: string
  company_vat_id: string
  primary_color: string
  secondary_color: string
  meta_description: string
  meta_keywords: string
  favicon_url: string
  logo_light_url: string
  logo_dark_url: string
}

interface BookingSettings {
  min_stay_days: number
  max_stay_days: number
  service_fee: number
  cleaning_fee: number
  allowed_payment_methods: string[]
  free_cancellation_hours: number
  cancellation_fee_percentage: number
}

const defaultCompanySettings: CompanySettings = {
  platform_name: 'MagicFewo',
  page_title: 'MagicFewo - Ferienwohnungen & Unterkünfte',
  company_name: 'MagicFewo GmbH',
  company_email: 'info@magicfewo.de',
  company_phone: '+49 123 456789',
  company_address: 'Reisestraße 123',
  company_city: 'Berlin',
  company_postal_code: '10115',
  company_country: 'Deutschland',
  company_registration: 'HRB 123456',
  company_tax_id: 'DE123456789',
  company_vat_id: 'DE987654321',
  primary_color: '#FF385C',
  secondary_color: '#0A2463',
  meta_description: 'Finden Sie Ihre perfekte Ferienunterkunft',
  meta_keywords: 'Ferienwohnung, Unterkunft, Urlaub, Reisen',
  favicon_url: '',
  logo_light_url: '',
  logo_dark_url: '',
}

const defaultBookingSettings: BookingSettings = {
  min_stay_days: 1,
  max_stay_days: 30,
  service_fee: 29,
  cleaning_fee: 75,
  allowed_payment_methods: ['bank-transfer', 'credit-card', 'paypal'],
  free_cancellation_hours: 48,
  cancellation_fee_percentage: 50,
}

export default function AdminSettingsPage() {
  const t = useTranslations('admin')
  const [activeTab, setActiveTab] = useState<Tab>('company')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadingAsset, setUploadingAsset] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [settings, setSettings] = useState<CompanySettings>(defaultCompanySettings)
  const [bookingSettings, setBookingSettings] = useState<BookingSettings>(defaultBookingSettings)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createSupabaseClient()
    supabase
      .from('settings')
      .select('*')
      .single()
      .then(({ data }) => {
        if (data) {
          setSettings((prev) => ({ ...prev, ...data }))
          setBookingSettings({
            min_stay_days: data.min_stay_days ?? defaultBookingSettings.min_stay_days,
            max_stay_days: data.max_stay_days ?? defaultBookingSettings.max_stay_days,
            service_fee: data.service_fee ?? defaultBookingSettings.service_fee,
            cleaning_fee: data.cleaning_fee ?? defaultBookingSettings.cleaning_fee,
            allowed_payment_methods: data.allowed_payment_methods ?? defaultBookingSettings.allowed_payment_methods,
            free_cancellation_hours: data.free_cancellation_hours ?? defaultBookingSettings.free_cancellation_hours,
            cancellation_fee_percentage: data.cancellation_fee_percentage ?? defaultBookingSettings.cancellation_fee_percentage,
          })
        }
        setLoading(false)
      })
  }, [])

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'favicon' | 'logo_light' | 'logo_dark'
  ) => {
    try {
      if (!e.target.files || !e.target.files[0]) return
      const file = e.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${type}_${Math.random().toString(36).slice(2)}.${fileExt}`

      setUploadingAsset(type)
      setError(null)

      const supabase = createSupabaseClient()
      const { error: uploadError } = await supabase.storage.from('branding-assets').upload(fileName, file)
      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage.from('branding-assets').getPublicUrl(fileName)

      const updates: Record<string, string> = {}
      if (type === 'favicon') updates.favicon_url = publicUrl
      if (type === 'logo_light') updates.logo_light_url = publicUrl
      if (type === 'logo_dark') updates.logo_dark_url = publicUrl

      const { error: updateError } = await supabase.from('settings').upsert({ id: 1, ...updates })
      if (updateError) throw updateError

      setSettings((prev) => ({ ...prev, ...updates }))
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Error uploading file:', err)
      setError(t('bankdrops.uploadError'))
    } finally {
      setUploadingAsset(null)
    }
  }

  const handleSave = () => {
    setError(null)
    const formData = new FormData()

    if (activeTab === 'company') {
      Object.entries(settings).forEach(([key, value]) => {
        if (value !== null && value !== undefined) formData.append(key, String(value))
      })
    } else {
      Object.entries(bookingSettings).forEach(([key, value]) => {
        if (key === 'allowed_payment_methods') {
          ;(value as string[]).forEach((m) => formData.append(key, m))
        } else {
          formData.append(key, String(value))
        }
      })
    }

    startTransition(async () => {
      const result = await updateSettings(formData)
      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    )
  }

  const brandingLabels = {
    favicon: { title: t('settings.branding.favicon'), desc: t('settings.branding.faviconDesc') },
    logo_light: { title: t('settings.branding.logoLight'), desc: t('settings.branding.logoLightDesc') },
    logo_dark: { title: t('settings.branding.logoDark'), desc: t('settings.branding.logoDarkDesc') },
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t('settings.title')}</h1>
        <p className="mt-1 text-sm text-gray-600">
          {t('settings.subtitle')}
        </p>
      </div>

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center">
          <CheckCircle className="w-5 h-5 mr-2" />
          {t('settings.savedSuccess')}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('company')}
            className={`py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm ${
              activeTab === 'company'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Building2 className="w-5 h-5 mr-2" />
            {t('settings.tabs.company')}
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm ${
              activeTab === 'bookings'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Calendar className="w-5 h-5 mr-2" />
            {t('settings.tabs.bookings')}
          </button>
        </nav>
      </div>

      {/* Company Settings */}
      {activeTab === 'company' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <Globe className="w-5 h-5 text-primary mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">{t('settings.website.title')}</h2>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.website.platformName')}</label>
                <input type="text" value={settings.platform_name} onChange={(e) => setSettings({ ...settings, platform_name: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.website.pageTitle')}</label>
                <input type="text" value={settings.page_title} onChange={(e) => setSettings({ ...settings, page_title: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.website.primaryColor')}</label>
                  <div className="flex items-center gap-4">
                    <input type="color" value={settings.primary_color} onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })} className="w-12 h-12 p-1 rounded border border-gray-200" />
                    <input type="text" value={settings.primary_color} onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.website.secondaryColor')}</label>
                  <div className="flex items-center gap-4">
                    <input type="color" value={settings.secondary_color} onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })} className="w-12 h-12 p-1 rounded border border-gray-200" />
                    <input type="text" value={settings.secondary_color} onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.website.metaDescription')}</label>
                <textarea value={settings.meta_description} onChange={(e) => setSettings({ ...settings, meta_description: e.target.value })} rows={3} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.website.metaKeywords')}</label>
                <input type="text" value={settings.meta_keywords} onChange={(e) => setSettings({ ...settings, meta_keywords: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder={t('settings.website.metaKeywordsPlaceholder')} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <Building2 className="w-5 h-5 text-primary mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">{t('settings.company.title')}</h2>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.company.name')}</label>
                <input type="text" value={settings.company_name} onChange={(e) => setSettings({ ...settings, company_name: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.company.email')}</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input type="email" value={settings.company_email} onChange={(e) => setSettings({ ...settings, company_email: e.target.value })} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.company.phone')}</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input type="tel" value={settings.company_phone} onChange={(e) => setSettings({ ...settings, company_phone: e.target.value })} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.company.address')}</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input type="text" value={settings.company_address} onChange={(e) => setSettings({ ...settings, company_address: e.target.value })} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.company.postalCode')}</label>
                  <input type="text" value={settings.company_postal_code} onChange={(e) => setSettings({ ...settings, company_postal_code: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.company.city')}</label>
                  <input type="text" value={settings.company_city} onChange={(e) => setSettings({ ...settings, company_city: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.company.country')}</label>
                  <input type="text" value={settings.company_country} onChange={(e) => setSettings({ ...settings, company_country: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.company.registration')}</label>
                  <input type="text" value={settings.company_registration} onChange={(e) => setSettings({ ...settings, company_registration: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.company.taxId')}</label>
                  <input type="text" value={settings.company_tax_id} onChange={(e) => setSettings({ ...settings, company_tax_id: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.company.vatId')}</label>
                  <input type="text" value={settings.company_vat_id} onChange={(e) => setSettings({ ...settings, company_vat_id: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
              </div>
            </div>
          </div>

          {/* Logos & Favicon */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <ImageIcon className="w-5 h-5 text-primary mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">{t('settings.branding.title')}</h2>
            </div>
            <div className="space-y-8">
              {(['favicon', 'logo_light', 'logo_dark'] as const).map((type) => {
                const urlKey = `${type}_url` as keyof CompanySettings
                const currentUrl = settings[urlKey]
                const isUploading = uploadingAsset === type

                return (
                  <div key={type}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{brandingLabels[type].title}</label>
                    <p className="text-sm text-gray-500 mb-3">{brandingLabels[type].desc}</p>
                    <div className="flex items-center gap-4">
                      {currentUrl ? (
                        <NextImage src={currentUrl} alt={brandingLabels[type].title} width={120} height={40} className="w-12 h-12 border border-gray-200 rounded object-contain p-1" />
                      ) : (
                        <div className="w-12 h-12 border border-gray-200 rounded flex items-center justify-center bg-gray-50">
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <label className={`relative px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 cursor-pointer ${isUploading ? 'opacity-75' : ''}`}>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, type)} disabled={isUploading} />
                        <span className="flex items-center">
                          {isUploading ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{t('settings.branding.uploadingFile')}</>
                          ) : (
                            <><Upload className="w-4 h-4 mr-2" />{currentUrl ? t('settings.branding.change') : t('settings.branding.upload')}</>
                          )}
                        </span>
                      </label>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Booking Settings */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <Building2 className="w-5 h-5 text-primary mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">{t('settings.bookingSettings.title')}</h2>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.bookingSettings.minStay')}</label>
                  <div className="flex items-center gap-2">
                    <input type="number" value={bookingSettings.min_stay_days} onChange={(e) => setBookingSettings({ ...bookingSettings, min_stay_days: parseInt(e.target.value) || 1 })} min={1} className="w-32 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                    <span className="text-gray-500">{t('settings.bookingSettings.nights')}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.bookingSettings.maxStay')}</label>
                  <div className="flex items-center gap-2">
                    <input type="number" value={bookingSettings.max_stay_days} onChange={(e) => setBookingSettings({ ...bookingSettings, max_stay_days: parseInt(e.target.value) || 30 })} min={1} className="w-32 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                    <span className="text-gray-500">{t('settings.bookingSettings.nights')}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.bookingSettings.serviceFee')}</label>
                  <div className="flex items-center gap-2">
                    <input type="number" value={bookingSettings.service_fee} onChange={(e) => setBookingSettings({ ...bookingSettings, service_fee: parseFloat(e.target.value) || 0 })} min={0} step={0.01} className="w-32 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                    <span className="text-gray-500">€</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.bookingSettings.cleaningFee')}</label>
                  <div className="flex items-center gap-2">
                    <input type="number" value={bookingSettings.cleaning_fee} onChange={(e) => setBookingSettings({ ...bookingSettings, cleaning_fee: parseFloat(e.target.value) || 0 })} min={0} step={0.01} className="w-32 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                    <span className="text-gray-500">€</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-sm font-medium text-gray-700 mb-4">{t('settings.bookingSettings.paymentMethods')}</h3>
                <div className="space-y-3">
                  {([
                    { key: 'credit-card', labelKey: 'creditCard' },
                    { key: 'bank-transfer', labelKey: 'bankTransfer' },
                    { key: 'paypal', labelKey: 'paypal' },
                  ] as const).map(({ key, labelKey }) => (
                    <label key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={bookingSettings.allowed_payment_methods.includes(key)}
                        onChange={(e) => {
                          const methods = e.target.checked
                            ? [...bookingSettings.allowed_payment_methods, key]
                            : bookingSettings.allowed_payment_methods.filter((m) => m !== key)
                          setBookingSettings({ ...bookingSettings, allowed_payment_methods: methods })
                        }}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="ml-2 text-gray-700">{t(`settings.bookingSettings.${labelKey}`)}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-sm font-medium text-gray-700 mb-4">{t('settings.bookingSettings.cancellationPolicy')}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.bookingSettings.freeCancellationUntil')}</label>
                    <div className="flex items-center gap-2">
                      <input type="number" value={bookingSettings.free_cancellation_hours} onChange={(e) => setBookingSettings({ ...bookingSettings, free_cancellation_hours: parseInt(e.target.value) || 0 })} min={0} className="w-32 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                      <span className="text-gray-500">{t('settings.bookingSettings.hoursBeforeCheckIn')}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.bookingSettings.cancellationFee')}</label>
                    <div className="flex items-center gap-2">
                      <input type="number" value={bookingSettings.cancellation_fee_percentage} onChange={(e) => setBookingSettings({ ...bookingSettings, cancellation_fee_percentage: parseInt(e.target.value) || 0 })} min={0} max={100} className="w-32 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                      <span className="text-gray-500">{t('settings.bookingSettings.percentOfTotal')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
        >
          {isPending ? (
            <span className="flex items-center">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {t('settings.saving')}
            </span>
          ) : (
            t('settings.saveSettings')
          )}
        </button>
      </div>
    </div>
  )
}
