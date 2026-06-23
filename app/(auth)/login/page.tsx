'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Delete, User } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { verifierCredentials, verifier2FA, MOCK_CREDENTIALS } from '@/lib/auth'
import { mockUser } from '@/lib/data'

function ClavierVirtuel({
  onPress,
  onDelete,
}: {
  onPress: (v: string) => void
  onDelete: () => void
}) {
  const melange = ['7','3','9','1','5','2','8','4','0','6']
  return (
    <div className="grid grid-cols-5 gap-2 mt-3">
      {melange.map((t, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onPress(t)}
          className="h-11 rounded-lg border border-gray-200 bg-white text-gray-800 font-semibold text-base hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
        >
          {t}
        </button>
      ))}
      <button
        type="button"
        onClick={onDelete}
        className="h-11 col-span-5 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm"
      >
        <Delete size={15} />
        Effacer
      </button>
    </div>
  )
}

function IndicateurCode({ longueur, total }: { longueur: number; total: number }) {
  return (
    <div className="flex justify-center gap-3 my-4">
      {Array.from({ length: total }).map((_, i) => (
        <div
key={i}
className="w-4 h-4 rounded-full border-2 transition-all"
style={{
  background: i < longueur ? '#E30613' : 'white',
  borderColor: i < longueur ? '#E30613' : '#d1d5db',
          }}
        />
      ))}
    </div>
  )
}

