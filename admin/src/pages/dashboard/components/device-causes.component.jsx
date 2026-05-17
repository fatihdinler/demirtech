import { useState } from 'react'
import {
  FaArrowUp,
  FaBolt,
  FaCrosshairs,
  FaWaveSquare,
  FaBinoculars,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa'

const typeStyle = {
  trend:      { icon: FaArrowUp,     color: 'text-violet-500' },
  threshold:  { icon: FaCrosshairs,  color: 'text-orange-500' },
  volatility: { icon: FaWaveSquare,  color: 'text-teal-500' },
  anomaly:    { icon: FaBolt,        color: 'text-rose-500' },
  forecast:   { icon: FaBinoculars,  color: 'text-indigo-500' },
}

const sevBorder = {
  critical: 'border-red-400',
  warning:  'border-amber-400',
  info:     'border-slate-200',
}

const sevDot = {
  critical: 'bg-red-500',
  warning:  'bg-amber-500',
  info:     'bg-blue-400',
}

const CauseRow = ({ cause }) => {
  const [open, setOpen] = useState(false)
  const style = typeStyle[cause.type] || typeStyle.trend
  const Icon = style.icon

  return (
    <div className={`border-l-2 ${sevBorder[cause.severity] || sevBorder.info} rounded-r-lg`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-slate-50/60 transition-colors rounded-r-lg"
      >
        <Icon size={12} className={style.color} />
        <span className="flex-1 text-xs font-semibold text-slate-700 truncate">{cause.title}</span>
        <span className="text-[11px] font-mono font-bold text-slate-500 shrink-0">{cause.value}</span>
        <span className="text-slate-300 shrink-0">
          {open ? <FaChevronUp size={8} /> : <FaChevronDown size={8} />}
        </span>
      </button>

      {open && (
        <div className="px-3 pb-2.5 pl-8 space-y-1">
          <p className="text-[11px] font-medium text-slate-600">{cause.summary}</p>
          {cause.detail && (
            <p className="text-[11px] text-slate-400 leading-relaxed">{cause.detail}</p>
          )}
        </div>
      )}
    </div>
  )
}

const DeviceCauses = ({ causes }) => {
  if (!causes || causes.length === 0) return null

  const hasCritical = causes.some(c => c.severity === 'critical')
  const hasWarning = causes.some(c => c.severity === 'warning')

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5">
        <h3 className="text-sm font-bold text-slate-800">Tahmin Nedenleri</h3>
        <div className="flex items-center gap-1.5">
          {hasCritical && <span className={`w-2 h-2 rounded-full ${sevDot.critical}`} />}
          {hasWarning && <span className={`w-2 h-2 rounded-full ${sevDot.warning}`} />}
          <span className="text-[11px] text-slate-400 ml-0.5">{causes.length} analiz</span>
        </div>
      </div>

      <div className="px-4 pb-4 space-y-1">
        {causes.map((c, i) => (
          <CauseRow key={c.type} cause={c} />
        ))}
      </div>
    </div>
  )
}

export default DeviceCauses
