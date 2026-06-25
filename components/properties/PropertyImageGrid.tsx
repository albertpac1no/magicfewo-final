'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

const FALLBACK_IMAGE = '/images/hero-apartment-interior.jpg'

interface PropertyImageGridProps {
  images: string[]
  title: string
}

interface ProcessedImage {
  url: string
  category: string
  index: number
  position: number
}

function processImages(images: string[]): ProcessedImage[] {
  return images.map((img, index) => {
    const [baseUrl, ...fragments] = img.split('#')
    let category = ''
    let position = index

    for (const fragment of fragments) {
      if (fragment.startsWith('category=')) {
        category = decodeURIComponent(fragment.replace('category=', ''))
      } else if (fragment.startsWith('position=')) {
        const positionValue = parseInt(fragment.replace('position=', ''))
        if (!isNaN(positionValue)) position = positionValue
      }
    }

    return { url: baseUrl, category, index, position }
  })
}

function getRepresentativeImages(sorted: ProcessedImage[]): ProcessedImage[] {
  const categories = [...new Set(sorted.map((img) => img.category).filter(Boolean))]
  const gridImages: ProcessedImage[] = []

  for (const category of categories) {
    const image = sorted.find(
      (img) => img.category === category && !gridImages.some((gi) => gi.index === img.index)
    )
    if (image && gridImages.length < 5) gridImages.push(image)
    if (gridImages.length >= 5) break
  }

  if (gridImages.length < 5 && sorted.length > 0) {
    for (let i = 0; gridImages.length < 5 && i < sorted.length; i++) {
      if (!gridImages.some((gi) => gi.index === sorted[i].index)) {
        gridImages.push(sorted[i])
      }
    }
  }

  while (gridImages.length < 5 && gridImages.length > 0) {
    gridImages.push(gridImages[gridImages.length - 1])
  }

  return gridImages
}

/* ------------------------------------------------------------------ */
/* Lightbox Modal                                                      */
/* ------------------------------------------------------------------ */
function ImageGalleryModal({
  images,
  title,
  startIndex,
  onClose,
}: {
  images: ProcessedImage[]
  title: string
  startIndex: number
  onClose: () => void
}) {
  const [currentIndex, setCurrentIndex] = useState(startIndex)
  const [fadeIn, setFadeIn] = useState(true)

  const navigate = useCallback(
    (dir: 'prev' | 'next') => {
      if (images.length <= 1) return
      setFadeIn(false)
      setTimeout(() => {
        setCurrentIndex((prev) =>
          dir === 'prev'
            ? prev === 0
              ? images.length - 1
              : prev - 1
            : prev === images.length - 1
              ? 0
              : prev + 1
        )
        requestAnimationFrame(() => setFadeIn(true))
      }, 200)
    },
    [images.length]
  )

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') navigate('prev')
      else if (e.key === 'ArrowRight') navigate('next')
    }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [navigate, onClose])

  const current = images[currentIndex]
  if (!current) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex flex-col"
      role="dialog"
      aria-modal="true"
    >
      {/* Header */}
      <div className="p-4 flex justify-between items-center text-white">
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Galerie schließen"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="w-10" />
      </div>

      {/* Main image */}
      <div className="flex-1 flex items-center justify-center relative px-4">
        <div
          className={`relative max-h-[calc(100vh-160px)] max-w-[90vw] w-full h-full transition-opacity duration-300 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current.url}
            alt={`${title} - ${current.category || 'Bild'}`}
            className="max-h-full max-w-full object-contain mx-auto"
          />
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={() => navigate('prev')}
              className="absolute left-4 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              aria-label="Vorheriges Bild"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => navigate('next')}
              className="absolute right-4 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              aria-label="Nächstes Bild"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 text-white flex justify-between items-center">
        <div>
          {current.category && (
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
              {current.category}
            </span>
          )}
        </div>
        <div className="text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Main Grid Component                                                 */
/* ------------------------------------------------------------------ */
export function PropertyImageGrid({ images, title }: PropertyImageGridProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [startImageIndex, setStartImageIndex] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className="relative mb-12 h-[400px] bg-gray-100 rounded-2xl flex items-center justify-center">
        <p className="text-gray-500">Keine Bilder verfügbar</p>
      </div>
    )
  }

  const processed = processImages(images)
  const sorted = [...processed].sort((a, b) => a.position - b.position)
  const gridImages = getRepresentativeImages(sorted)

  const openModal = (index: number) => {
    setStartImageIndex(index)
    setIsModalOpen(true)
  }

  return (
    <div className="relative mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 h-[400px]">
        {/* Large main image */}
        {gridImages.length > 0 && (
          <div
            className="col-span-1 md:col-span-2 row-span-2 relative rounded-tl-2xl rounded-bl-2xl overflow-hidden cursor-pointer"
            onClick={() => openModal(gridImages[0].index)}
          >
            <Image
              src={gridImages[0].url || FALLBACK_IMAGE}
              alt={`${title} - ${gridImages[0].category || 'Hauptbild'}`}
              fill
              sizes="(max-width: 768px) 100vw, 66vw"
              className="object-cover"
              priority
            />
            {gridImages[0].category && (
              <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                {gridImages[0].category}
              </div>
            )}
          </div>
        )}

        {/* Top-right images */}
        {gridImages.slice(1, 3).map((image, idx) => (
          <div
            key={`grid-${idx}`}
            className={`relative overflow-hidden cursor-pointer ${idx === 0 ? 'rounded-tr-2xl' : ''}`}
            onClick={() => openModal(image.index)}
          >
            <Image
              src={image.url || FALLBACK_IMAGE}
              alt={`${title} - ${image.category || `Bild ${idx + 2}`}`}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
            {image.category && (
              <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                {image.category}
              </div>
            )}
          </div>
        ))}

        {/* Bottom-right images (hidden on small screens) */}
        {gridImages.slice(3, 5).map((image, idx) => (
          <div
            key={`grid-bottom-${idx}`}
            className={`relative overflow-hidden cursor-pointer hidden lg:block ${idx === 1 ? 'rounded-br-2xl' : ''}`}
            onClick={() => openModal(image.index)}
          >
            <Image
              src={image.url || FALLBACK_IMAGE}
              alt={`${title} - ${image.category || `Bild ${idx + 4}`}`}
              fill
              sizes="33vw"
              className="object-cover"
            />
            {image.category && (
              <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                {image.category}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Show all photos button */}
      <button
        onClick={() => {
          setStartImageIndex(0)
          setIsModalOpen(true)
        }}
        className="absolute bottom-4 right-4 bg-white shadow-md rounded-full px-4 py-2 flex items-center gap-2 hover:bg-gray-50 transition-colors text-sm font-medium"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        Alle Fotos anzeigen
      </button>

      {/* Modal Gallery */}
      {isModalOpen && (
        <ImageGalleryModal
          images={sorted}
          title={title}
          startIndex={startImageIndex}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  )
}
