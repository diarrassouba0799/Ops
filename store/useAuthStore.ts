import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, Transaction } from '@/types'
import { mockComptes, mockTransactions } from '@/lib/data'

interface AlerteSecurite {
  active: boolean
  montant: number
  beneficiaire: string
}

interface VirementEnCours {
  id: string
  beneficiaire: string
  montant: number
  motif: string
  dateEnvoi: number
  dateCreditPrevue: number
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  solde: number
  avatar: string | null
  alerteSecurite: AlerteSecurite | null
  transactions: Transaction[]
  virementsEnCours: VirementEnCours[]
  compteEnVerification: boolean
  virementVerification: VirementEnCours | null

  login: (user: User) => void
  logout: () => void
  retirerMontant: (montant: number) => void
  setAvatar: (url: string) => void
  setAlerteSecurite: (alerte: AlerteSecurite | null) => void
  updateUser: (data: Partial<User>) => void
  ajouterTransaction: (t: Transaction) => void
  ajouterVirementEnCours: (v: VirementEnCours) => void
  verifierVirementsExpires: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      solde: mockComptes[0].solde,
      avatar: null,
      alerteSecurite: null,
      transactions: mockTransactions,
      virementsEnCours: [],
      compteEnVerification: false,
      virementVerification: null,

      login: (user) => {
        set({ user, isAuthenticated: true })
        setTimeout(() => get().verifierVirementsExpires(), 100)
      },

      logout: () => set({
        user: null,
        isAuthenticated: false,
        alerteSecurite: null,
      }),

      retirerMontant: (montant) =>
        set({ solde: Math.max(0, get().solde - montant) }),

      setAvatar: (url) => set({ avatar: url }),

      setAlerteSecurite: (alerte) => set({ alerteSecurite: alerte }),

      updateUser: (data) =>
        set({ user: get().user ? { ...get().user!, ...data } : null }),

      ajouterTransaction: (t) =>
        set({ transactions: [t, ...get().transactions] }),

      ajouterVirementEnCours: (v) =>
        set({ virementsEnCours: [v, ...get().virementsEnCours] }),

      verifierVirementsExpires: () => {
        const { virementsEnCours, compteEnVerification } = get()
        if (compteEnVerification) return
        const maintenant = Date.now()
        const expire = virementsEnCours.find(
          (v) => maintenant >= v.dateCreditPrevue
        )
        if (expire) {
          set({
            compteEnVerification: true,
            virementVerification: expire,
          })
        }
      },
    }),
    {
      name: 'bnp-auth-v2', // ← clé différente, repart proprement
    }
  )
)