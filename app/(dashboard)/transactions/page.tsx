import Topbar from '@/components/layout/Topbar'
import TransactionList from '@/components/transactions/TransactionList'

export default function TransactionsPage() {
  return (
    <div>
      <Topbar title="Historique des opérations" />
      <div className="p-6 max-w-4xl mx-auto">
        <TransactionList />
      </div>
    </div>
  )
}