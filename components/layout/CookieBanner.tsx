'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { X, Cookie, ChevronDown, ChevronUp, Shield, BarChart2, Megaphone, Settings2 } from 'lucide-react'

const COOKIE_NAME = 'mf_cookie_consent'
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60 // 1 year in seconds

export interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  preferences: boolean
}

function getCookieConsent(): CookiePreferences | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp('(?:^|; )' + COOKIE_NAME + '=([^;]*)'))
  if (!match) return null
  try {
    return JSON.parse(decodeURIComponent(match[1]))
  } catch {
    return null
  }
}

function setCookieConsent(prefs: CookiePreferences) {
  const value = encodeURIComponent(JSON.stringify(prefs))
  const maxAge = COOKIE_MAX_AGE
  const secure = location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${COOKIE_NAME}=${value}; Max-Age=${maxAge}; Path=/; SameSite=Lax${secure}`
}

type Panel = 'banner' | 'customize'

export function CookieBanner() {
  const t = useTranslations('common.cookies')
  const [visible, setVisible] = useState(false)
  const [panel, setPanel] = useState<Panel>('banner')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [prefs, setPrefs] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
  })

  useEffect(() => {
    if (!getCookieConsent()) {
      const timer = setTimeout(() => setVisible(true), 600)
      return () => clearTimeout(timer)
    }
  }, [])

  const acceptAll = () => {
    const all: CookiePreferences = { necessary: true, analytics: true, marketing: true, preferences: true }
    setCookieConsent(all)
    setVisible(false)
  }

  const rejectAll = () => {
    const none: CookiePreferences = { necessary: true, analytics: false, marketing: false, preferences: false }
    setCookieConsent(none)
    setVisible(false)
  }

  const savePrefs = () => {
    setCookieConsent(prefs)
    setVisible(false)
  }

  const toggleCategory = (key: keyof Omit<CookiePreferences, 'necessary'>) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }))
  }

  if (!visible) return null

  const categories = [
    {
      key: 'necessary' as const,
      icon: Shield,
      locked: true,
    },
    {
      key: 'analytics' as const,
      icon: BarChart2,
      locked: false,
    },
    {
      key: 'marketing' as const,
      icon: Megaphone,
      locked: false,
    },
    {
      key: 'preferences' as const,
      icon: Settings2,
      locked: false,
    },
  ]

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('bannerTitle')}
      className="fixed bottom-0 inset-x-0 z-[9999] flex justify-center px-3 pb-3 sm:pb-4 sm:px-4 pointer-events-none"
    >
      <div className="pointer-events-auto w-full max-w-2xl animate-slide-up">
        {/* ── Main Banner ── */}
        {panel === 'banner' && (
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* compact mobile bar */}
            <div className="flex items-start gap-3 p-3 sm:p-5">
              <div className="shrink-0 mt-0.5 hidden sm:flex items-center justify-center w-9 h-9 rounded-full bg-primary/10">
                <Cookie className="w-5 h-5 text-primary" />
              </div>

              <div className="flex-1 min-w-0">
                {/* title only on sm+ */}
                <p className="hidden sm:block text-sm font-semibold text-gray-900 mb-1">{t('bannerTitle')}</p>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2 sm:line-clamp-none">
                  {t('bannerText')}{' '}
                  <Link href="/datenschutz" className="underline underline-offset-2 hover:text-primary transition-colors whitespace-nowrap">
                    {t('privacyLink')}
                  </Link>
                  .
                </p>
              </div>
            </div>

            {/* actions */}
            <div className="flex flex-wrap items-center gap-2 px-3 pb-3 sm:px-5 sm:pb-4">
              <button
                onClick={acceptAll}
                className="btn-primary flex-1 sm:flex-none text-xs sm:text-sm py-2 sm:py-2.5 px-4 sm:px-5"
              >
                {t('acceptAll')}
              </button>
              <button
                onClick={rejectAll}
                className="btn-secondary flex-1 sm:flex-none text-xs sm:text-sm py-2 sm:py-2.5 px-4 sm:px-5"
              >
                {t('rejectAll')}
              </button>
              <button
                onClick={() => setPanel('customize')}
                className="flex-1 sm:flex-none text-xs sm:text-sm py-2 sm:py-2.5 px-4 sm:px-5 rounded-full border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-800 transition-colors"
              >
                {t('customize')}
              </button>
            </div>
          </div>
        )}

        {/* ── Customize Panel ── */}
        {panel === 'customize' && (
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden max-h-[85vh] flex flex-col">
            {/* header */}
            <div className="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-2">
                <Cookie className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <h2 className="text-sm sm:text-base font-semibold text-gray-900">{t('customizeTitle')}</h2>
              </div>
              <button
                onClick={() => setPanel('banner')}
                aria-label={t('back')}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* categories — scrollable */}
            <div className="overflow-y-auto flex-1 divide-y divide-gray-50">
              {categories.map(({ key, icon: Icon, locked }) => (
                <div key={key} className="px-4 sm:px-5">
                  {/* row */}
                  <button
                    className="w-full flex items-center gap-3 py-3 text-left"
                    onClick={() => setExpanded(expanded === key ? null : key)}
                    aria-expanded={expanded === key}
                  >
                    <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50">
                      <Icon className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-900">{t(`${key}.title`)}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {locked ? (
                        <span className="text-[10px] sm:text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                          {t('alwaysOn')}
                        </span>
                      ) : (
                        <button
                          role="switch"
                          aria-checked={prefs[key as keyof CookiePreferences]}
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleCategory(key as keyof Omit<CookiePreferences, 'necessary'>)
                          }}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 ${
                            prefs[key as keyof CookiePreferences] ? 'bg-primary' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              prefs[key as keyof CookiePreferences] ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      )}
                      {expanded === key
                        ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
                        : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                      }
                    </div>
                  </button>
                  {/* description */}
                  {expanded === key && (
                    <p className="pb-3 text-xs text-gray-500 leading-relaxed">{t(`${key}.description`)}</p>
                  )}
                </div>
              ))}
            </div>

            {/* footer */}
            <div className="flex flex-wrap gap-2 px-4 py-3 sm:px-5 sm:py-4 border-t border-gray-100 shrink-0">
              <button
                onClick={savePrefs}
                className="btn-primary flex-1 text-xs sm:text-sm py-2 sm:py-2.5"
              >
                {t('savePrefs')}
              </button>
              <button
                onClick={acceptAll}
                className="btn-secondary flex-1 text-xs sm:text-sm py-2 sm:py-2.5"
              >
                {t('acceptAll')}
              </button>
              <button
                onClick={rejectAll}
                className="flex-1 text-xs sm:text-sm py-2 sm:py-2.5 rounded-full border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-800 transition-colors"
              >
                {t('rejectAll')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
