import { FaBuilding } from 'react-icons/fa'
import useDashboard from './dashboard.hook'

const DashboardCustomerSelection = ({ onCustomerSelect }) => {
  const { customers, isCustomersLoading, errorCustomers } = useDashboard()

  if (isCustomersLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-bounce1" />
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-bounce2" />
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-bounce3" />
        </div>
        <p className="text-sm text-slate-400">Müşteriler yükleniyor...</p>
      </div>
    )
  }

  if (errorCustomers) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
        Hata: {errorCustomers.message}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <nav className="flex items-center gap-1.5 text-sm">
          <span className="font-semibold text-slate-800">Müşteriler</span>
        </nav>
        <p className="text-slate-400 text-sm mt-0.5">İzlemek istediğiniz müşteriyi seçin</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {customers.map((customer, i) => (
          <button
            key={customer.id}
            onClick={() => onCustomerSelect(customer)}
            className="group bg-white border border-slate-100 rounded-2xl p-5 text-left shadow-sm hover:shadow-xl hover:shadow-indigo-100 hover:border-indigo-200 hover:-translate-y-1.5 transition-all duration-300 animate-fadeSlideIn"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 flex items-center justify-center mb-4 group-hover:from-indigo-100 group-hover:to-violet-100 transition-colors duration-300">
              <FaBuilding size={18} className="text-indigo-400 group-hover:text-indigo-600 transition-colors duration-300" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 mb-1 truncate">{customer.name}</h3>
            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
              {customer.description || 'Açıklama bulunamadı'}
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-medium text-indigo-500 group-hover:text-indigo-700 transition-colors">
                Cihazları Gör
              </span>
              <span className="w-6 h-6 flex items-center justify-center rounded-full bg-indigo-50 group-hover:bg-indigo-100 transition-colors text-indigo-400">
                →
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default DashboardCustomerSelection
