'use client'
import { useState } from 'react'
import { ShieldAlert, X, Shield } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { formatMontant } from '@/lib/utils'
import Button from '@/components/ui/Button'
import { verifier2FA } from '@/lib/auth'
import Input from '@/components/ui/Input'

export default function AlerteSecurite() {
  const { alerteSecurite, setAlerteSecurite } = useAuthStore()
  const [showForm, setShowForm] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!alerteSecurite?.active) return null

  async function handleDebloquer(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    if (verifier2FA(code)) {
      setAlerteSecurite(null)
    } else {
      setError('Code incorrect')
    }
    setLoading(false)
  }

  return (
    <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 space-y-3">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
          <ShieldAlert size={18} className="text-amber-600" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-amber-900 text-sm">Surveillance de sécurité renforcée</p>
          <p className="text-xs text-amber-700 mt-0.5">
            Un virement inhabituel de <strong>{formatMontant(alerteSecurite.montant)}</strong> vers{' '}
            <strong>{alerteSecurite.beneficiaire}</strong> a été détecté. Votre espace est en mode surveillance.
          </p>
        </div>
      </div>

      {!showForm ? (
        <div className="flex gap-2 ml-12">
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Shield size={14} className="mr-1.5" /> Valider avec SMS
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setAlerteSecurite(null)}>
            <X size={14} className="mr-1" /> Ignorer
          </Button>
        </div>
      ) : (
        <form onSubmit={handleDebloquer} className="ml-12 flex gap-2 items-end">
          <Input
            label="Code SMS de confirmation"
            placeholder="123456"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            error={error}
          />
          <Button type="submit" size="sm" loading={loading} className="mb-0.5 flex-shrink-0">
            Valider
          </Button>
        </form>
      )}
    </div>
  )
}