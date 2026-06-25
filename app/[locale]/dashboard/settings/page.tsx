'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Bell, Lock, Eye, Loader2, ShieldCheck, LogOut, EyeOff } from 'lucide-react'
import { createSupabaseClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface NotificationSettings {
  emailNotifications: boolean
  marketingEmails: boolean
}

interface PrivacySettings {
  profileVisible: boolean
  shareActivity: boolean
}

function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean
  onChange: () => void
  disabled?: boolean
}) {
  return (
    <label className="relative inline-flex items-center cursor-pointer shrink-0">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <div
        className={`w-11 h-6 rounded-full transition-colors peer
          after:content-[''] after:absolute after:top-[2px] after:left-[2px]
          after:bg-white after:rounded-full after:h-5 after:w-5 after:shadow after:transition-all
          peer-checked:after:translate-x-5 peer-checked:bg-primary
          bg-gray-200 peer-disabled:opacity-50`}
      />
    </label>
  )
}

function SectionCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-start gap-4 px-6 py-5 border-b border-gray-50">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-secondary">{title}</h2>
          <p className="text-sm text-gray-400 mt-0.5">{description}</p>
        </div>
      </div>
      <div className="px-6 py-5 space-y-5">{children}</div>
    </div>
  )
}

function ToggleRow({
  title,
  description,
  checked,
  onChange,
  disabled,
}: {
  title: string
  description: string
  checked: boolean
  onChange: () => void
  disabled?: boolean
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-400 mt-0.5">{description}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} disabled={disabled} />
    </div>
  )
}

function PasswordInput({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  const [show, setShow] = useState(false)
  const t = useTranslations('dashboard')
  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pr-10 px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors placeholder:text-gray-400"
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
        aria-label={show ? t('settings.hidePassword') : t('settings.showPassword')}
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  )
}

