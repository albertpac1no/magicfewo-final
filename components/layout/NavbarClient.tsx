'use client'

import { useState, useEffect, useTransition } from 'react'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { ChevronDown, Menu, X, LogOut, Settings, LayoutDashboard, Shield } from 'lucide-react'
import { createSupabaseClient } from '@/lib/supabase/client'
import { Logo } from './Logo'
import { LanguageSwitcher } from './LanguageSwitcher'
import type { Profile } from '@/lib/types'

interface NavbarClientProps {
  user: { id: string; email: string | null } | null
  profile: Profile | null
  isAdmin: boolean
  platformName?: string | null
  logoLightUrl?: string | null
  logoDarkUrl?: string | null
}

export function NavbarClient({
  user,
  profile,
  isAdmin,
  platformName,
  logoLightUrl,
  logoDarkUrl,
}: NavbarClientProps) {
  const t = useTranslations('nav')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const [, startMenuTransition] = useTransition()

  const navigation = [
    { name: t('home'), href: '/' as const },
    { name: t('properties'), href: '/properties' as const },
    {
      name: t('destinations'),
      href: '#' as const,
      submenu: [
        { name: t('europe'), href: '/reiseziele/europa' as const },
        { name: t('asia'), href: '/reiseziele/asien' as const },
        { name: t('americas'), href: '/reiseziele/amerika' as const },
        { name: t('africa'), href: '/reiseziele/afrika' as const },
      ],
    },
    { name: t('offers'), href: '/angebote' as const },
    { name: t('about'), href: '/ueber-uns' as const },
    { name: t('contact'), href: '/kontakt' as const },
  ]

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menus on route change
  useEffect(() => {
    startMenuTransition(() => {
      setIsMobileMenuOpen(false)
      setIsUserMenuOpen(false)
    })
  }, [pathname, startMenuTransition])

  const handleSignOut = async () => {
    const supabase = createSupabaseClient()
    await supabase.auth.signOut()
    setIsUserMenuOpen(false)
    router.push('/')
    router.refresh()
  }

  const initials = profile?.full_name
    ? profile.full_name
        .split(' ')
        .map((n: string) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : (user?.email?.[0] || 'U').toUpperCase()

  return (
    <nav
      className={`sticky top-0 z-50 w-full bg-white transition-all duration-300 ${
        isScrolled ? 'shadow-md' : ''
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo
              platformName={platformName}
              logoLightUrl={logoLightUrl}
              logoDarkUrl={logoDarkUrl}
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative group"
                onMouseEnter={() => setActiveSubmenu(item.name)}
                onMouseLeave={() => setActiveSubmenu(null)}
              >
                {item.submenu ? (
                  <button className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium flex items-center">
                    {item.name}
                    <ChevronDown className="w-4 h-4 ml-1 transform group-hover:rotate-180 transition-transform" />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium ${
                      pathname === item.href ? 'text-primary' : ''
                    }`}
                  >
                    {item.name}
                  </Link>
                )}

                {item.submenu && activeSubmenu === item.name && (
                  <div className="absolute left-0 mt-2 w-48 rounded-lg bg-white shadow-lg py-2 transition-all duration-200">
                    {item.submenu.map((subitem) => (
                      <Link
                        key={subitem.name}
                        href={subitem.href}
                        className={`block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary ${
                          pathname === subitem.href ? 'text-primary bg-primary/5' : ''
                        }`}
                      >
                        {subitem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden lg:flex items-center space-x-4">
            <LanguageSwitcher />
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary"
                >
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {initials}
                  </div>
                  <span className="text-sm font-medium">
                    {profile?.full_name || user.email}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transform transition-transform ${
                      isUserMenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg py-2">
                    <Link
                      href="/dashboard"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary"
                    >
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      {t('dashboard')}
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary"
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        {t('admin')}
                      </Link>
                    )}
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      {t('settings')}
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      {t('signOut')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/auth"
                  className="text-gray-700 hover:text-primary text-sm font-medium"
                >
                  {t('signIn')}
                </Link>
                <Link href="/auth?mode=register" className="btn-primary">
                  {t('register')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-2">
            <LanguageSwitcher />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-primary"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.submenu ? (
                  <>
                    <button
                      onClick={() =>
                        setActiveSubmenu(activeSubmenu === item.name ? null : item.name)
                      }
                      className="w-full flex items-center justify-between py-2 text-gray-700 hover:text-primary"
                    >
                      {item.name}
                      <ChevronDown
                        className={`w-4 h-4 transform transition-transform ${
                          activeSubmenu === item.name ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {activeSubmenu === item.name && (
                      <div className="pl-4 py-2 space-y-2">
                        {item.submenu.map((subitem) => (
                          <Link
                            key={subitem.name}
                            href={subitem.href}
                            className={`block py-2 text-sm text-gray-600 hover:text-primary ${
                              pathname === subitem.href ? 'text-primary' : ''
                            }`}
                          >
                            {subitem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`block py-2 text-gray-700 hover:text-primary ${
                      pathname === item.href ? 'text-primary' : ''
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}

            {user ? (
              <div className="mt-4 space-y-2">
                <div className="flex items-center space-x-2 py-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {initials}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {profile?.full_name || user.email}
                  </span>
                </div>
                <Link href="/dashboard" className="block py-2 text-gray-700 hover:text-primary">
                  {t('dashboard')}
                </Link>
                {isAdmin && (
                  <Link href="/admin" className="block py-2 text-gray-700 hover:text-primary">
                    {t('admin')}
                  </Link>
                )}
                <Link
                  href="/dashboard/settings"
                  className="block py-2 text-gray-700 hover:text-primary"
                >
                  {t('settings')}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left py-2 text-gray-700 hover:text-primary"
                >
                  {t('signOut')}
                </button>
              </div>
            ) : (
              <div className="mt-4 space-y-2">
                <Link
                  href="/auth"
                  className="block py-2 text-gray-700 hover:text-primary text-sm font-medium"
                >
                  {t('signIn')}
                </Link>
                <Link href="/auth?mode=register" className="block w-full btn-primary text-center">
                  {t('register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
