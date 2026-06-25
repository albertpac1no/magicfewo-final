'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('meta')

  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-700">{t('error.heading')}</h1>
        <p className="text-gray-500 mt-4">{t('error.description')}</p>
        <button
          onClick={reset}
          className="mt-6 px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition"
        >
          {t('error.retry')}
        </button>
      </div>
    </div>
  )
}
