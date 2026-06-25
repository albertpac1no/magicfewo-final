'use client'

import { useState, useRef, useEffect, useTransition, useId } from 'react'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { ChevronDown, Check } from 'lucide-react'

function GermanFlag({ className }: { className?: string }) {
  return (
    <span className={`inline-block overflow-hidden ${className ?? ''}`}>
      <svg viewBox="0 0 5 3" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="5" height="3" fill="#000000" />
        <rect width="5" height="2" y="1" fill="#DD0000" />
        <rect width="5" height="1" y="2" fill="#FFCE00" />
      </svg>
    </span>
  )
}

function UkFlag({ className }: { className?: string }) {
  const id = useId().replace(/:/g, '')
  return (
    <span className={`inline-block overflow-hidden ${className ?? ''}`}>
      <svg viewBox="0 0 60 30" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <clipPath id={`uk-${id}`}>
          <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
        </clipPath>
        <rect width="60" height="30" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#ffffff" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" clipPath={`url(#uk-${id})`} stroke="#C8102E" strokeWidth="4" />
        <path d="M30,0 v30 M0,15 h60" stroke="#ffffff" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
      </svg>
    </span>
  )
}

const LANGUAGES: Record<string, { label: string; short: string; Flag: typeof GermanFlag }> = {
  de: { label: 'Deutsch', short: 'DE', Flag: GermanFlag },
  en: { label: 'English', short: 'EN', Flag: UkFlag },
}

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) {
      document.addEventListener('mousedown', handleClick)
      document.addEventListener('keydown', handleKey)
    }
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  function switchLocale(newLocale: string) {
    setOpen(false)
    if (newLocale === locale) return
    startTransition(() => {
      router.replace(pathname, { locale: newLocale })
    })
  }

  const current = LANGUAGES[locale] ?? LANGUAGES.de

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={current.label}
        disabled={isPending}
        className={`flex items-center gap-1.5 pl-1.5 pr-2 py-1.5 rounded-full border transition-colors duration-150 ${
          open
            ? 'border-gray-300 bg-gray-50'
            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
        } ${isPending ? 'opacity-60' : ''}`}
      >
        <current.Flag className="w-5 h-5 rounded-full ring-1 ring-black/5 shrink-0" />
        <span className="text-xs font-semibold text-gray-700 leading-none">{current.short}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-full mt-2 w-44 rounded-xl bg-white shadow-xl shadow-gray-200/50 border border-gray-100 py-1.5 animate-slide-up z-50"
        >
          {routing.locales.map((loc) => {
            const lang = LANGUAGES[loc]
            const active = loc === locale
            return (
              <button
                key={loc}
                role="option"
                aria-selected={active}
                onClick={() => switchLocale(loc)}
                className={`flex items-center gap-3 w-full px-3 py-2 text-sm transition-colors duration-150 ${
                  active ? 'text-primary font-medium bg-primary/5' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <lang.Flag className="w-5 h-5 rounded-full ring-1 ring-black/5 shrink-0" />
                <span className="flex-1 text-left">{lang.label}</span>
                {active && <Check className="w-4 h-4 text-primary shrink-0" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
