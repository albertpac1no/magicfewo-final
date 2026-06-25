'use client'

import { useState, useTransition } from 'react'
import { Wallet, Plus, Search, Filter, Pencil, Trash2, Loader2, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import {
  createBankAccount,
  updateBankAccount,
  deleteBankAccount,
  toggleBankAccountStatus,
} from '@/app/actions/admin'
import type { BankAccount } from '@/lib/types'

function maskIban(iban: string) {
  if (iban.length <= 8) return iban
  return iban.substring(0, 4) + ' **** **** ' + iban.substring(iban.length - 4)
}

export function BankdropsClient({ accounts }: { accounts: BankAccount[] }) {
  const t = useTranslations('admin')
  const tCommon = useTranslations('common')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [isPending, startTransition] = useTransition()
  const [actionId, setActionId] = useState<string | null>(null)

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  // Confirm delete
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch =
      account.account_holder.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.iban.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.bank_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && account.is_active) ||
      (statusFilter === 'inactive' && !account.is_active)
    return matchesSearch && matchesStatus
  })

  const handleAdd = () => {
    setEditingAccount(null)
    setFormError(null)
    setIsModalOpen(true)
  }

  const handleEdit = (account: BankAccount) => {
    setEditingAccount(account)
    setFormError(null)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    setActionId(id)
    startTransition(async () => {
      const result = await deleteBankAccount(id)
      if (result.error) setFormError(result.error)
      setActionId(null)
      setDeleteConfirm(null)
    })
  }

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    setActionId(id)
    startTransition(async () => {
      await toggleBankAccountStatus(id, !currentStatus)
      setActionId(null)
    })
  }

  const handleFormSubmit = async (formData: FormData) => {
    setFormError(null)
    startTransition(async () => {
      let result
      if (editingAccount) {
        result = await updateBankAccount(editingAccount.id, formData)
      } else {
        result = await createBankAccount(formData)
      }
      if (result.error) {
        setFormError(result.error)
      } else {
        setIsModalOpen(false)
      }
    })
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t('bankdrops.title')}</h1>
        <p className="mt-1 text-sm text-gray-600">
          {t('bankdrops.subtitle')}
        </p>
      </div>

      {/* Actions */}
      <div className="mb-6">
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          {t('bankdrops.addAccount')}
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={t('bankdrops.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
            className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none bg-white"
          >
            <option value="all">{t('bankdrops.allStatus')}</option>
            <option value="active">{t('bankdrops.active')}</option>
            <option value="inactive">{t('bankdrops.inactive')}</option>
          </select>
        </div>
      </div>

      {accounts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {t('bankdrops.noAccounts')}
          </h2>
          <p className="text-gray-600 mb-6">
            {t('bankdrops.noAccountsDesc')}
          </p>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 inline-flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            {t('bankdrops.addBankAccount')}
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('table.accountHolder')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('table.iban')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('table.bic')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('table.bankName')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('table.status')}</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('table.actions')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAccounts.map((account) => (
                <tr key={account.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {account.account_holder}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                    {maskIban(account.iban)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                    {account.bic}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {account.bank_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleStatus(account.id, account.is_active)}
                      disabled={isPending && actionId === account.id}
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full cursor-pointer ${
                        account.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {isPending && actionId === account.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        account.is_active ? t('bankdrops.active') : t('bankdrops.inactive')
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(account)}
                      className="text-primary hover:text-primary/80 mr-3"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(account.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Bank Account Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingAccount ? t('bankdrops.editAccount') : t('bankdrops.newAccount')}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {formError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {formError}
                </div>
              )}

              <form action={handleFormSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('table.accountHolder')}*</label>
                  <input
                    name="account_holder"
                    type="text"
                    defaultValue={editingAccount?.account_holder || ''}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('table.iban')}*</label>
                  <input
                    name="iban"
                    type="text"
                    defaultValue={editingAccount?.iban || ''}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('table.bic')}*</label>
                  <input
                    name="bic"
                    type="text"
                    defaultValue={editingAccount?.bic || ''}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('table.bankName')}*</label>
                  <input
                    name="bank_name"
                    type="text"
                    defaultValue={editingAccount?.bank_name || ''}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    required
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="hidden"
                    name="is_active"
                    value={editingAccount?.is_active !== false ? 'true' : 'false'}
                  />
                  <input
                    type="checkbox"
                    id="is_active_checkbox"
                    defaultChecked={editingAccount?.is_active !== false}
                    onChange={(e) => {
                      const hidden = e.target.previousElementSibling as HTMLInputElement
                      if (hidden) hidden.value = e.target.checked ? 'true' : 'false'
                    }}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="is_active_checkbox" className="ml-2 block text-sm text-gray-900">
                    {t('bankdrops.accountActive')}
                  </label>
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900"
                  >
                    {tCommon('actions.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
                  >
                    {isPending ? (
                      <span className="flex items-center">
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        {tCommon('saving')}
                      </span>
                    ) : (
                      tCommon('actions.save')
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('bankdrops.deleteTitle')}</h3>
            <p className="text-gray-600 mb-6">
              {t('bankdrops.deleteConfirm')}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                {tCommon('actions.cancel')}
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                {tCommon('actions.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
