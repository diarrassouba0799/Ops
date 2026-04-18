'use client'
import { useEffect } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import MobileNav from '@/components/layout/MobileNav'
import CompteVerification from '@/components/CompteVerification'
import { useAuthStore } from '@/store/useAuthStore'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { verifierVirementsExpires, compteEnVerification } = useAuthStore()

  useEffect(() => {
    verifierVirementsExpires()
    const interval = setInterval(() => {
      verifierVirementsExpires()
    }, 10_000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
        {children}
      </main>
      <MobileNav />
      {compteEnVerification && <CompteVerification />}
    </div>
  )
}