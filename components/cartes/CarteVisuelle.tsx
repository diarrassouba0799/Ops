'use client'
import { useState } from 'react'
import { Carte } from '@/types'
import { formatMontant } from '@/lib/utils'
import { Lock, Unlock } from 'lucide-react'

function PuceEMV() {
  return (
    <svg viewBox="0 0 48 38" width="44" height="34">
      <defs>
        <linearGradient id="cg2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e8c84a"/>
          <stop offset="40%" stopColor="#f0d060"/>
          <stop offset="100%" stopColor="#c8a830"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="48" height="38" rx="4" fill="url(#cg2)" stroke="#b8941a" strokeWidth="0.8"/>
      <rect x="3" y="4" width="13" height="10" rx="1.5" fill="#c8a830" stroke="#a07820" strokeWidth="0.5"/>
      <rect x="3" y="16" width="13" height="10" rx="1.5" fill="#c8a830" stroke="#a07820" strokeWidth="0.5"/>
      <rect x="3" y="28" width="13" height="7" rx="1.5" fill="#c8a830" stroke="#a07820" strokeWidth="0.5"/>
      <rect x="32" y="4" width="13" height="10" rx="1.5" fill="#c8a830" stroke="#a07820" strokeWidth="0.5"/>
      <rect x="32" y="16" width="13" height="10" rx="1.5" fill="#c8a830" stroke="#a07820" strokeWidth="0.5"/>
      <rect x="32" y="28" width="13" height="7" rx="1.5" fill="#c8a830" stroke="#a07820" strokeWidth="0.5"/>
      <rect x="17" y="0" width="14" height="38" fill="url(#cg2)"/>
      <line x1="24" y1="0" x2="24" y2="38" stroke="#b8941a" strokeWidth="0.5"/>
      <rect x="14" y="8" width="20" height="16" rx="2" fill="#2a1a08" stroke="#8a6010" strokeWidth="0.5"/>
      <rect x="16" y="10" width="5" height="4" rx="0.5" fill="#3a2a10"/>
      <rect x="23" y="10" width="5" height="4" rx="0.5" fill="#3a2a10"/>
      <rect x="16" y="16" width="5" height="4" rx="0.5" fill="#3a2a10"/>
      <rect x="23" y="16" width="5" height="4" rx="0.5" fill="#3a2a10"/>
      <circle cx="24" cy="16" r="2" fill="#f0d060" opacity="0.7"/>
    </svg>
  )
}

function NFC({ color = 'white' }: { color?: string }) {
  return (
    <svg viewBox="0 0 28 32" width="20" height="24">
      <circle cx="4" cy="16" r="2.5" fill={color} opacity="0.8"/>
      <path d="M10 8 A10 10 0 0 1 10 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.75"/>
      <path d="M15 4 A16 16 0 0 1 15 28" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity="0.55"/>
      <path d="M20 1 A22 22 0 0 1 20 31" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.35"/>
    </svg>
  )
}

function LogoCB({ dark = false }: { dark?: boolean }) {
  return (
    <div
      className="flex items-center justify-center rounded-md px-2 py-1"
      style={{
        background: dark ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.2)',
        border: `1px solid ${dark ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.3)'}`,
      }}
    >
      <span
        className="font-bold text-sm tracking-widest"
        style={{ color: dark ? '#8B6914' : 'white', fontStyle: 'italic' }}
      >
        CB
      </span>
    </div>
  )
}

function LogoLaBanquePostale({ dark = false }: { dark?: boolean }) {
  const color = dark ? '#4a3000' : 'white'
  return (
    <div className="flex items-end gap-1.5">
      <svg viewBox="0 0 24 28" width="18" height="21" fill={color}>
        <path d="M12 0 L22 6 L22 18 L12 24 L2 18 L2 6 Z" opacity="0.9"/>
        <path d="M12 4 L19 8 L19 16 L12 20 L5 16 L5 8 Z" fill="none" stroke={color} strokeWidth="1.5"/>
      </svg>
      <div className="leading-tight">
        <p className="text-[9px] font-bold tracking-wider" style={{ color }}>LA</p>
        <p className="text-[9px] font-bold tracking-wider" style={{ color }}>BANQUE</p>
        <p className="text-[9px] font-bold tracking-wider" style={{ color }}>BNP PARIBAS</p>
      </div>
    </div>
  )
}

