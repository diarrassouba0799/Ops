import Topbar from '@/components/layout/Topbar'
import ParametresClient from '@/components/parametres/ParametresClient'

export default function ParametresPage() {
  return (
    <div>
      <Topbar title="Parametres" />
      <div className="p-6 max-w-2xl mx-auto">
        <ParametresClient />
      </div>
    </div>
  )
}