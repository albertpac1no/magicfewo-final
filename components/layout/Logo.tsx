import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { Home, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface LogoProps {
  className?: string
  variant?: 'light' | 'dark'
  platformName?: string | null
  logoLightUrl?: string | null
  logoDarkUrl?: string | null
}

export function Logo({
  className,
  variant = 'light',
  platformName,
  logoLightUrl,
  logoDarkUrl,
}: LogoProps) {
  const logoUrl = variant === 'light' ? logoLightUrl : logoDarkUrl
  const nameParts = (platformName || 'MagicFewo').split(' ')

  if (logoUrl) {
    return (
      <Link href="/" className={cn('flex items-center gap-4', className)}>
        <Image
          src={logoUrl}
          alt={`${platformName || 'MagicFewo'} Logo`}
          width={120}
          height={40}
          className="h-8 w-auto object-contain"
        />
        <div className="flex items-baseline">
          <span className="text-2xl font-bold text-secondary">{nameParts[0]}</span>
          {nameParts[1] && (
            <span className="text-2xl font-bold text-secondary">{nameParts[1]}</span>
          )}
        </div>
      </Link>
    )
  }

  return (
    <Link href="/" className={cn('flex items-center gap-2 group', className)}>
      <div className="relative">
        <Home className="w-8 h-8 text-secondary" />
        <Sparkles className="w-4 h-4 text-secondary absolute -top-1 -right-1 animate-pulse" />
      </div>
      <div className="flex items-baseline">
        <span className="text-2xl font-bold text-secondary">{nameParts[0]}</span>
        {nameParts[1] && (
          <span className="text-2xl font-bold text-secondary">{nameParts[1]}</span>
        )}
      </div>
    </Link>
  )
}
