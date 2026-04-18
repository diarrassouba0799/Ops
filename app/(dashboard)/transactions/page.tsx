import Topbar from '@/components/layout/Topbar'
import TransactionList from '@/components/transactions/TransactionList'

export default function TransactionsPage() {
  return (
    <div>
      <Topbar title="Historique des operations" />
      <div className="p-6 max-w-4xl mx-auto">
        <TransactionList />
      </div>
    </div>
  )
}