'use client'

import { useState } from 'react'
import { DashboardTopbar } from '@/components/layout/DashboardTopbar'
import { DashboardSidebar } from '@/components/layout/DashboardSidebar'
import type { Profile } from '@/lib/types'

interface DashboardShellProps {
  profile: Profile | null
  email: string
  isAdmin: boolean
  children: React.ReactNode
}

export function DashboardShell({ profile, email, isAdmin, children }: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardTopbar
        profile={profile}
        email={email}
        isAdmin={isAdmin}
        onMenuClick={() => setMobileOpen(true)}
      />
      <DashboardSidebar
        profile={profile}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <main className="lg:pl-64 pt-16 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