function CarteVisuelleGreen({ carte, bloquee }: { carte: Carte; bloquee: boolean }) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden select-none"
      style={{
        height: '210px',
        background: bloquee
          ? 'linear-gradient(135deg, #6b7280, #9ca3af)'
          : 'linear-gradient(145deg, #00915A 0%, #006B42 30%, #00a868 55%, #005535 80%, #003d26 100%)',
        boxShadow: bloquee
          ? '0 8px 24px rgba(0,0,0,0.2)'
          : '0 8px 32px rgba(0,145,90,0.45)',
      }}
    >
      {/* Texture ondulée */}
      <div className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 4px,
            rgba(255,255,255,0.08) 4px,
            rgba(255,255,255,0.08) 8px
          )`,
        }}
      />
      {/* Reflet haut */}
      <div className="absolute top-0 left-0 right-0 h-1/3 opacity-10"
        style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.4), transparent)' }}
      />

      {/* Logo maison */}
      <div className="absolute top-4 left-4">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
            <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
            <rect x="9" y="13" width="6" height="8" fill="rgba(0,145,90,0.6)" rx="1"/>
          </svg>
        </div>
      </div>

      {/* Puce + NFC + CB */}
      <div className="absolute top-14 left-4 flex items-center gap-3">
        <PuceEMV />
        <NFC color="white" />
      </div>
      <div className="absolute top-4 right-4">
        <LogoCB dark={false} />
      </div>

      {/* VISA */}
      <div className="absolute bottom-8 right-5">
        <span className="text-white font-bold text-2xl italic tracking-tight"
          style={{ fontFamily: 'Georgia, serif', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
          VISA
        </span>
      </div>

      {/* Logo + numéro */}
      <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
        <LogoLaBanquePostale dark={false} />
        <p className="text-white/80 font-mono text-[9px] tracking-wider">
          {carte.numero}
        </p>
      </div>

      {/* Titulaire */}
      <div className="absolute bottom-12 left-4">
        <p className="text-white/90 text-xs font-semibold tracking-widest">
          {carte.titulaire}
        </p>
        <p className="text-white/50 text-[9px] mt-0.5">
          Expire : {carte.expiration}
        </p>
      </div>

      {bloquee && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl backdrop-blur-sm">
          <div className="text-center">
            <Lock size={28} className="text-white mx-auto mb-1"/>
            <span className="text-white font-bold text-sm tracking-widest">CARTE BLOQUEE</span>
          </div>
        </div>
      )}
    </div>
  )
}

function CarteVisuellePremier({ carte, bloquee }: { carte: Carte; bloquee: boolean }) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden select-none"
      style={{
        height: '210px',
        background: bloquee
          ? 'linear-gradient(135deg, #6b7280, #9ca3af)'
          : 'linear-gradient(145deg, #c8973a 0%, #e8b84a 25%, #d4a030 50%, #f0c860 70%, #b8861a 100%)',
        boxShadow: bloquee
          ? '0 8px 24px rgba(0,0,0,0.2)'
          : '0 8px 32px rgba(180,140,30,0.45)',
      }}
    >
      <div className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, rgba(255,255,255,0.3) 0%, transparent 40%),
            radial-gradient(circle at 70% 60%, rgba(255,255,255,0.2) 0%, transparent 35%),
            radial-gradient(circle at 50% 80%, rgba(200,150,30,0.4) 0%, transparent 45%)`,
        }}
      />

      <div className="absolute top-14 left-4 flex items-center gap-3">
        <PuceEMV />
        <NFC color="#4a3000" />
      </div>
      <div className="absolute top-4 right-4">
        <LogoCB dark={true} />
      </div>

      <div className="absolute bottom-8 right-5 text-right">
        <p className="font-bold text-2xl italic tracking-tight"
          style={{ color: '#4a3000', fontFamily: 'Georgia, serif', textShadow: '0 1px 2px rgba(255,220,100,0.5)' }}>
          VISA
        </p>
        <p className="text-xs font-semibold tracking-widest" style={{ color: '#6a4800' }}>
          Premier
        </p>
      </div>

      <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
        <LogoLaBanquePostale dark={true} />
        <p className="font-mono text-[9px] tracking-wider" style={{ color: '#6a4800' }}>
          {carte.numero}
        </p>
      </div>

      <div className="absolute bottom-12 left-4">
        <p className="text-xs font-semibold tracking-widest" style={{ color: '#3a2000' }}>
          {carte.titulaire}
        </p>
        <p className="text-[9px] mt-0.5" style={{ color: '#8a6010' }}>
          Expire : {carte.expiration}
        </p>
      </div>

      {bloquee && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl backdrop-blur-sm">
          <div className="text-center">
            <Lock size={28} className="text-white mx-auto mb-1"/>
            <span className="text-white font-bold text-sm tracking-widest">CARTE BLOQUEE</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default function CarteVisuelle({ carte }: { carte: Carte }) {
  const [bloquee, setBloquee] = useState(carte.statut === 'bloquee')
  const pct = Math.round((carte.depensesMois / carte.plafond) * 100)
  const isPremier = carte.type === 'mastercard'

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-5">

      {isPremier ? (
        <CarteVisuellePremier carte={carte} bloquee={bloquee} />
      ) : (
        <CarteVisuelleGreen carte={carte} bloquee={bloquee} />
      )}

      {/* Plafond */}
      <div>
        <div className="flex justify-between text-xs text-gray-500 mb-1.5">
          <span>Depenses ce mois</span>
          <span>{formatMontant(carte.depensesMois)} / {formatMontant(carte.plafond)}</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all"
            style={{
              width: `${Math.min(pct, 100)}%`,
              background: pct > 80
                ? '#ef4444'
                : isPremier
                  ? 'linear-gradient(90deg, #c8973a, #e8b84a)'
                  : 'linear-gradient(90deg, #00915A, #006B42)',
            }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">{pct}% du plafond utilise</p>
      </div>

      {/* Bouton */}
      <button
        onClick={() => setBloquee(!bloquee)}
        className="w-full flex items-center justify-center gap-2 font-medium py-2.5 rounded-xl transition-colors text-sm"
        style={{
          background: bloquee
            ? (isPremier ? '#c8973a' : '#00915A')
            : '#ef4444',
          color: 'white',
        }}
      >
        {bloquee
          ? <><Unlock size={16}/> Debloquer la carte</>
          : <><Lock size={16}/> Bloquer la carte</>
        }
      </button>
    </div>
  )
}