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
    <div className="bg-gradient-to-br from-[#009B4E] to-[#006633] rounded-2xl p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-green-100 text-sm">{compte.libelle}</p>
          <p className="text-xs text-green-200 mt-0.5 font-mono">{compte.iban.slice(0, 14)}...</p>
        </div>
        <button onClick={() => setVisible(!visible)}
          className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
          {visible ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
      </div>
      <div className="mb-4">
        <p className="text-green-100 text-xs mb-1">Solde disponible</p>
        <p className="text-3xl font-bold tracking-tight">
          {visible ? formatMontant(solde) : '•••• €'}
        </p>
      </div>
      <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 w-fit">
        <TrendingUp size={14} />
        <span className="text-xs">+2 800,00 € ce mois</span>
      </div>
    </div>
  )
}