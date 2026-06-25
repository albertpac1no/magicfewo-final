'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Mail, Lock, User, Loader2, AlertCircle } from 'lucide-react'
import { createSupabaseClient } from '@/lib/supabase/client'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
      </div>
    }>
      <AuthContent />
    </Suspense>
  )
}

function AuthContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations('auth')
  const [isSignIn, setIsSignIn] = useState(searchParams.get('mode') !== 'register')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setIsSignIn(searchParams.get('mode') !== 'register')
  }, [searchParams])

  const toggleMode = () => {
    const newMode = isSignIn ? 'register' : 'login'
    router.push(`/auth${newMode === 'register' ? '?mode=register' : ''}`)
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setError('')
      setLoading(true)
      const supabase = createSupabaseClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      router.refresh()
      router.push('/dashboard')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('errors.invalidCredentials')
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) {
      setError(t('errors.passwordTooShort'))
      return
    }
    try {
      setError('')
      setLoading(true)
      const supabase = createSupabaseClient()
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      })
      if (error) throw error
      router.refresh()
      router.push('/dashboard')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('errors.registrationFailed')
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Auth Forms */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-8">
            <h1 className="mt-6 text-3xl font-bold text-[var(--color-secondary)]">
              {isSignIn ? t('signIn.title') : t('signUp.title')}
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              {isSignIn ? t('signIn.subtitle') : t('signUp.subtitle')}
            </p>
          </div>

          {/* Auth Form */}
          <form onSubmit={isSignIn ? handleSignIn : handleSignUp} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Full Name - Sign Up only */}
            {!isSignIn && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('form.name')}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
                    placeholder={t('form.namePlaceholder')}
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
                  placeholder={t('form.emailPlaceholder')}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
                  placeholder={t('form.passwordPlaceholder')}
                  required
                  minLength={isSignIn ? undefined : 8}
                />
              </div>
              {!isSignIn && (
                <p className="mt-2 text-sm text-gray-500">
                  {t('form.passwordMinLength')}
                </p>
              )}
            </div>

            {isSignIn && (
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)] border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-600">{t('form.rememberMe')}</span>
                </label>
                <button
                  type="button"
                  className="text-sm text-[var(--color-primary)] hover:opacity-80"
                  onClick={() => {}}
                >
                  {t('form.forgotPassword')}
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-2.5 relative"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {isSignIn ? t('signIn.submitting') : t('signUp.submitting')}
                </span>
              ) : (
                isSignIn ? t('signIn.submitButton') : t('signUp.submitButton')
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">{t('or')}</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={toggleMode}
                className="text-[var(--color-primary)] hover:opacity-80 font-medium"
              >
                {isSignIn ? t('switchToSignUp') : t('switchToSignIn')}
              </button>
            </div>
          </div>

          <div className="mt-8 space-y-4 text-sm text-gray-500">
            <p>
              {t.rich('termsNotice', {
                termsLink: (chunks) => (
                  <Link href="/agb" className="text-[var(--color-primary)] hover:opacity-80">{chunks}</Link>
                ),
                privacyLink: (chunks) => (
                  <Link href="/datenschutz" className="text-[var(--color-primary)] hover:opacity-80">{chunks}</Link>
                ),
              })}
            </p>
            <p>
              {t('needHelp')}{' '}
              <Link href="/kontakt" className="text-[var(--color-primary)] hover:opacity-80">
                {t('contactUs')}
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block relative w-0 flex-1">
        <Image
          className="absolute inset-0 h-full w-full object-cover"
          src="/images/auth-vacation-entrance.jpg"
          alt={t('imageAlt')}
          fill
          sizes="50vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10" />
        <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
          <div className="max-w-xl">
            <h2 className="text-4xl font-bold mb-4">
              {isSignIn ? t('signIn.heroTitle') : t('signUp.heroTitle')}
            </h2>
            <p className="text-white/90 text-lg">
              {isSignIn ? t('signIn.heroSubtitle') : t('signUp.heroSubtitle')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
