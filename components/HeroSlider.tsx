'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

const heroImages = [
  {
    url: '/images/hero-villa-pool.jpg',
    alt: 'Luxuriöse Villa mit Infinity-Pool am Mittelmeer',
  },
  {
    url: '/images/hero-coastal-village.jpg',
    alt: 'Malerisches Küstendorf mit türkisblauem Meer',
  },
  {
    url: '/images/hero-apartment-interior.jpg',
    alt: 'Elegantes Ferienapartment mit Meerblick',
  },
  {
    url: '/images/hero-mountain-retreat.jpg',
    alt: 'Gemütliches Bergchalet am Alpensee',
  },
]

export function HeroSlider() {
  const t = useTranslations('common')
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = useCallback(() => {
    setCurrentIndex((c) => (c + 1) % heroImages.length)
  }, [])

  useEffect(() => {
    const id = setInterval(next, 5000)
    return () => clearInterval(id)
  }, [next])

  return (
    <div className="relative h-[600px] -mt-20 overflow-hidden">
      {heroImages.map((image, index) => (
        <div
          key={image.url}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{
            opacity: index === currentIndex ? 1 : 0,
            zIndex: index === currentIndex ? 1 : 0,
          }}
        >
          <Image
            src={image.url}
            alt={image.alt}
            fill
            sizes="100vw"
            className="object-cover"
            priority={index === 0}
          />
        </div>
      ))}

      {/* Overlay and Content */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50 z-10">
        <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center text-center pt-20">
          <h1 className="text-white text-4xl md:text-6xl font-bold mb-6 max-w-4xl leading-tight">
            {t('heroTitle')}
          </h1>
          <p className="text-white/90 text-lg md:text-xl mb-12 max-w-2xl">
            {t('heroSubtitle')}
          </p>

          {/* Image Indicators */}
          <div className="absolute bottom-32 flex space-x-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-white w-6'
                    : 'bg-white/50 w-2'
                }`}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
