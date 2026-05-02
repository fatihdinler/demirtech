import { FaThermometerHalf, FaTint, FaExclamationTriangle, FaChevronLeft, FaChartLine } from 'react-icons/fa'
import useDashboard from './dashboard.hook'
import useRealtimeDeviceData from '../../hooks/socket.hook'

const statusConfig = {
  critical: {
    badge: 'bg-red-100 text-red-600',
    border: 'border-l-red-500',
    label: 'Kritik',
    glow: 'hover:shadow-red-100',
  },
  warning: {
    badge: 'bg-amber-100 text-amber-600',
    border: 'border-l-amber-400',
    label: 'Uyarı',
    glow: 'hover:shadow-amber-100',
  },
  normal: {
    badge: 'bg-emerald-100 text-emerald-600',
    border: 'border-l-emerald-500',
    label: 'Normal',
    glow: 'hover:shadow-emerald-100',
  },
}

const getValueStatus = (type, value) => {
  const t = type.toLowerCase()
  if (t === 'temperature' || t === 'sicaklik') {
    if (value < 15 || value > 30) return 'critical'
    if (value < 17 || value > 28) return 'warning'
    return 'normal'
  }
  if (t === 'humidity' || t === 'nem') {
    if (value < 20 || value > 80) return 'critical'
    if (value < 30 || value > 70) return 'warning'
    return 'normal'
  }
  return 'normal'
}

const DashboardDeviceSelection = ({ selectedCustomer, onBackToCustomer, onDeviceSelect }) => {
  const { devices, isDevicesLoading, errorDevices, branches, locations } = useDashboard()
  const realtimeDataMap = useRealtimeDeviceData()

  const customerBranchIds = new Set(
    branches.filter((b) => b.customerId === selectedCustomer.id).map((b) => b.id)
  )

  const locationMap = locations
    .filter((l) => customerBranchIds.has(l.branchId))
    .reduce((acc, l) => { acc[l.id] = l; return acc }, {})

  const branchMap = branches.reduce((acc, b) => { acc[b.id] = b; return acc }, {})

  const filteredDevices = devices.filter((d) => locationMap[d.locationId])

  const criticalCount = filteredDevices.filter((d) => {
    const rt = realtimeDataMap[d.id]
    return rt ? getValueStatus(rt.type, Number(rt.value)) === 'critical' : false
  }).length

  const warningCount = filteredDevices.filter((d) => {
    const rt = realtimeDataMap[d.id]
    return rt ? getValueStatus(rt.type, Number(rt.value)) === 'warning' : false
  }).length

  const renderDeviceCard = (device, i) => {
    const realtime = realtimeDataMap[device.id]
    const location = locationMap[device.locationId]
    const branch = location ? branchMap[location.branchId] : null

    let icon = <FaExclamationTriangle size={18} className="text-slate-400" />
    let reading = '—'
    let unit = ''
    let status = 'normal'

    if (realtime) {
      const val = Number(realtime.value)
      reading = val.toFixed(1)
      const isHumidity = realtime.type.toLowerCase() === 'humidity' || realtime.type.toLowerCase() === 'nem'
      icon = isHumidity
        ? <FaTint size={18} className="text-blue-400" />
        : <FaThermometerHalf size={18} className="text-orange-400" />
      unit = isHumidity ? '%' : '°C'
      status = getValueStatus(realtime.type, val)
    }

    const cfg = statusConfig[status]

    return (
      <div
        key={device.id}
        onClick={() => onDeviceSelect(device)}
        className={`
          group relative bg-white border-l-4 rounded-2xl p-4 cursor-pointer select-none
          border border-slate-100 shadow-sm transition-all duration-300
          ${cfg.border} hover:shadow-lg ${cfg.glow} hover:-translate-y-1
        `}
        style={{ animationDelay: `${i * 40}ms` }}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0 pr-2">
            <h4 className="text-sm font-bold text-slate-800 truncate">{device.name}</h4>
            {(branch || location) && (
              <p className="text-xs text-slate-400 mt-0.5 truncate">
                {[branch?.name, location?.name].filter(Boolean).join(' / ')}
              </p>
            )}
          </div>
          <div className="shrink-0">{icon}</div>
        </div>

        <div className="flex items-baseline gap-0.5 mb-3">
          <span className="text-2xl font-black text-slate-900 leading-none">{reading}</span>
          {unit && <span className="text-sm font-semibold text-slate-500">{unit}</span>}
        </div>

        <div className="flex items-center justify-between">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.badge}`}>
            {cfg.label}
          </span>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1 text-xs text-indigo-500 font-medium">
            <FaChartLine size={10} />
            Tahmin
          </span>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBackToCustomer}
          className="flex items-center gap-1.5 text-sm text-indigo-500 hover:text-indigo-700 font-medium transition-colors"
        >
          <FaChevronLeft size={11} />
          Müşteriler
        </button>
        <span className="text-slate-300">/</span>
        <span className="text-sm font-semibold text-slate-800">{selectedCustomer.name}</span>
        <span className="ml-auto text-xs text-slate-400">Tahmin için bir cihaza tıklayın</span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Toplam Cihaz', value: filteredDevices.length, color: 'text-slate-800', bg: 'bg-slate-50', border: 'border-slate-200' },
          { label: 'Uyarı', value: warningCount, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
          { label: 'Kritik', value: criticalCount, color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.bg} border ${stat.border} rounded-2xl p-4`}>
            <p className="text-xs font-medium text-slate-500 mb-1">{stat.label}</p>
            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {isDevicesLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="flex gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-bounce1" />
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-bounce2" />
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-bounce3" />
          </div>
          <p className="text-sm text-slate-400">Cihazlar yükleniyor...</p>
        </div>
      ) : errorDevices ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          Hata: {errorDevices.message}
        </div>
      ) : filteredDevices.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-400">
          <span className="text-5xl">📡</span>
          <p className="text-sm font-medium">Bu müşteriye ait cihaz bulunamadı.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredDevices.map((device, i) => renderDeviceCard(device, i))}
        </div>
      )}
    </div>
  )
}

export default DashboardDeviceSelection
