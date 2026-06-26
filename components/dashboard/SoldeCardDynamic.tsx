'use client'
import { useState } from 'react'
import { Eye, EyeOff, TrendingUp } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { formatMontant } from '@/lib/utils'
import { mockComptes } from '@/lib/data'

export default function SoldeCardDynamic() {
  const { solde } = useAuthStore()
  const compte = mockComptes[0]
  const [visible, setVisible] = useState(true)

  return (
    <div
      className="relative rounded-2xl p-6 text-white overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #00915A 0%, #006B42 50%, #004d30 100%)',
        boxShadow: '0 8px 32px rgba(0, 145, 90, 0.35)',
      }}
    >
      {/* Cercles décoratifs */}
      <div
        className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-10"
        style={{ background: 'rgba(255,255,255,0.3)' }}
      />
      <div
        className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full opacity-10"
        style={{ background: 'rgba(255,255,255,0.2)' }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-green-100 text-sm font-medium">{compte.libelle}</p>
            <p className="text-xs text-green-200 mt-0.5 font-mono">
              {compte.iban.slice(0, 14)}...
            </p>
          </div>
          <button
            onClick={() => setVisible(!visible)}
            className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
          >
            {visible ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        </div>

        <div className="mb-5">
          <p className="text-green-100 text-xs mb-1">Solde disponible</p>
          <p className="text-4xl font-bold tracking-tight">
            {visible ? formatMontant(solde) : '•••••• €'}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 w-fit">
          <TrendingUp size={14} />
          <span className="text-xs font-medium">+2 800,00 EUR ce mois</span>
        </div>
      </div>
    </div>
  )
}