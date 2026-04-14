'use client'
import { useState } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { formatMontant, formatDate } from '@/lib/utils'
import { ArrowDownLeft, ArrowUpRight, Search, Clock } from 'lucide-react'
import Input from '@/components/ui/Input'

const categorieEmoji: Record<string, string> = {
  Salaire: '💼', Courses: '🛒', Loisirs: '🎬', Transport: '🚆',
  Factures: '⚡', Virement: '↔️', Shopping: '🛍️', Santé: '💊', Logement: '🏠',
}

export default function TransactionList() {
  const { transactions, virementsEnCours } = useAuthStore()
  const [search, setSearch] = useState('')
  const [filtre, setFiltre] = useState<'tous' | 'debit' | 'credit'>('tous')

  const filtered = transactions.filter((t) => {
    const matchSearch = t.libelle.toLowerCase().includes(search.toLowerCase())
    const matchFiltre = filtre === 'tous' || t.type === filtre
    return matchSearch && matchFiltre
  })

  function isEnCours(transactionId: string): boolean {
    const v = virementsEnCours.find((v) => v.id === transactionId)
    if (!v) return false
    return Date.now() < v.dateCreditPrevue
  }

  function getTempsRestant(transactionId: string): string {
    const v = virementsEnCours.find((v) => v.id === transactionId)
    if (!v) return ''
    const restant = v.dateCreditPrevue - Date.now()
    if (restant <= 0) return 'Crédité'
    const h = Math.floor(restant / (1000 * 60 * 60))
    const m = Math.floor((restant % (1000 * 60 * 60)) / (1000 * 60))
    return `Crédit dans ${h}h ${m}m`
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Rechercher une opération..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search size={16} />}
          className="flex-1"
        />
        <div className="flex gap-2">
          {(['tous', 'debit', 'credit'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFiltre(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtre === f
                  ? 'bg-[#009B4E] text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {f === 'tous' ? 'Tous' : f === 'debit' ? 'Débits' : 'Crédits'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-50">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-400 py-12 text-sm">Aucune opération trouvée</p>
          ) : (
            filtered.map((t) => {
              const enCours = isEnCours(t.id)
              const tempsRestant = enCours ? getTempsRestant(t.id) : ''

              return (
                <div
                  key={t.id}
                  className={`flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors ${
                    enCours ? 'bg-amber-50/40' : ''
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-base flex-shrink-0">
                    {categorieEmoji[t.categorie] || '💳'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-gray-900 truncate">{t.libelle}</p>
                      {enCours && (
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0">
                          <Clock size={10} />
                          EN COURS
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">
                      {formatDate(t.date)} · {t.categorie}
                      {enCours && (
                        <span className="ml-2 text-amber-600 font-medium">{tempsRestant}</span>
                      )}
                    </p>
                  </div>
                  <div
                    className={`flex items-center gap-1 font-semibold text-sm flex-shrink-0 ${
                      t.type === 'credit' ? 'text-[#009B4E]' : enCours ? 'text-amber-700' : 'text-gray-800'
                    }`}
                  >
                    {t.type === 'credit' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                    {t.type === 'credit' ? '+' : '-'}{formatMontant(Math.abs(t.montant))}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}