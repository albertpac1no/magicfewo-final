import { Phone, Mail } from 'lucide-react'
import type { Settings } from '@/lib/settings'

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

export interface TopHeaderProps {
  settings: Settings | null
}

export function TopHeader({ settings }: TopHeaderProps) {
  return (
    <div className="bg-secondary text-white py-2.5 text-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="hidden sm:flex items-center space-x-6">
            {settings?.company_phone && (
              <a
                href={`tel:${settings.company_phone}`}
                className="flex items-center hover:text-primary transition-colors"
              >
                <Phone className="w-4 h-4 mr-2" />
                {settings.company_phone}
              </a>
            )}
            {settings?.company_email && (
              <a
                href={`mailto:${settings.company_email}`}
                className="flex items-center hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4 mr-2" />
                {settings.company_email}
              </a>
            )}
          </div>

          <div className="flex items-center space-x-4 ml-auto">
            <div className="flex items-center space-x-3 mr-6">
              <span className="hover:text-primary transition-colors cursor-pointer" aria-label="Facebook">
                <FacebookIcon className="w-4 h-4" />
              </span>
              <span className="hover:text-primary transition-colors cursor-pointer" aria-label="Instagram">
                <InstagramIcon className="w-4 h-4" />
              </span>
              <span className="hover:text-primary transition-colors cursor-pointer" aria-label="Twitter">
                <TwitterIcon className="w-4 h-4" />
              </span>
            </div>
            <select className="bg-transparent text-sm focus:outline-none hover:text-primary transition-colors cursor-pointer">
              <option value="de">Deutsch</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
