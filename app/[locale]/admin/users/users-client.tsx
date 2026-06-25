'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import { Search, Filter, User, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { updateUserRole } from '@/app/actions/admin'

interface UserWithCount {
  id: string
  full_name: string | null
  email: string
  avatar_url: string | null
  role: string
  created_at: string
  booking_count: number
}

export function UsersClient({ users }: { users: UserWithCount[] }) {
  const t = useTranslations('admin')
  const tCommon = useTranslations('common')
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'admin'>('all')
  const [isPending, startTransition] = useTransition()
  const [changingUserId, setChangingUserId] = useState<string | null>(null)
  const [confirmDialog, setConfirmDialog] = useState<{ userId: string; newRole: 'user' | 'admin' } | null>(null)

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const handleRoleChange = (userId: string, newRole: 'user' | 'admin') => {
    setConfirmDialog({ userId, newRole })
  }

  const confirmRoleChange = () => {
    if (!confirmDialog) return
    setChangingUserId(confirmDialog.userId)
    startTransition(async () => {
      await updateUserRole(confirmDialog.userId, confirmDialog.newRole)
      setChangingUserId(null)
      setConfirmDialog(null)
    })
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t('users.title')}</h1>
        <p className="mt-1 text-sm text-gray-600">
          {t('users.subtitle')}
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={t('users.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as 'all' | 'user' | 'admin')}
            className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none bg-white"
          >
            <option value="all">{t('users.allRoles')}</option>
            <option value="user">{t('users.role.user')}</option>
            <option value="admin">{t('users.role.admin')}</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('table.user')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('table.role')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('table.registeredAt')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('table.bookingsCount')}</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('table.actions')}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  {t('users.noUsers')}
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {user.avatar_url ? (
                          <Image
                            src={user.avatar_url}
                            alt={user.full_name ? `Profilbild von ${user.full_name}` : 'Benutzerbild'}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.full_name || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role === 'admin' ? t('users.role.admin') : t('users.role.user')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString('de-DE')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.booking_count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {isPending && changingUserId === user.id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-gray-400 inline" />
                    ) : (
                      <select
                        className="border rounded p-1 text-sm"
                        value={user.role || 'user'}
                        onChange={(e) => handleRoleChange(user.id, e.target.value as 'user' | 'admin')}
                      >
                        <option value="user">{t('users.role.user')}</option>
                        <option value="admin">{t('users.role.admin')}</option>
                      </select>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('users.changeRole')}</h3>
            <p className="text-gray-600 mb-6" dangerouslySetInnerHTML={{
              __html: t('users.changeRoleConfirm', {
                role: confirmDialog.newRole === 'admin' ? t('users.role.admin') : t('users.role.user')
              })
            }} />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDialog(null)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                {tCommon('actions.cancel')}
              </button>
              <button
                onClick={confirmRoleChange}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                {tCommon('actions.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
