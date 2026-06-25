'use client'

import { useRef, useState, useTransition } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { User, Mail, Phone, MapPin, Loader2, Camera } from 'lucide-react'
import { updateProfile, uploadAvatar } from '@/app/actions/profile'
import { toast } from 'sonner'
import type { Profile } from '@/lib/types'

interface ProfileFormProps {
  profile: Profile | null
  email: string
}

interface FormValues {
  full_name: string
  phone: string
  address: string
  city: string
  postal_code: string
  country: string
}

export function ProfileForm({ profile, email }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition()
  const [isUploading, setIsUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const t = useTranslations('dashboard')

  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      full_name:   profile?.full_name   ?? '',
      phone:       profile?.phone       ?? '',
      address:     profile?.address     ?? '',
      city:        profile?.city        ?? '',
      postal_code: profile?.postal_code ?? '',
      country:     profile?.country     ?? '',
    },
  })

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : (email?.[0] ?? 'U').toUpperCase()

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Preview immediately
    const objectUrl = URL.createObjectURL(file)
    setAvatarUrl(objectUrl)

    setIsUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const result = await uploadAvatar(fd)
    setIsUploading(false)

    if (result.error) {
      toast.error(result.error)
      setAvatarUrl(profile?.avatar_url ?? null)
    } else {
      toast.success(t('avatarUploaded'))
      if (result.url) setAvatarUrl(result.url)
    }
    // Reset input so same file can be re-selected
    e.target.value = ''
  }

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      const fd = new FormData()
      Object.entries(values).forEach(([k, v]) => fd.append(k, v))
      const result = await updateProfile(fd)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(t('changesSaved'))
      }
    })
  }

  const inputClass =
    'w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors placeholder:text-gray-400'
  const iconInputClass =
    'w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors placeholder:text-gray-400'

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-secondary">{t('myProfile')}</h1>

      {/* Avatar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">{t('profilePicture')}</h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-primary/10 flex items-center justify-center">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={profile?.full_name ?? 'Avatar'}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl font-bold text-primary">{initials}</span>
              )}
            </div>
            {isUploading && (
              <div className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-md hover:opacity-90 transition-opacity disabled:opacity-50"
              aria-label={t('uploadAvatar')}
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 disabled:opacity-50 transition-colors"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t('uploadingAvatar')}
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4" />
                  {t('uploadAvatar')}
                </>
              )}
            </button>
            <p className="text-xs text-gray-400 mt-2">{t('profilePictureHint')}</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
      </div>

      {/* Profile form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-5">{t('personalInfo')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('form.name')}</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                <input
                  type="text"
                  {...register('full_name')}
                  className={iconInputClass}
                  placeholder={t('form.namePlaceholder')}
                />
              </div>
            </div>

            {/* Email (readonly) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('form.email')}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                <input
                  type="email"
                  value={email}
                  disabled
                  className={`${iconInputClass} bg-gray-50 text-gray-400 cursor-not-allowed`}
                />
              </div>
            </div>

            {/* Phone */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('form.phone')}</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                <input
                  type="tel"
                  {...register('phone')}
                  className={iconInputClass}
                  placeholder={t('form.phonePlaceholder')}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-5">{t('addressInfo')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Street */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('form.address')}</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                <input
                  type="text"
                  {...register('address')}
                  className={iconInputClass}
                  placeholder={t('form.addressPlaceholder')}
                />
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('form.city')}</label>
              <input
                type="text"
                {...register('city')}
                className={inputClass}
                placeholder={t('form.cityPlaceholder')}
              />
            </div>

            {/* Postal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('form.postalCode')}</label>
              <input
                type="text"
                {...register('postal_code')}
                className={inputClass}
                placeholder={t('form.postalCodePlaceholder')}
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('form.country')}</label>
              <input
                type="text"
                {...register('country')}
                className={inputClass}
                placeholder={t('form.countryPlaceholder')}
              />
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-sm font-medium rounded-full hover:opacity-90 disabled:opacity-50 transition-opacity shadow-sm shadow-primary/25"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('saving')}
              </>
            ) : (
              t('save')
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
