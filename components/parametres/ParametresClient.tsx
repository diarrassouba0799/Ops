'use client'
import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Camera, LogOut, Bell, Shield, Eye, EyeOff,
  Check, User, Mail, Phone
} from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function ParametresClient() {
  const router = useRouter()
  const { user, avatar, logout, setAvatar, updateUser } = useAuthStore()
  const fileRef = useRef<HTMLInputElement>(null)

  const [prenom, setPrenom] = useState(user?.prenom || '')
  const [nom, setNom] = useState(user?.nom || '')
  const [email, setEmail] = useState(user?.email || '')
  const [telephone, setTelephone] = useState('+33 6 12 34 56 78')
  const [saved, setSaved] = useState(false)

  const [notifVirement, setNotifVirement] = useState(true)
  const [notifConnexion, setNotifConnexion] = useState(true)
  const [notifPromo, setNotifPromo] = useState(false)

  const [showOldPass, setShowOldPass] = useState(false)
  const [showNewPass, setShowNewPass] = useState(false)
  const [oldPass, setOldPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [passMsg, setPassMsg] = useState('')

  function handleAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setAvatar(reader.result as string)
    reader.readAsDataURL(file)
  }

  function handleSaveProfil(e: React.FormEvent) {
    e.preventDefault()
    updateUser({ prenom, nom, email })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function handleChangePass(e: React.FormEvent) {
    e.preventDefault()
    if (oldPass !== 'BNP2025!') {
      setPassMsg('Mot de passe actuel incorrect')
      return
    }
    if (newPass.length < 8) {
      setPassMsg('8 caractères minimum requis')
      return
    }
    setPassMsg('✓ Mot de passe mis à jour')
    setOldPass('')
    setNewPass('')
    setTimeout(() => setPassMsg(''), 3000)
  }

  function handleLogout() {
    logout()
    document.cookie = 'bnp-auth=; Max-Age=0; path=/'
    router.push('/login')
  }

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${
        value ? 'bg-[#009B4E]' : 'bg-gray-200'
      }`}
    >
      <span
        className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
          value ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )

  return (
    <div className="space-y-6 pb-24">

      {/* Photo de profil */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-5">Photo de profil</h2>
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-[#009B4E]/10 flex items-center justify-center">
              {avatar ? (
                <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[#009B4E] font-bold text-2xl">
                  {user?.prenom?.[0]}{user?.nom?.[0]}
                </span>
              )}
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-0 right-0 w-7 h-7 bg-[#009B4E] rounded-full flex items-center justify-center shadow-lg hover:bg-[#007d3f] transition-colors"
            >
              <Camera size={13} className="text-white" />
            </button>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {user?.prenom} {user?.nom}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">JPG, PNG — max 5 Mo</p>
            <button
              onClick={() => fileRef.current?.click()}
              className="text-xs text-[#009B4E] hover:underline mt-1.5 block"
            >
              Changer la photo
            </button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleAvatar}
            className="hidden"
          />
        </div>
      </div>

      {/* Informations personnelles */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-5">Informations personnelles</h2>
        <form onSubmit={handleSaveProfil} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Prénom"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              icon={<User size={15} />}
            />
            <Input
              label="Nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
            />
          </div>
          <Input
            label="Adresse e-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail size={15} />}
          />
          <Input
            label="Téléphone"
            type="tel"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            icon={<Phone size={15} />}
          />
          <Button type="submit" size="md">
            {saved
              ? <><Check size={15} className="mr-1.5" /> Sauvegardé</>
              : 'Enregistrer les modifications'
            }
          </Button>
        </form>
      </div>

      {/* Sécurité */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-1">Sécurité</h2>
        <p className="text-xs text-gray-400 mb-5">Changez votre mot de passe régulièrement</p>
        <form onSubmit={handleChangePass} className="space-y-4">
          <div className="relative">
            <Input
              label="Mot de passe actuel"
              type={showOldPass ? 'text' : 'password'}
              value={oldPass}
              onChange={(e) => setOldPass(e.target.value)}
              icon={<Shield size={15} />}
            />
            <button
              type="button"
              onClick={() => setShowOldPass(!showOldPass)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
            >
              {showOldPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          <div className="relative">
            <Input
              label="Nouveau mot de passe"
              type={showNewPass ? 'text' : 'password'}
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              icon={<Shield size={15} />}
            />
            <button
              type="button"
              onClick={() => setShowNewPass(!showNewPass)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
            >
              {showNewPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {passMsg && (
            <p className={`text-xs px-3 py-2 rounded-lg ${
              passMsg.startsWith('✓')
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-600'
            }`}>
              {passMsg}
            </p>
          )}
          <Button type="submit" variant="secondary">
            Changer le mot de passe
          </Button>
        </form>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-5">
          <Bell size={16} className="inline mr-2 text-gray-500" />
          Notifications
        </h2>
        <div className="space-y-4">
          {[
            {
              label: 'Alertes virements',
              desc: 'Notifié à chaque virement effectué',
              value: notifVirement,
              onChange: () => setNotifVirement(!notifVirement),
            },
            {
              label: 'Alertes de connexion',
              desc: "Notifié lors d'une nouvelle connexion",
              value: notifConnexion,
              onChange: () => setNotifConnexion(!notifConnexion),
            },
            {
              label: 'Offres et promotions',
              desc: 'Recevoir les offres BNP Paribas',
              value: notifPromo,
              onChange: () => setNotifPromo(!notifPromo),
            },
          ].map(({ label, desc, value, onChange }) => (
            <div
              key={label}
              className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
            >
              <div>
                <p className="text-sm font-medium text-gray-800">{label}</p>
                <p className="text-xs text-gray-400">{desc}</p>
              </div>
              <Toggle value={value} onChange={onChange} />
            </div>
          ))}
        </div>
      </div>

      {/* Déconnexion */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-1">Session</h2>
        <p className="text-xs text-gray-400 mb-4">
          Connecté en tant que <strong>{user?.email}</strong>
        </p>
        <Button variant="danger" onClick={handleLogout} className="w-full">
          <LogOut size={16} className="mr-2" />
          Se déconnecter
        </Button>
      </div>

    </div>
  )
}