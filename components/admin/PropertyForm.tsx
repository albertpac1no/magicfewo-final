'use client'

import Image from 'next/image'
import { useState, useRef, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Plus, ImageIcon, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import type { Property } from '@/lib/types'
import {
  createProperty,
  updateProperty,
  uploadPropertyImage,
  rewriteDescription,
} from '@/app/actions/property'

// --- Constants ---
const predefinedCountries = [
  'Deutschland', 'Österreich', 'Schweiz', 'Italien', 'Frankreich', 'Spanien',
  'Niederlande', 'Dänemark', 'Belgien', 'Polen', 'Tschechien', 'Kroatien',
  'Griechenland', 'Portugal',
].sort()

const predefinedCitiesByCountry: Record<string, string[]> = {
  Deutschland: ['Berlin', 'Hamburg', 'München', 'Köln', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Dresden', 'Leipzig', 'Hannover', 'Nürnberg', 'Bremen', 'Sylt', 'Garmisch-Partenkirchen', 'Freiburg', 'Heidelberg'],
  Österreich: ['Wien', 'Salzburg', 'Innsbruck', 'Graz', 'Linz', 'Klagenfurt', 'Bregenz'],
  Schweiz: ['Zürich', 'Genf', 'Basel', 'Bern', 'Lausanne', 'Luzern', 'St. Gallen', 'Zermatt'],
}

const commonAmenities = [
  'WLAN', 'Klimaanlage', 'Heizung', 'Küche', 'Waschmaschine', 'Trockner',
  'Fernseher', 'Parkplatz', 'Pool', 'Balkon', 'Terrasse', 'Garten',
  'Aufzug', 'Haustiere erlaubt', 'Raucher erlaubt', 'Kamin',
  'Geschirrspüler', 'Mikrowelle', 'Kaffeemaschine', 'Bettwäsche',
  'Handtücher', 'Haartrockner', 'Bügeleisen', 'Erste-Hilfe-Set',
]

interface PropertyFormProps {
  mode: 'create' | 'edit'
  property?: Property
}

export function PropertyForm({ mode, property }: PropertyFormProps) {
  const router = useRouter()
  const t = useTranslations('admin')
  const tCommon = useTranslations('common')
  const [isPending, startTransition] = useTransition()

  // --- Validation schema (uses t for messages) ---
  const propertySchema = z.object({
    title: z.string().min(3, t('properties.form.titleMin')),
    description: z.string().min(10, t('properties.form.descriptionMin')),
    location: z.string().min(2, t('properties.form.required')),
    country: z.string().min(2, t('properties.form.required')),
    city: z.string().min(2, t('properties.form.required')),
    price_per_night: z.number().positive(t('properties.form.mustBePositive')),
    bedrooms: z.number().int().min(0),
    bathrooms: z.number().int().min(0),
    max_guests: z.number().int().min(1, t('properties.form.minOne')),
    is_special_offer: z.boolean(),
    special_offer_price: z.number().nullable().optional(),
    special_offer_end_date: z.string().nullable().optional(),
  })

  type PropertyFormValues = z.infer<typeof propertySchema>

  // Images state (string[] of URLs)
  const [images, setImages] = useState<string[]>(property?.images ?? [])
  const [uploadingImage, setUploadingImage] = useState(false)

  // Amenities state
  const [amenities, setAmenities] = useState<string[]>(property?.amenities ?? [])
  const [showAmenityModal, setShowAmenityModal] = useState(false)
  const [newAmenity, setNewAmenity] = useState('')
  const amenityInputRef = useRef<HTMLInputElement>(null)

  // AI rewrite
  const [aiProcessing, setAiProcessing] = useState(false)

  // Country/city dropdowns
  const [countrySearch, setCountrySearch] = useState('')
  const [citySearch, setCitySearch] = useState('')
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const [showCityDropdown, setShowCityDropdown] = useState(false)

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: property?.title ?? '',
      description: property?.description ?? '',
      location: property?.location ?? '',
      country: property?.country ?? 'Deutschland',
      city: property?.city ?? '',
      price_per_night: property?.price_per_night ?? 0,
      bedrooms: property?.bedrooms ?? 1,
      bathrooms: property?.bathrooms ?? 1,
      max_guests: property?.max_guests ?? 1,
      is_special_offer: property?.is_special_offer ?? false,
      special_offer_price: property?.special_offer_price ?? null,
      special_offer_end_date: property?.special_offer_end_date ?? null,
    },
  })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = form

  const watchCountry = watch('country')
  const watchIsSpecialOffer = watch('is_special_offer')
  const watchDescription = watch('description')

  const filteredCountries = predefinedCountries.filter((c) =>
    c.toLowerCase().includes(countrySearch.toLowerCase()),
  )

  const filteredCities = watchCountry && predefinedCitiesByCountry[watchCountry]
    ? predefinedCitiesByCountry[watchCountry].filter((c) =>
        c.toLowerCase().includes(citySearch.toLowerCase()),
      )
    : []

  // --- Handlers ---
  const handleCountrySelect = (country: string) => {
    setValue('country', country)
    setValue('city', '')
    setCountrySearch('')
    setShowCountryDropdown(false)
  }

  const handleCitySelect = (city: string) => {
    setValue('city', city)
    setValue('location', `${city}, ${watchCountry}`)
    setCitySearch('')
    setShowCityDropdown(false)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    setUploadingImage(true)
    const files = Array.from(e.target.files)

    for (const file of files) {
      const fd = new FormData()
      fd.append('file', file)
      const result = await uploadPropertyImage(fd)
      if (result.url) {
        setImages((prev) => [...prev, result.url!])
      } else if (result.error) {
        toast.error(t('properties.form.uploadFailed', { error: result.error }))
      }
    }

    setUploadingImage(false)
    e.target.value = ''
  }

  const handleImageRemove = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const moveImage = (from: number, to: number) => {
    setImages((prev) => {
      const arr = [...prev]
      const [item] = arr.splice(from, 1)
      arr.splice(to, 0, item)
      return arr
    })
  }

  const handleAmenityToggle = (amenity: string) => {
    setAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity],
    )
  }

  const handleAmenityAdd = () => {
    setShowAmenityModal(true)
    setTimeout(() => amenityInputRef.current?.focus(), 100)
  }

  const handleAmenitySubmit = () => {
    const trimmed = newAmenity.trim()
    if (trimmed && !amenities.includes(trimmed)) {
      setAmenities((prev) => [...prev, trimmed])
    }
    setNewAmenity('')
    setShowAmenityModal(false)
  }

  const handleAiRewrite = async () => {
    if (!watchDescription) {
      toast.error(t('properties.form.aiNoDescription'))
      return
    }
    setAiProcessing(true)
    const result = await rewriteDescription(watchDescription)
    if (result.description) {
      setValue('description', result.description)
      toast.success(t('properties.form.aiSuccess'))
    } else if (result.error) {
      toast.error(result.error)
    }
    setAiProcessing(false)
  }

  const onSubmit = async (values: PropertyFormValues) => {
    // Build location from city + country
    const location = values.city && values.country ? `${values.city}, ${values.country}` : values.location

    const formData = new FormData()
    formData.set('title', values.title)
    formData.set('description', values.description)
    formData.set('location', location)
    formData.set('country', values.country)
    formData.set('city', values.city)
    formData.set('price_per_night', String(values.price_per_night))
    formData.set('bedrooms', String(values.bedrooms))
    formData.set('bathrooms', String(values.bathrooms))
    formData.set('max_guests', String(values.max_guests))
    formData.set('amenities', JSON.stringify(amenities))
    formData.set('images', JSON.stringify(images))
    formData.set('is_special_offer', String(values.is_special_offer))
    formData.set('special_offer_price', values.special_offer_price != null ? String(values.special_offer_price) : '')
    formData.set('special_offer_end_date', values.special_offer_end_date ?? '')

    let result: { success?: boolean; error?: string }

    if (mode === 'edit' && property) {
      result = await updateProperty(property.id, formData)
    } else {
      result = await createProperty(formData)
    }

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(mode === 'create' ? t('properties.form.createSuccess') : t('properties.form.updateSuccess'))
      startTransition(() => {
        router.push('/admin/properties')
        router.refresh()
      })
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">{t('properties.form.basicInfo')}</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('properties.form.title')} *</label>
            <input
              {...register('title')}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">{t('properties.form.description')} *</label>
              <button
                type="button"
                onClick={handleAiRewrite}
                disabled={aiProcessing || !watchDescription}
                className="text-sm bg-secondary hover:bg-secondary/90 text-white px-3 py-1 rounded-md transition-colors flex items-center gap-1 disabled:opacity-50"
              >
                {aiProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t('properties.form.aiProcessing')}
                  </>
                ) : (
                  t('properties.form.aiRewrite')
                )}
              </button>
            </div>
            <textarea
              {...register('description')}
              rows={6}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>}
          </div>
        </section>

        {/* Location */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">{t('properties.form.locationSection')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Country */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('properties.form.country')} *</label>
              <input
                type="text"
                value={countrySearch}
                onChange={(e) => { setCountrySearch(e.target.value); setShowCountryDropdown(true) }}
                onFocus={() => setShowCountryDropdown(true)}
                onBlur={() => setTimeout(() => setShowCountryDropdown(false), 200)}
                placeholder={watchCountry || t('properties.form.countryPlaceholder')}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <input type="hidden" {...register('country')} />
              {showCountryDropdown && (
                <div className="absolute z-20 mt-1 w-full bg-white shadow-lg rounded-lg max-h-60 overflow-auto border">
                  {filteredCountries.length > 0 ? filteredCountries.map((c) => (
                    <div key={c} className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm" onMouseDown={() => handleCountrySelect(c)}>
                      {c}
                    </div>
                  )) : (
                    <div className="px-4 py-2 text-gray-500 text-sm">{t('properties.form.noResults')}</div>
                  )}
                </div>
              )}
              {errors.country && <p className="text-sm text-red-600 mt-1">{errors.country.message}</p>}
            </div>

            {/* City */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('properties.form.city')} *</label>
              <input
                type="text"
                value={citySearch}
                onChange={(e) => { setCitySearch(e.target.value); setShowCityDropdown(true) }}
                onFocus={() => setShowCityDropdown(true)}
                onBlur={() => setTimeout(() => setShowCityDropdown(false), 200)}
                placeholder={watch('city') || t('properties.form.cityPlaceholder')}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                disabled={!watchCountry}
              />
              <input type="hidden" {...register('city')} />
              {showCityDropdown && watchCountry && (
                <div className="absolute z-20 mt-1 w-full bg-white shadow-lg rounded-lg max-h-60 overflow-auto border">
                  {filteredCities.length > 0 ? filteredCities.map((c) => (
                    <div key={c} className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm" onMouseDown={() => handleCitySelect(c)}>
                      {c}
                    </div>
                  )) : (
                    <div className="px-4 py-2 text-gray-500 text-sm">{t('properties.form.noCityResults')}</div>
                  )}
                </div>
              )}
              {errors.city && <p className="text-sm text-red-600 mt-1">{errors.city.message}</p>}
            </div>
          </div>

          <input type="hidden" {...register('location')} />
        </section>

        {/* Details */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">{t('properties.form.detailsSection')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('properties.form.pricePerNight')} *</label>
              <input type="number" step="0.01" min="0" {...register('price_per_night', { valueAsNumber: true })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              {errors.price_per_night && <p className="text-sm text-red-600 mt-1">{errors.price_per_night.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('properties.form.bedrooms')}</label>
              <input type="number" min="0" {...register('bedrooms', { valueAsNumber: true })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('properties.form.bathrooms')}</label>
              <input type="number" min="0" {...register('bathrooms', { valueAsNumber: true })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('properties.form.maxGuests')} *</label>
              <input type="number" min="1" {...register('max_guests', { valueAsNumber: true })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              {errors.max_guests && <p className="text-sm text-red-600 mt-1">{errors.max_guests.message}</p>}
            </div>
          </div>
        </section>

        {/* Images */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">{t('properties.form.imagesSection')}</h2>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 cursor-pointer transition-opacity">
              <ImageIcon className="w-5 h-5" />
              <span>{t('properties.form.uploadImages')}</span>
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" disabled={uploadingImage} />
            </label>
            {uploadingImage && (
              <div className="flex items-center gap-2 text-primary text-sm">
                <Loader2 className="w-5 h-5 animate-spin" />
                {t('properties.form.uploading')}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((url, index) => (
              <div key={index} className="relative group rounded-lg overflow-hidden">
                <Image src={url} alt={`${t('properties.form.imagesSection')} ${index + 1}`} width={96} height={96} className="w-full h-32 object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button type="button" onClick={() => handleImageRemove(index)} className="bg-white p-1 rounded-full shadow hover:bg-gray-100">
                    <X className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-2 py-1 flex justify-between">
                  <span className="font-bold">{index + 1}</span>
                  <div className="flex gap-1">
                    {index > 0 && (
                      <button type="button" onClick={() => moveImage(index, index - 1)} className="hover:text-primary">↑</button>
                    )}
                    {index < images.length - 1 && (
                      <button type="button" onClick={() => moveImage(index, index + 1)} className="hover:text-primary">↓</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {images.length === 0 && (
              <div className="col-span-full p-8 text-center text-gray-500 border border-dashed border-gray-200 rounded-lg">
                {t('properties.form.noImages')}
              </div>
            )}
          </div>
          {images.length > 0 && (
            <p className="text-sm text-gray-500">{t('properties.form.imageHint')}</p>
          )}
        </section>

        {/* Amenities */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">{t('properties.form.amenitiesSection')}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {commonAmenities.map((amenity) => (
              <label key={amenity} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={amenities.includes(amenity)}
                  onChange={() => handleAmenityToggle(amenity)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm">{amenity}</span>
              </label>
            ))}
          </div>

          {/* Custom amenities */}
          <div className="flex flex-wrap gap-2">
            {amenities.filter((a) => !commonAmenities.includes(a)).map((amenity, i) => (
              <span key={i} className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm">
                {amenity}
                <button type="button" onClick={() => setAmenities((prev) => prev.filter((a) => a !== amenity))} className="ml-2 text-gray-400 hover:text-gray-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
            <button type="button" onClick={handleAmenityAdd} className="flex items-center px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-sm">
              <Plus className="w-4 h-4 mr-1" />
              {t('properties.form.addCustomAmenity')}
            </button>
          </div>
        </section>

        {/* Special Offer */}
        <section className="space-y-4">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <input type="checkbox" {...register('is_special_offer')} className="rounded border-gray-300 text-primary focus:ring-primary" />
            {t('properties.form.specialOffer')}
          </label>

          {watchIsSpecialOffer && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('properties.form.specialOfferPrice')}</label>
                <input type="number" step="0.01" min="0" {...register('special_offer_price', { valueAsNumber: true })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('properties.form.specialOfferEndDate')}</label>
                <input type="date" {...register('special_offer_end_date')} min={new Date().toISOString().split('T')[0]} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>
            </div>
          )}
        </section>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {tCommon('actions.cancel')}
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {mode === 'create' ? t('properties.form.create') : t('properties.form.save')}
          </button>
        </div>
      </form>

      {/* Amenity Add Modal */}
      {showAmenityModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70]">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-gray-900">{t('properties.form.addAmenityTitle')}</h3>
              <button type="button" onClick={() => setShowAmenityModal(false)} className="text-gray-400 hover:text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <input
              ref={amenityInputRef}
              type="text"
              value={newAmenity}
              onChange={(e) => setNewAmenity(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAmenitySubmit() } }}
              placeholder={t('properties.form.amenityPlaceholder')}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary mb-4"
            />
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => setShowAmenityModal(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                {tCommon('actions.cancel')}
              </button>
              <button type="button" onClick={handleAmenitySubmit} disabled={!newAmenity.trim()} className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                {tCommon('actions.add')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
