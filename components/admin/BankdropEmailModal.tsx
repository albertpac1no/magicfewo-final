'use client'

import { useState, useEffect } from 'react'
import { X, Loader2, AlertCircle, Send, Building2, User, Wallet, Copy, Check } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { createSupabaseClient } from '@/lib/supabase/client'
import type { BankAccount } from '@/lib/types'

interface BankdropEmailModalProps {
  isOpen: boolean
  onClose: () => void
  bookingId: string
  guestEmail: string
  guestName: string
  amount: number
}

export function BankdropEmailModal({
  isOpen,
  onClose,
  bookingId,
  guestEmail,
  guestName,
  amount,
}: BankdropEmailModalProps) {
  const t = useTranslations('admin')
  const tCommon = useTranslations('common')
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [selectedAccount, setSelectedAccount] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    const supabase = createSupabaseClient()
    supabase
      .from('bank_accounts')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        const accs = (data as BankAccount[]) || []
        setAccounts(accs)
        if (accs.length > 0) setSelectedAccount(accs[0].id)
      })
  }, [isOpen])

  const selectedBankAccount = accounts.find((acc) => acc.id === selectedAccount)

  const emailText = selectedBankAccount
    ? `Sehr geehrte/r ${guestName},

vielen Dank für Ihre Buchung. Bitte überweisen Sie den folgenden Betrag:

Betrag: ${amount} €
Verwendungszweck: Buchung ${bookingId.substring(0, 8)}

Bankverbindung:
Kontoinhaber: ${selectedBankAccount.account_holder}
IBAN: ${selectedBankAccount.iban}
BIC: ${selectedBankAccount.bic}
Bank: ${selectedBankAccount.bank_name}

Mit freundlichen Grüßen`
    : ''

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(emailText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setError(t('bankdrops.copyFailed'))
    }
  }

  const handleSend = async () => {
    if (!selectedBankAccount) {
      setError(t('bankdrops.selectAccountError'))
      return
    }

    setSending(true)
    setError(null)

    try {
      const webhookUrl = process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL
      if (!webhookUrl) {
        // No webhook configured — just copy
        await handleCopy()
        setSending(false)
        return
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking_id: bookingId,
          customer_name: guestName,
          customer_email: guestEmail,
          amount,
          bank_account: {
            holder: selectedBankAccount.account_holder,
            iban: selectedBankAccount.iban,
            bic: selectedBankAccount.bic,
            bank_name: selectedBankAccount.bank_name,
          },
        }),
      })

      if (!response.ok) throw new Error(t('bankdrops.emailSendError'))
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : t('bankdrops.errorOccurred'))
    } finally {
      setSending(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {t('bankdrops.sendPaymentInfo')}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-200 rounded-xl p-4 mb-6 flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Customer Information */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 text-primary mr-2" />
                {t('bankdrops.customerInfo')}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">{tCommon('name')}</div>
                  <div className="font-medium">{guestName}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">{tCommon('email')}</div>
                  <div className="font-medium">{guestEmail}</div>
                </div>
              </div>
            </div>

            {/* Bank Account Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Building2 className="w-5 h-5 text-primary mr-2" />
                {t('bankdrops.selectAccount')}
              </label>
              <select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.bank_name} - {account.account_holder}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Preview */}
            <div className="bg-primary/5 rounded-xl p-4">
              <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                <Wallet className="w-5 h-5 text-primary mr-2" />
                {t('bankdrops.paymentPreview')}
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <div className="text-gray-600">{tCommon('amount')}</div>
                  <div className="text-xl font-bold text-primary">{amount} €</div>
                </div>
                {selectedBankAccount && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="text-gray-600">{t('table.accountHolder')}</div>
                      <div className="font-medium">{selectedBankAccount.account_holder}</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-gray-600">{t('table.iban')}</div>
                      <div className="font-medium font-mono">{selectedBankAccount.iban}</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-gray-600">{t('table.bic')}</div>
                      <div className="font-medium font-mono">{selectedBankAccount.bic}</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-gray-600">{t('table.bankName')}</div>
                      <div className="font-medium">{selectedBankAccount.bank_name}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                {tCommon('actions.cancel')}
              </button>
              <button
                onClick={handleCopy}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Kopiert!' : 'Kopieren'}
              </button>
              <button
                onClick={handleSend}
                disabled={sending || !selectedBankAccount}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
              >
                {sending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t('bankdrops.sending')}
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    {t('bankdrops.sendEmail')}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