function PanneauDroit() {
  return (
    <div
      className="hidden lg:flex flex-col justify-between p-12 text-white relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #164194 0%, #1e56b3 50%, #2f6dd4 100%)',
      }}
    >
      {/* Cercles décoratifs */}
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10"
        style={{ background: 'rgba(255,255,255,0.3)' }} />
      <div className="absolute bottom-20 -left-10 w-48 h-48 rounded-full opacity-10"
        style={{ background: 'rgba(255,255,255,0.2)' }} />

      <div className="relative z-10">
        <h2 className="text-3xl font-bold leading-tight mb-3">
          credit mutuel,{' '}
          <span style={{ color: '#E30613' }}>citoyenne</span>
        </h2>
        <p className="text-blue-100 text-sm leading-relaxed max-w-xs">
          Parce que nous croyons qu'une banque doit agir pour la
          societe, nous accompagnons vos projets avec une vision
          durable et solidaire.
        </p>
      </div>

      {/* Cards du bas */}
      <div className="relative z-10 grid grid-cols-2 gap-4 mt-8">
        <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mb-2">
            <Shield size={16} className="text-white" />
          </div>
          <p className="text-white font-semibold text-sm">Espace Assurance</p>
          <p className="text-red-100 text-xs mt-1">
            Gerez vos contrats et declarez vos sinistres en quelques clics.
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mb-2">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="white">
              <rect x="5" y="2" width="14" height="20" rx="2" stroke="white" strokeWidth="2" fill="none"/>
              <circle cx="12" cy="17" r="1" fill="white"/>
            </svg>
          </div>
          <p className="text-white font-semibold text-sm">Appli Mobile</p>
          <p className="text-red-100 text-xs mt-1">
            Votre banque vous suit partout, en toute securite.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuthStore()
  const [etape, setEtape] = useState<'identifiant' | 'password' | '2fa'>('identifiant')
  const [identifiant, setIdentifiant] = useState('')
  const [password, setPassword] = useState('')
  const [code2fa, setCode2fa] = useState('')
  const [memoriser, setMemoriser] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleIdentifiant(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (identifiant.length !== 10) {
      setError("L'identifiant doit contenir 10 chiffres")
      return
    }
    setEtape('password')
  }

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password.length !== 6) {
      setError('Le mot de passe doit contenir 6 chiffres')
      return
    }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    if (verifierCredentials(identifiant, password)) {
      setEtape('2fa')
    } else {
      setError('Identifiant ou mot de passe incorrect')
      setPassword('')
    }
    setLoading(false)
  }

  async function handle2FA(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    if (verifier2FA(code2fa)) {
      login(mockUser)
      useAuthStore.getState().verifierVirementsExpires()
      document.cookie = 'bnp-auth=true; path=/; max-age=86400; SameSite=Lax'
      router.push('/dashboard')
    } else {
      setError('Code incorrect')
      setCode2fa('')
      setLoading(false)
    }
  }

  const PanneauGauche = ({ children }: { children: React.ReactNode }) => (
    <div className="flex flex-col justify-center px-8 py-10 lg:px-12">
      {/* Header logo */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
        <p className='w-20 h-20'><img src="https://www.pagesjaunes.fr/media/agc/76/21/2e/00/00/3a/c3/f7/51/d7/697b76212e00003ac3f751d7/697b76212e00003ac3f751d8.jpg" alt="" /></p>
          <span className="font-bold text-gray-900 text-lg tracking-tight">
            CREDIT MUTUEL
          </span>
        </div>
      </div>
      {children}
      {/* Footer */}
      <p className="text-xs text-gray-400 mt-8 text-center lg:text-left">
        Credit Mutuel · SA a Directoire et Conseil de Surveillance
      </p>
    </div>
  )

  // ── 2FA ───────────────────────────────────
  if (etape === '2fa') {
    return (
      <div className="min-h-screen grid lg:grid-cols-2 bg-gray-50">
        <PanneauGauche>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Verification</h2>
            <p className="text-sm text-gray-500">
              Code envoye par SMS au +33 7 xx xx xx 03
            </p>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 mb-5">
            <Shield size={15} className="text-[#164194] flex-shrink-0" />
            <p className="text-xs text-[#164194]">
              Saisissez le code recu par SMS
            </p>
          </div>
          <form onSubmit={handle2FA} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Code (6 chiffres)
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="• • • • • •"
                value={code2fa}
                onChange={(e) => setCode2fa(e.target.value.replace(/\D/g, ''))}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-center text-2xl font-mono tracking-widest focus:outline-none focus:border-[#003189] transition-colors"
              />
            </div>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg text-center">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={code2fa.length !== 6 || loading}
              className="w-full text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
              style={{ background: '#164194' }}
            >
              {loading ? 'Verification...' : 'Valider'}
            </button>
            <button
              type="button"
              onClick={() => { setEtape('password'); setCode2fa(''); setError('') }}
              className="w-full text-sm text-gray-400 hover:text-gray-600 py-1"
            >
              Retour
            </button>
          </form>

        </PanneauGauche>
        <PanneauDroit />
      </div>
    )
  }

  // ── Mot de passe ──────────────────────────
  if (etape === 'password') {
    return (
      <div className="min-h-screen grid lg:grid-cols-2 bg-gray-50">
        <PanneauGauche>
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Bonjour,</h2>
            <p className="text-sm text-gray-500">
              Saisissez votre mot de passe a 6 chiffres.
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 flex items-center gap-2 mb-4">
            <User size={14} className="text-gray-400" />
            <span className="text-sm text-gray-600 font-mono">
              {identifiant.slice(0, 3)}xxxxxxx
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Mot de passe (6 chiffres)
            </label>
            <IndicateurCode longueur={password.length} total={6} />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg text-center mb-2">
              {error}
            </p>
          )}

          <ClavierVirtuel
            onPress={(v) => {
              if (password.length < 6) setPassword((p) => p + v)
            }}
            onDelete={() => setPassword((p) => p.slice(0, -1))}
          />

          <button
            type="button"
            onClick={handlePassword}
            disabled={password.length !== 6 || loading}
            className="w-full mt-4 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
            style={{ background: '#164194' }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>

          <button
            type="button"
            onClick={() => { setEtape('identifiant'); setPassword(''); setError('') }}
            className="w-full text-sm text-center mt-3"
            style={{ color: '#164194' }}
          >
            Mot de passe oublie ?
          </button>


        </PanneauGauche>
        <PanneauDroit />
      </div>
    )
  }

  // ── Identifiant ───────────────────────────
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gray-50">
      <PanneauGauche>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Bonjour,</h2>
          <p className="text-sm text-gray-500">
            Saisissez votre identifiant pour acceder a vos comptes.
          </p>
        </div>

        <form onSubmit={handleIdentifiant} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Identifiant (10 chiffres)
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                maxLength={10}
                placeholder="Ex: 1234567890"
                value={identifiant}
                onChange={(e) => setIdentifiant(e.target.value.replace(/\D/g, ''))}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-base font-mono tracking-widest focus:outline-none focus:border-[#164194] transition-colors pr-10"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <User size={16} className="text-gray-400" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Memoriser mon identifiant</span>
            <button
              type="button"
              onClick={() => setMemoriser(!memoriser)}
              className="w-11 h-6 rounded-full transition-colors flex items-center px-0.5"
              style={{ background: memoriser ? '#164194' : '#e5e7eb' }}
            >
              <span
                className="w-5 h-5 bg-white rounded-full shadow transition-transform"
                style={{ transform: memoriser ? 'translateX(20px)' : 'translateX(0)' }}
              />
            </button>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={identifiant.length !== 10}
            className="w-full text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: '#164194' }}
          >
            Continuer
          </button>

          
        </form>

        
      </PanneauGauche>

      <PanneauDroit />
    </div>
  )
}