export default function SettingsPage() {
  const t = useTranslations('dashboard')
  const sbRef = useRef<ReturnType<typeof createSupabaseClient> | null>(null)
  const getSupabase = () => {
    if (!sbRef.current) sbRef.current = createSupabaseClient()
    return sbRef.current
  }
  const [loading, setLoading] = useState(true)

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    marketingEmails: false,
  })
  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisible: true,
    shareActivity: false,
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [changingPassword, setChangingPassword] = useState(false)
  const [savingNotif, setSavingNotif] = useState(false)
  const [savingPrivacy, setSavingPrivacy] = useState(false)

  useEffect(() => {
    async function load() {
      const sb = getSupabase()
      const { data: { user } } = await sb.auth.getUser()
      if (!user) return
      const { data } = await sb
        .from('profiles')
        .select('notification_settings, privacy_settings')
        .eq('id', user.id)
        .single()
      if (data?.notification_settings) setNotifications(data.notification_settings as NotificationSettings)
      if (data?.privacy_settings) setPrivacy(data.privacy_settings as PrivacySettings)
      setLoading(false)
    }
    load()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const saveNotifications = async (next: NotificationSettings) => {
    setSavingNotif(true)
    setNotifications(next)
    const sb = getSupabase()
    const { data: { user } } = await sb.auth.getUser()
    if (user) {
      const { error } = await sb.from('profiles').update({ notification_settings: next }).eq('id', user.id)
      if (error) toast.error(t('settings.saveError'))
      else toast.success(t('settings.settingsSaved'))
    }
    setSavingNotif(false)
  }

  const savePrivacy = async (next: PrivacySettings) => {
    setSavingPrivacy(true)
    setPrivacy(next)
    const sb = getSupabase()
    const { data: { user } } = await sb.auth.getUser()
    if (user) {
      const { error } = await sb.from('profiles').update({ privacy_settings: next }).eq('id', user.id)
      if (error) toast.error(t('settings.saveError'))
      else toast.success(t('settings.settingsSaved'))
    }
    setSavingPrivacy(false)
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordForm.newPassword.length < 6) {
      toast.error(t('settings.passwordMinLength'))
      return
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error(t('settings.passwordMismatch'))
      return
    }
    setChangingPassword(true)
    const sb = getSupabase()
    const { data: { user } } = await sb.auth.getUser()
    if (!user?.email) {
      toast.error(t('settings.userNotFound'))
      setChangingPassword(false)
      return
    }
    const { error: signInError } = await sb.auth.signInWithPassword({
      email: user.email,
      password: passwordForm.currentPassword,
    })
    if (signInError) {
      toast.error(t('settings.wrongPassword'))
      setChangingPassword(false)
      return
    }
    const { error } = await sb.auth.updateUser({ password: passwordForm.newPassword })
    if (error) toast.error(error.message)
    else {
      toast.success(t('settings.passwordChanged'))
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    }
    setChangingPassword(false)
  }

  const handleSignOut = async () => {
    await getSupabase().auth.signOut()
    window.location.href = '/'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-secondary">{t('settings.title')}</h1>

      {/* Notifications */}
      <SectionCard icon={Bell} title={t('settings.notifications')} description={t('settings.notificationsDesc')}>
        <ToggleRow
          title={t('settings.emailNotifications')}
          description={t('settings.emailNotificationsDesc')}
          checked={notifications.emailNotifications}
          disabled={savingNotif}
          onChange={() => saveNotifications({ ...notifications, emailNotifications: !notifications.emailNotifications })}
        />
        <div className="h-px bg-gray-50" />
        <ToggleRow
          title={t('settings.marketingEmails')}
          description={t('settings.marketingEmailsDesc')}
          checked={notifications.marketingEmails}
          disabled={savingNotif}
          onChange={() => saveNotifications({ ...notifications, marketingEmails: !notifications.marketingEmails })}
        />
      </SectionCard>

      {/* Privacy */}
      <SectionCard icon={Eye} title={t('settings.privacy')} description={t('settings.privacyDesc')}>
        <ToggleRow
          title={t('settings.profileVisible')}
          description={t('settings.profileVisibleDesc')}
          checked={privacy.profileVisible}
          disabled={savingPrivacy}
          onChange={() => savePrivacy({ ...privacy, profileVisible: !privacy.profileVisible })}
        />
        <div className="h-px bg-gray-50" />
        <ToggleRow
          title={t('settings.showActivity')}
          description={t('settings.showActivityDesc')}
          checked={privacy.shareActivity}
          disabled={savingPrivacy}
          onChange={() => savePrivacy({ ...privacy, shareActivity: !privacy.shareActivity })}
        />
      </SectionCard>

      {/* Security */}
      <SectionCard icon={ShieldCheck} title={t('settings.security')} description={t('settings.securityDesc')}>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t('settings.currentPassword')}
            </label>
            <PasswordInput
              value={passwordForm.currentPassword}
              onChange={(v) => setPasswordForm((f) => ({ ...f, currentPassword: v }))}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t('settings.newPassword')}
              </label>
              <PasswordInput
                value={passwordForm.newPassword}
                onChange={(v) => setPasswordForm((f) => ({ ...f, newPassword: v }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t('settings.confirmPassword')}
              </label>
              <PasswordInput
                value={passwordForm.confirmPassword}
                onChange={(v) => setPasswordForm((f) => ({ ...f, confirmPassword: v }))}
              />
            </div>
          </div>
          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={changingPassword}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-full hover:opacity-90 disabled:opacity-50 transition-opacity shadow-sm shadow-primary/20"
            >
              {changingPassword ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t('settings.updating')}
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  {t('settings.changePassword')}
                </>
              )}
            </button>
          </div>
        </form>
      </SectionCard>

      {/* Sign out / Account */}
      <SectionCard icon={LogOut} title={t('settings.dangerZone')} description={t('settings.dangerZoneDesc')}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">{t('settings.signOut')}</p>
            <p className="text-xs text-gray-400 mt-0.5">{t('settings.signOutDesc')}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-full hover:bg-red-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {t('settings.signOut')}
          </button>
        </div>
      </SectionCard>
    </div>
  )
}
