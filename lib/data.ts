import { Compte, Transaction, Carte, User } from '@/types'

export const mockUser: User = {
  id: '7858120491',
  nom: 'Lafonte',
  prenom: 'Martine',
  email: 'martinelafonte1@gmail.com',
}

export const mockComptes: Compte[] = [
  {
    id: 'c1',
    libelle: 'Compte Courant',
    iban: 'FR76 3000 4028 3798 7654 3210 943',
    solde: 2750000.25,
    type: 'courant',
  },
  {
    id: 'c2',
    libelle: 'Livret A',
    iban: 'FR76 3000 4028 3798 1111 2222 333',
    solde: 12500.00,
    type: 'livret',
  },
  {
    id: 'c3',
    libelle: 'Compte Epargne',
    iban: 'FR76 3000 4028 3798 9999 8888 777',
    solde: 8250.00,
    type: 'epargne',
  },
]

export const mockTransactions: Transaction[] = [
  { id: 't1', date: '2026-04-12', libelle: 'VIREMENT SALAIRE ENTREPRISE SAS', montant: 2800, type: 'credit', categorie: 'Salaire', compteId: 'c1' },
  { id: 't2', date: '2026-04-11', libelle: 'CARREFOUR MARKET PARIS 11', montant: -67.43, type: 'debit', categorie: 'Courses', compteId: 'c1' },
  { id: 't3', date: '2026-04-10', libelle: 'NETFLIX.COM', montant: -15.99, type: 'debit', categorie: 'Loisirs', compteId: 'c1' },
  { id: 't4', date: '2026-04-09', libelle: 'RATP - NAVIGO MENSUEL', montant: -86.40, type: 'debit', categorie: 'Transport', compteId: 'c1' },
  { id: 't5', date: '2026-04-08', libelle: 'EDF ELECTRICITE', montant: -124.00, type: 'debit', categorie: 'Factures', compteId: 'c1' },
  { id: 't6', date: '2026-04-07', libelle: 'VIREMENT RECU DE PIERRE MARTIN', montant: 150.00, type: 'credit', categorie: 'Virement', compteId: 'c1' },
  { id: 't7', date: '2026-04-05', libelle: 'AMAZON EU SARL', montant: -43.99, type: 'debit', categorie: 'Shopping', compteId: 'c1' },
  { id: 't8', date: '2026-04-03', libelle: 'PHARMACIE DU CENTRE', montant: -12.80, type: 'debit', categorie: 'Sante', compteId: 'c1' },
  { id: 't9', date: '2026-04-01', libelle: 'LOYER AVRIL - SCI PARIS IMMO', montant: -950.00, type: 'debit', categorie: 'Logement', compteId: 'c1' },
  { id: 't10', date: '2026-03-30', libelle: 'REMBOURSEMENT CPAM', montant: 32.50, type: 'credit', categorie: 'Sante', compteId: 'c1' },
]

export const mockCartes: Carte[] = [
  {
    id: 'k1',
    titulaire: 'MARTINE LAFONTE',
    numero: '4978 **** **** 3821',
    expiration: '09/27',
    type: 'visa',
    statut: 'active',
    plafond: 2000,
    depensesMois: 847.23,
  },
  {
    id: 'k2',
    titulaire: 'MARTINE LAFONTE',
    numero: '5412 **** **** 7734',
    expiration: '03/26',
    type: 'mastercard',
    statut: 'active',
    plafond: 1000,
    depensesMois: 215.00,
  },
]