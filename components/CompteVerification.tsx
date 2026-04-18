'use client'
import { useEffect, useState } from 'react'
import { ShieldAlert, Phone, MapPin, Clock } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { formatMontant } from '@/lib/utils'

export default function CompteVerification() {
  const { compteEnVerification, virementVerification } = useAuthStore()
  const [dots, setDots] = useState('.')

  useEffect(() => {
    if (!compteEnVerification) return
    const i = setInterval(() =>
      setDots((d) => (d.length >= 3 ? '.' : d + '.')), 700
    )
    return () => clearInterval(i)
  }, [compteEnVerification])

  if (!compteEnVerification) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto"
      style={{ background: 'rgba(15, 15, 15, 0.97)' }}
    >
      <div className="w-full max-w-md py-8 space-y-6">

        {/* Icône + animation */}
        <div className="flex justify-center">
          <div className="relative w-24 h-24">
            <div className="w-24 h-24 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center">
              <ShieldAlert size={42} className="text-gray-400" />
            </div>
            <div
              className="absolute inset-0 rounded-full border-2 border-transparent border-t-amber-500 animate-spin"
              style={{ animationDuration: '2.5s' }}
            />
          </div>
        </div>

        {/* Titre */}
        <div className="text-center space-y-2 px-2">
          <h1 className="text-xl font-semibold text-white">
            Compte en vérification{dots}
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Votre compte est temporairement suspendu. Nos équipes
            procèdent à une vérification de sécurité automatique.
          </p>
        </div>

        {/* Détail du virement */}
        {virementVerification && (
          <div className="bg-gray-800/80 rounded-xl border border-gray-700 p-5 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Clock size={13} className="text-amber-400" />
              <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider">
                Virement concerné
              </p>
            </div>
            <div className="flex justify-between text-sm border-b border-gray-700 pb-2">
              <span className="text-gray-400">Bénéficiaire</span>
              <span className="text-white font-medium">
                {virementVerification.beneficiaire}
              </span>
            </div>
            <div className="flex justify-between text-sm border-b border-gray-700 pb-2">
              <span className="text-gray-400">Montant</span>
              <span className="text-white font-medium">
                {formatMontant(virementVerification.montant)}
              </span>
            </div>
            {virementVerification.motif && (
              <div className="flex justify-between text-sm border-b border-gray-700 pb-2">
                <span className="text-gray-400">Motif</span>
                <span className="text-white">{virementVerification.motif}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Référence</span>
              <span className="text-gray-300 font-mono text-[11px]">
                {virementVerification.id}
              </span>
            </div>
          </div>
        )}

        {/* Explication */}
        <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl p-4">
          <p className="text-amber-300 text-sm font-medium mb-1">
            Pourquoi mon compte est bloqué ?
          </p>
          <p className="text-amber-200/60 text-xs leading-relaxed">
            Suite au traitement de votre virement, une vérification
            automatique a été déclenchée par notre système de sécurité.
            Cette procédure est standard et vise à protéger vos fonds.
          </p>
        </div>

        {/* Actions pour débloquer */}
        <div className="space-y-2">
          <p className="text-gray-500 text-xs uppercase tracking-wider text-center mb-3">
            Pour débloquer votre compte
          </p>

          <div className="flex items-center gap-4 bg-gray-800/60 rounded-xl border border-gray-700 p-4">
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
              <Phone size={18} className="text-[#009B4E]" />
            </div>
            <div>
              <p className="text-white text-sm font-medium">Appelez le 3900</p>
              <p className="text-gray-400 text-xs mt-0.5">
                Service disponible 7j/7 · 8h–22h
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-gray-800/60 rounded-xl border border-gray-700 p-4">
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin size={18} className="text-[#009B4E]" />
            </div>
            <div>
              <p className="text-white text-sm font-medium">
                Rendez-vous en agence
              </p>
              <p className="text-gray-400 text-xs mt-0.5">
                Présentez-vous avec une pièce d'identité
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-xs pb-4">
          BNP Paribas · Sécurité ·{' '}
          Réf. {virementVerification?.id?.slice(-10)}
        </p>
      </div>
    </div>
  )
}