'use client'

import { useState, useEffect, useCallback } from 'react'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'

const testimonials = [
  {
    name: 'Sabine M.',
    location: 'München',
    rating: 5,
    titleDe: 'Traumhafte Ferienwohnung',
    titleEn: 'Dream vacation rental',
    textDe: 'Die Buchung war kinderleicht und die Unterkunft hat alle Erwartungen übertroffen. Wir kommen definitiv wieder! Der Kundenservice war außergewöhnlich hilfreich.',
    textEn: 'Booking was effortless and the property exceeded all expectations. We will definitely be back! Customer service was exceptionally helpful.',
    property: 'Villa am Gardasee',
  },
  {
    name: 'Thomas K.',
    location: 'Hamburg',
    rating: 5,
    titleDe: 'Perfekter Familienurlaub',
    titleEn: 'Perfect family vacation',
    textDe: 'Alles war perfekt organisiert – vom Check-in bis zum Check-out. Die Wohnung war makellos sauber und die Lage unschlagbar. Unsere Kinder waren begeistert.',
    textEn: 'Everything was perfectly organized – from check-in to check-out. The apartment was spotless and the location unbeatable. Our kids loved it.',
    property: 'Strandapartment Mallorca',
  },
  {
    name: 'Julia R.',
    location: 'Wien',
    rating: 5,
    titleDe: 'Bester Service überhaupt',
    titleEn: 'Best service ever',
    textDe: 'Was mich besonders überzeugt hat, war der persönliche Service. Bei jeder Frage wurde mir sofort geholfen. Die Unterkunft war wie im Prospekt – einfach wunderschön.',
    textEn: 'What impressed me most was the personal service. Every question was answered immediately. The property was exactly as advertised – simply beautiful.',
    property: 'Chalet Zermatt',
  },
  {
    name: 'Markus W.',
    location: 'Berlin',
    rating: 5,
    titleDe: 'Absolute Weiterempfehlung',
    titleEn: 'Highly recommended',
    textDe: 'Nach vielen schlechten Erfahrungen mit anderen Portalen war ich skeptisch. Aber hier stimmt einfach alles: transparente Preise, echte Bilder und ein zuverlässiger Anbieter.',
    textEn: 'After many bad experiences with other platforms I was skeptical. But here everything is right: transparent prices, real photos, and a reliable provider.',
    property: 'Penthouse Barcelona',
  },
]

export function Testimonials() {
  const t = useTranslations('common')
  const locale = useLocale()
  const [current, setCurrent] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % testimonials.length)
  }, [])

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length)
  }, [])

  useEffect(() => {
    if (!isAutoPlaying) return
    const id = setInterval(next, 6000)
    return () => clearInterval(id)
  }, [next, isAutoPlaying])

  const isDE = locale === 'de'
  const review = testimonials[current]

  return (
    <section className="py-20 relative">
      <div className="absolute top-10 left-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
      <div className="absolute bottom-10 right-10 w-24 h-24 bg-secondary/5 rounded-full blur-2xl" />

      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-secondary mb-3">
          {t('testimonialsTitle')}
        </h2>
        <p className="text-gray-500 max-w-xl mx-auto">
          {t('testimonialsSubtitle')}
        </p>
      </div>

      <div className="max-w-3xl mx-auto relative">
        <div
          className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 relative overflow-hidden"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <Quote className="absolute top-6 right-6 w-12 h-12 text-primary/10" />

          <div className="flex items-center gap-1 mb-4">
            {Array.from({ length: review.rating }).map((_, i) => (
              <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
            ))}
          </div>

          <h3 className="text-xl font-bold text-secondary mb-3">
            {isDE ? review.titleDe : review.titleEn}
          </h3>

          <p className="text-gray-600 leading-relaxed text-base mb-6">
            &ldquo;{isDE ? review.textDe : review.textEn}&rdquo;
          </p>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-secondary">{review.name}</p>
              <p className="text-sm text-gray-400">{review.location} &middot; {review.property}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
            aria-label={t('prev')}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex gap-2">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === current ? 'bg-primary w-6' : 'bg-gray-200 w-2'
                }`}
                aria-label={t('testimonialNav', { index: idx + 1 })}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
            aria-label={t('next')}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  )
}
