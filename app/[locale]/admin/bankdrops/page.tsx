import { createSupabaseServer } from '@/lib/supabase/server'
import { BankdropsClient } from './bankdrops-client'

export const metadata = { title: 'Bankkonten – Admin' }

export default async function AdminBankdropsPage() {
  const supabase = await createSupabaseServer()

  const { data: accounts } = await supabase
    .from('bank_accounts')
    .select('*')
    .order('created_at', { ascending: false })

  return <BankdropsClient accounts={accounts ?? []} />
}
