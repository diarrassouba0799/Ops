'use client'
import { useState, useEffect } from 'react'
import { CheckCircle, AlertCircle, Shield, ArrowRight, Clock } from 'lucide-react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useAuthStore } from '@/store/useAuthStore'
import { formatMontant } from '@/lib/utils'
import { verifierCodeVirement } from '@/lib/auth'
import { startVirementWorker, stopVirementWorker, onVirementExpire } from '@/lib/virementWorker'

type Etape = 'formulaire' | 'confirmation' | '2fa' | 'succes'

function Compte48h({
  dateEnvoi,
  onExpire,
}: {
  dateEnvoi: number
  onExpire: () => void
}) {
  const dateCible = dateEnvoi + 48 * 60 * 60 * 1000
  const [restant, setRestant] = useState(dateCible - Date.now())
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    if (restant <= 0 && !expired) {
      setExpired(true)
      onExpire()
      return
    }

    const interval = setInterval(() => {
      const r = dateCible - Date.now()
      setRestant(r)
      if (r <= 0) {
        clearInterval(interval)
        if (!expired) {
          setExpired(true)
          onExpire()
        }
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [dateCible, expired, onExpire, restant])

  if (restant <= 0) {
    return <span className="text-green-600 font-semibold">Crédité</span>
  }

  const heures = Math.floor(restant / (1000 * 60 * 60))
  const minutes = Math.floor((restant % (1000 * 60 * 60)) / (1000 * 60))
  const secondes = Math.floor((restant % (1000 * 60)) / 1000)

  return (
    <span className="font-mono font-semibold text-amber-700">
      {String(heures).padStart(2, '0')}h {String(minutes).padStart(2, '0')}m{' '}
      {String(secondes).padStart(2, '0')}s
    </span>
  )
}

export default function VirementForm() {
  const {
    solde,
    retirerMontant,
    setAlerteSecurite,
    ajouterTransaction,
    ajouterVirementEnCours,
    setCompteEnVerification,
  } = useAuthStore()

  const [etape, setEtape] = useState<Etape>('formulaire')
  const [form, setForm] = useState({
    beneficiaire: '',
    iban: '',
    montant: '',
    motif: '',
  })
  const [code2fa, setCode2fa] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [reference, setReference] = useState('')
  const [dateEnvoi, setDateEnvoi] = useState(0)

  const montantNum = parseFloat(form.montant) || 0
  const estInhabituel = montantNum > 500

  useEffect(() => {
    const unsubscribe = onVirementExpire((virement) => {
      localStorage.removeItem('virement_en_cours')
      setCompteEnVerification(true, {
        id: virement.id,
        beneficiaire: virement.beneficiaire,
        montant: virement.montant,
        motif: virement.motif,
        dateEnvoi: virement.dateEnvoi,
        dateCreditPrevue: virement.dateEnvoi + 48 * 60 * 60 * 1000,
      })
      stopVirementWorker()
    })
    return unsubscribe
  }, [setCompteEnVerification])

  useEffect(() => {
    const stored = localStorage.getItem('virement_en_cours')
    if (!stored) return

    const virement = JSON.parse(stored)
    const dateCreditPrevue = virement.dateEnvoi + 48 * 60 * 60 * 1000

    if (Date.now() >= dateCreditPrevue) {
      localStorage.removeItem('virement_en_cours')
      setCompteEnVerification(true, {
        id: virement.id,
        beneficiaire: virement.beneficiaire,
        montant: virement.montant,
        motif: virement.motif,
        dateEnvoi: virement.dateEnvoi,
        dateCreditPrevue: dateCreditPrevue,
      })
    } else {
      setForm({
        beneficiaire: virement.beneficiaire,
        iban: '',
        montant: String(virement.montant),
        motif: virement.motif,
      })
      setReference(virement.id)
      setDateEnvoi(virement.dateEnvoi)
      setEtape('succes')
      startVirementWorker({
        id: virement.id,
        beneficiaire: virement.beneficiaire,
        montant: virement.montant,
        motif: virement.motif,
        dateEnvoi: virement.dateEnvoi,
      })
    }
  }, [setCompteEnVerification])

  function validate(): boolean {
    const e: Record<string, string> = {}
    if (!form.beneficiaire.trim()) e.beneficiaire = 'Nom du bénéficiaire requis'
    if (!form.iban.trim() || form.iban.replace(/\s/g, '').length < 14)
      e.iban = 'IBAN invalide (minimum 14 caractères)'
    if (!form.montant || montantNum <= 0) e.montant = 'Montant invalide'
    if (montantNum > solde)
      e.montant = `Solde insuffisant (disponible : ${formatMontant(solde)})`
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSoumettre(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setEtape('confirmation')
  }

  async function handleValider2FA(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))

    if (!verifierCodeVirement(code2fa)) {
      setErrors({ code: 'Code incorrect. Réessayez.' })
      setLoading(false)
      return
    }

    const maintenant = Date.now()
    const ref = `VIR-${maintenant}`
    const dateStr = new Date().toISOString().split('T')[0]

    await retirerMontant(montantNum)
    await ajouterTransaction({
      id: ref,
      date: dateStr,
      libelle: `VIREMENT VERS ${form.beneficiaire.toUpperCase()}${form.motif ? ' - ' + form.motif : ''}`,
      montant: -montantNum,
      type: 'debit',
      categorie: 'Virement',
      compteId: 'c1',
    })
    await ajouterVirementEnCours({
      id: ref,
      beneficiaire: form.beneficiaire,
      montant: montantNum,
      motif: form.motif,
      dateEnvoi: maintenant,
      dateCreditPrevue: maintenant + 48 * 60 * 60 * 1000,
    })

    localStorage.setItem(
      'virement_en_cours',
      JSON.stringify({
        id: ref,
        beneficiaire: form.beneficiaire,
        montant: montantNum,
        motif: form.motif,
        dateEnvoi: maintenant,
      })
    )

    await startVirementWorker({
      id: ref,
      beneficiaire: form.beneficiaire,
      montant: montantNum,
      motif: form.motif,
      dateEnvoi: maintenant,
    })

    if (estInhabituel) {
      setAlerteSecurite({
        active: true,
        montant: montantNum,
        beneficiaire: form.beneficiaire,
      })
    }

    setReference(ref)
    setDateEnvoi(maintenant)
    setEtape('succes')
    setLoading(false)
  }

  function handleExpiration() {
    const dateCreditPrevue = dateEnvoi + 48 * 60 * 60 * 1000
    localStorage.removeItem('virement_en_cours')
    stopVirementWorker()
    setCompteEnVerification(true, {
      id: reference,
      beneficiaire: form.beneficiaire,
      montant: montantNum,
      motif: form.motif,
      dateEnvoi: dateEnvoi,
      dateCreditPrevue: dateCreditPrevue,
    })
  }

  // ── Succes ────────────────────────────────
  if (etape === 'succes') {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 space-y-5">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle size={36} className="text-[#00915A]" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Virement envoyé !</h3>
          <p className="text-gray-500 text-sm">
            {formatMontant(montantNum)} débités vers{' '}
            <strong>{form.beneficiaire}</strong>
          </p>
          <p className="text-xs text-gray-400 bg-gray-50 rounded-lg px-4 py-2 font-mono">
            {reference}
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-amber-600" />
            <p className="font-semibold text-amber-900 text-sm">Crédit prévu dans</p>
          </div>
          <div className="text-2xl text-center py-2">
            {dateEnvoi > 0 && (
              <Compte48h dateEnvoi={dateEnvoi} onExpire={handleExpiration} />
            )}
          </div>
          <div className="w-full bg-amber-100 rounded-full h-1.5">
            <div className="bg-amber-500 h-1.5 rounded-full w-full animate-pulse" />
          </div>
          <p className="text-xs text-amber-700 text-center">
            Le virement sera crédité sur le compte de{' '}
            <strong>{form.beneficiaire}</strong> dans les 48 heures.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 space-y-1 text-xs text-gray-500">
          <p>Solde débité immédiatement</p>
          <p>Transaction enregistrée dans votre historique</p>
          <p>Crédit sur le compte bénéficiaire : sous 48h ouvrées</p>
        </div>

        <Button
          className="w-full"
          style={{ backgroundColor: '#00915A' }}
          onClick={() => {
            localStorage.removeItem('virement_en_cours')
            stopVirementWorker()
            setEtape('formulaire')
            setForm({ beneficiaire: '', iban: '', montant: '', motif: '' })
            setCode2fa('')
            setErrors({})
          }}
        >
          Nouveau virement
        </Button>
      </div>
    )
  }

  // ── 2FA ───────────────────────────────────
  if (etape === '2fa') {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
            <Shield size={20} className="text-[#00915A]" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Confirmation par SMS</h3>
            <p className="text-xs text-gray-500">Code envoyé au +33 6 xx xx xx 42</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">
            Récapitulatif
          </p>
          <div className="flex justify-between">
            <span className="text-gray-500">Bénéficiaire</span>
            <span className="font-medium">{form.beneficiaire}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Montant</span>
            <span className="font-semibold text-gray-900">{formatMontant(montantNum)}</span>
          </div>
          {form.motif && (
            <div className="flex justify-between">
              <span className="text-gray-500">Motif</span>
              <span>{form.motif}</span>
            </div>
          )}
        </div>

        <form onSubmit={handleValider2FA} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Code de confirmation (6 chiffres)
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={code2fa}
              onChange={(e) => setCode2fa(e.target.value.replace(/\D/g, ''))}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-center text-xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-[#00915A] focus:border-transparent"
            />
          </div>
          {errors.code && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg text-center">
              {errors.code}
            </p>
          )}
          <button
            type="submit"
            disabled={code2fa.length !== 6 || loading}
            className="w-full bg-[#00915A] hover:bg-[#006B42] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors"
          >
            {loading ? 'Validation...' : 'Confirmer le virement'}
          </button>
          <button
            type="button"
            onClick={() => setEtape('confirmation')}
            className="w-full text-sm text-gray-400 hover:text-gray-600 py-1"
          >
            Retour
          </button>
        </form>
      </div>
    )
  }

  // ── Confirmation ──────────────────────────
  if (etape === 'confirmation') {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
        <h3 className="font-semibold text-gray-900 pb-4 border-b border-gray-100">
          Confirmer le virement
        </h3>
        <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">De</p>
            <p className="font-medium text-sm">Compte Courant</p>
            <p className="text-xs text-gray-500">{formatMontant(solde)} disponible</p>
          </div>
          <ArrowRight size={20} className="text-gray-400" />
          <div className="text-right">
            <p className="text-xs text-gray-400 mb-0.5">Vers</p>
            <p className="font-medium text-sm">{form.beneficiaire}</p>
            <p className="text-xs text-gray-500 font-mono">{form.iban.slice(0, 12)}...</p>
          </div>
        </div>
        <div className="text-center py-2">
          <p className="text-3xl font-bold text-gray-900">{formatMontant(montantNum)}</p>
          {form.motif && (
            <p className="text-sm text-gray-400 mt-1">"{form.motif}"</p>
          )}
        </div>
        {estInhabituel && (
          <div className="flex gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
            <AlertCircle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">
              <strong>Virement inhabituel</strong> — Une vérification SMS sera requise.
            </p>
          </div>
        )}
        <div className="flex gap-3">
          <button
            onClick={() => setEtape('formulaire')}
            className="flex-1 border border-gray-300 text-gray-700 font-medium py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Modifier
          </button>
          <button
            onClick={() => setEtape('2fa')}
            className="flex-1 bg-[#00915A] hover:bg-[#006B42] text-white font-medium py-2.5 rounded-xl transition-colors"
          >
            Continuer
          </button>
        </div>
      </div>
    )
  }

  // ── Formulaire ────────────────────────────
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="mb-6 pb-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">Émettre un virement</h3>
        <p className="text-xs text-gray-500 mt-0.5">
          Solde disponible :{' '}
          <span className="font-semibold text-[#00915A]">{formatMontant(solde)}</span>
        </p>
      </div>
      <form onSubmit={handleSoumettre} className="space-y-5">
        <Input
          label="Nom du bénéficiaire"
          placeholder="Jean Martin"
          value={form.beneficiaire}
          onChange={(e) => setForm({ ...form, beneficiaire: e.target.value })}
          error={errors.beneficiaire}
        />
        <Input
          label="IBAN"
          placeholder="FR76 3000 4028 3798 ..."
          value={form.iban}
          onChange={(e) => setForm({ ...form, iban: e.target.value })}
          error={errors.iban}
        />
        <Input
          label="Montant (EUR)"
          type="number"
          placeholder="0.00"
          min="0.01"
          step="0.01"
          value={form.montant}
          onChange={(e) => setForm({ ...form, montant: e.target.value })}
          error={errors.montant}
        />
        <Input
          label="Motif (facultatif)"
          placeholder="Remboursement restaurant..."
          value={form.motif}
          onChange={(e) => setForm({ ...form, motif: e.target.value })}
        />
        <div className="flex gap-2 bg-green-50 border border-green-100 rounded-lg p-3">
          <AlertCircle size={15} className="text-[#00915A] flex-shrink-0 mt-0.5" />
          <p className="text-xs text-[#00915A]">
            Vérifiez l'IBAN avant de valider. Les virements sont définitifs.
          </p>
        </div>
        <button
          type="submit"
          className="w-full bg-[#00915A] hover:bg-[#006B42] text-white font-medium py-3 rounded-xl transition-colors"
        >
          Vérifier le virement
        </button>
      </form>
    </div>
  )
}