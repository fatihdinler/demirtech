import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts'
import { FaArrowUp, FaArrowDown, FaMinus, FaChevronLeft, FaSync, FaBrain } from 'react-icons/fa'
import { format, parseISO } from 'date-fns'
import { tr } from 'date-fns/locale'
import { fetchDeviceForecast } from '../../../features/predictions/predictions.api'
import DeviceCauses from './device-causes.component'

const trendConfig = {
  increasing: { icon: FaArrowUp, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200', label: 'Artış Trendi' },
  decreasing: { icon: FaArrowDown, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200', label: 'Düşüş Trendi' },
  stable: { icon: FaMinus, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200', label: 'Kararlı' },
}

const measurementMeta = {
  temperature: { unit: '°C', label: 'Sıcaklık', color: '#f97316' },
  sicaklik: { unit: '°C', label: 'Sıcaklık', color: '#f97316' },
  humidity: { unit: '%', label: 'Nem', color: '#3b82f6' },
  nem: { unit: '%', label: 'Nem', color: '#3b82f6' },
}

const formatTime = (iso) => {
  try { return format(parseISO(iso), 'HH:mm', { locale: tr }) } catch { return iso }
}

const formatFullTime = (iso) => {
  try { return format(parseISO(iso), 'dd MMM HH:mm', { locale: tr }) } catch { return iso }
}

const CustomTooltip = ({ active, payload, label, unit }) => {
  if (!active || !payload?.length) return null
  const isForecast = payload.some(p => p.dataKey === 'forecastValue')

  return (
    <div className="bg-slate-900/95 border border-slate-700 rounded-xl px-4 py-3 shadow-xl text-xs">
      <p className="text-slate-400 mb-2 font-medium">{formatFullTime(label)}</p>
      {isForecast ? (
        <>
          <p className="text-violet-400 font-bold text-sm">
            Tahmin: <span className="text-white">{payload.find(p => p.dataKey === 'forecastValue')?.value}{unit}</span>
          </p>
          <p className="text-slate-500 mt-1">
            Üst: {payload.find(p => p.dataKey === 'upper')?.value}{unit}
            <span className="mx-1">·</span>
            Alt: {payload.find(p => p.dataKey === 'lower')?.value}{unit}
          </p>
        </>
      ) : (
        <p className="text-indigo-400 font-bold text-sm">
          Ölçüm: <span className="text-white">{payload.find(p => p.dataKey === 'historicalValue')?.value}{unit}</span>
        </p>
      )}
    </div>
  )
}

const MetricBadge = ({ label, value, good }) => (
  <div className={`px-3 py-2 rounded-lg border ${good ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
    <p className="text-[10px] font-medium text-slate-500">{label}</p>
    <p className={`text-sm font-black ${good ? 'text-emerald-700' : 'text-slate-800'}`}>{value}</p>
  </div>
)

const DeviceForecast = ({ device, onBack }) => {
  const dispatch = useDispatch()
  const forecastState = useSelector(s => s.predictions.byDevice[device.id])

  useEffect(() => {
    if (!forecastState || forecastState.error) {
      dispatch(fetchDeviceForecast(device.id))
    }
  }, [device.id, dispatch]) // eslint-disable-line

  const refresh = () => dispatch(fetchDeviceForecast(device.id))

  const meta = measurementMeta[device.measurementType?.toLowerCase()] || { unit: '', label: 'Değer', color: '#6366f1' }

  let chartData = []
  let modelInfo = null
  let trendKey = 'stable'
  let stats = null
  let nowIndex = -1
  let causes = []

  if (forecastState?.data) {
    const { historical, forecast, model, trend, stats: s, causes: c } = forecastState.data
    modelInfo = model
    trendKey = trend
    stats = s
    causes = c || []

    chartData = [
      ...historical.map(h => ({
        time: h.time,
        historicalValue: h.value,
        forecastValue: null,
        upper: null,
        lower: null,
      })),
      ...forecast.map(f => ({
        time: f.time,
        historicalValue: null,
        forecastValue: f.value,
        upper: f.upper,
        lower: f.lower,
      })),
    ]
    nowIndex = historical.length - 1
  }

  const trendCfg = trendConfig[trendKey]
  const TrendIcon = trendCfg.icon
  const metrics = modelInfo?.metrics

  return (
    <div className="animate-fadeSlideIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-indigo-500 hover:text-indigo-700 font-medium transition-colors"
          >
            <FaChevronLeft size={11} />
            Cihazlar
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-sm font-bold text-slate-800">{device.name}</span>
          <span className="px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-500 rounded-full font-mono">
            {device.chipId}
          </span>
        </div>
        <button
          onClick={refresh}
          disabled={forecastState?.isLoading}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-all disabled:opacity-50"
        >
          <FaSync size={10} className={forecastState?.isLoading ? 'animate-spin' : ''} />
          Yenile
        </button>
      </div>

      {/* Loading state */}
      {forecastState?.isLoading && (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-violet-500 animate-bounce1" />
            <div className="w-3 h-3 rounded-full bg-violet-500 animate-bounce2" />
            <div className="w-3 h-3 rounded-full bg-violet-500 animate-bounce3" />
          </div>
          <p className="text-sm text-slate-400">LSTM modeli eğitiliyor ve tahmin üretiliyor...</p>
        </div>
      )}

      {/* Error state */}
      {forecastState?.error && !forecastState?.isLoading && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center text-3xl">📡</div>
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-700 mb-1">Tahmin üretilemedi</p>
            <p className="text-xs text-slate-400 max-w-sm">{forecastState.error}</p>
          </div>
          <button onClick={refresh} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-colors">
            Tekrar Dene
          </button>
        </div>
      )}

      {/* Forecast data */}
      {forecastState?.data && !forecastState?.isLoading && (
        <div className="space-y-5">

          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
              <p className="text-xs font-medium text-slate-400 mb-1">Son Ölçüm</p>
              <p className="text-2xl font-black text-slate-900">
                {stats?.lastValue}<span className="text-lg font-semibold text-slate-400 ml-0.5">{meta.unit}</span>
              </p>
            </div>

            <div className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200 rounded-2xl p-4 shadow-sm">
              <p className="text-xs font-medium text-violet-500 mb-1">Sonraki Tahmin</p>
              <p className="text-2xl font-black text-violet-700">
                {stats?.nextPredicted}<span className="text-lg font-semibold text-violet-400 ml-0.5">{meta.unit}</span>
              </p>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
              <p className="text-xs font-medium text-slate-400 mb-1">Ortalama</p>
              <p className="text-2xl font-black text-slate-700">
                {stats?.mean}<span className="text-lg font-semibold text-slate-400 ml-0.5">{meta.unit}</span>
              </p>
              <p className="text-xs text-slate-400 mt-0.5">σ = {stats?.stdDev}</p>
            </div>

            <div className={`${trendCfg.bg} border ${trendCfg.border} rounded-2xl p-4 shadow-sm`}>
              <p className="text-xs font-medium text-slate-400 mb-1">Trend</p>
              <div className={`flex items-center gap-2 ${trendCfg.color}`}>
                <TrendIcon size={18} />
                <span className="text-sm font-bold">{trendCfg.label}</span>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 pt-5 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Zaman Serisi & LSTM Tahmini</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {modelInfo?.description} · %{(modelInfo?.confidenceLevel || 0.95) * 100} güven aralığı
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-6 h-0.5 bg-indigo-500 rounded-full inline-block" />
                  Geçmiş
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-6 h-0.5 bg-violet-500 rounded-full border-dashed inline-block" style={{ borderBottom: '2px dashed #8b5cf6' }} />
                  Tahmin
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-violet-100 border border-violet-300 inline-block" />
                  %95 GA
                </span>
              </div>
            </div>

            <div style={{ height: 340 }} className="px-2 pb-4">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="ciGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.03} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />

                  <XAxis
                    dataKey="time"
                    tickFormatter={formatTime}
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={v => `${v}${meta.unit}`}
                    width={55}
                  />

                  <Tooltip content={<CustomTooltip unit={meta.unit} />} />

                  <Area
                    dataKey="upper"
                    fill="url(#ciGradient)"
                    stroke="none"
                    connectNulls={false}
                    legendType="none"
                  />
                  <Area
                    dataKey="lower"
                    fill="white"
                    stroke="none"
                    connectNulls={false}
                    legendType="none"
                  />

                  {nowIndex >= 0 && chartData[nowIndex] && (
                    <ReferenceLine
                      x={chartData[nowIndex].time}
                      stroke="#6366f1"
                      strokeDasharray="4 3"
                      strokeWidth={1.5}
                      label={{ value: 'Şimdi', position: 'insideTopRight', fill: '#6366f1', fontSize: 10 }}
                    />
                  )}

                  <Line
                    type="monotone"
                    dataKey="historicalValue"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={false}
                    connectNulls={false}
                    name="Geçmiş Ölçümler"
                    activeDot={{ r: 4, fill: '#6366f1', stroke: 'white', strokeWidth: 2 }}
                  />

                  <Line
                    type="monotone"
                    dataKey="forecastValue"
                    stroke="#8b5cf6"
                    strokeWidth={2.5}
                    strokeDasharray="6 3"
                    dot={false}
                    connectNulls={false}
                    name="LSTM Tahmini"
                    activeDot={{ r: 4, fill: '#8b5cf6', stroke: 'white', strokeWidth: 2 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Cause Analysis */}
          <DeviceCauses causes={causes} />

          {/* Model Performance Metrics */}
          {metrics && (
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 flex items-center gap-2 border-b border-slate-100">
                <FaBrain size={14} className="text-violet-500" />
                <h4 className="text-sm font-bold text-slate-800">Model Performans Metrikleri</h4>
              </div>
              <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-3">
                <MetricBadge
                  label="MAE (Ortalama Mutlak Hata)"
                  value={metrics.mae}
                  good={metrics.mae < 2}
                />
                <MetricBadge
                  label="RMSE (Kök Ortalama Kare Hata)"
                  value={metrics.rmse}
                  good={metrics.rmse < 3}
                />
                <MetricBadge
                  label="MAPE (Ortalama Yüzde Hata)"
                  value={`%${metrics.mape}`}
                  good={metrics.mape < 10}
                />
                <MetricBadge
                  label="R² (Belirlilik Katsayısı)"
                  value={metrics.r2}
                  good={metrics.r2 > 0.85}
                />
              </div>
              <div className="px-5 pb-4">
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Bu metrikler modelin validasyon verisi üzerindeki performansını gösterir.
                  R² değeri 1'e ne kadar yakınsa model o kadar iyi; MAE ve RMSE ne kadar düşükse tahmin hatası o kadar azdır.
                  MAPE %10'un altındaysa model yüksek doğrulukta kabul edilir.
                </p>
              </div>
            </div>
          )}

          {/* LSTM Model Architecture */}
          <div className="bg-slate-950 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-2 mb-4">
              <FaBrain size={14} className="text-violet-400" />
              <h4 className="text-sm font-bold text-slate-200">LSTM Model Bilgisi</h4>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {[
                { label: 'Algoritma', value: modelInfo?.algorithm || 'LSTM' },
                { label: 'Mimari', value: modelInfo?.description || '-' },
                { label: 'Eğitim Verisi', value: `${modelInfo?.trainingPoints || '-'} nokta` },
                { label: 'Güven Aralığı', value: `%${(modelInfo?.confidenceLevel || 0.95) * 100}` },
              ].map(item => (
                <div key={item.label}>
                  <p className="text-xs text-slate-500 mb-1">{item.label}</p>
                  <p className="text-sm font-bold text-slate-100">{item.value}</p>
                </div>
              ))}
            </div>

            {modelInfo?.hyperparameters && (
              <div className="pt-4 border-t border-slate-800 grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                {[
                  { label: 'Window Size (Pencere)', value: modelInfo.hyperparameters.windowSize },
                  { label: 'Epochs (Dönem)', value: modelInfo.hyperparameters.epochs },
                  { label: 'Batch Size', value: modelInfo.hyperparameters.batchSize },
                  { label: 'Learning Rate', value: modelInfo.hyperparameters.learningRate },
                  { label: 'Validation Split', value: `%${modelInfo.hyperparameters.validationSplit * 100}` },
                ].map(item => (
                  <div key={item.label}>
                    <p className="text-[10px] text-slate-500 mb-1">{item.label}</p>
                    <p className="text-sm font-black text-violet-400 font-mono">{item.value}</p>
                  </div>
                ))}
              </div>
            )}

            {modelInfo?.architecture && (
              <div className="pt-4 border-t border-slate-800">
                <p className="text-[10px] text-slate-500 mb-3">Katman Mimarisi</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { name: 'Input', detail: `[${modelInfo.architecture.windowSize}, 1]`, color: 'bg-blue-600' },
                    { name: 'LSTM', detail: `${modelInfo.architecture.lstmUnits} birim`, color: 'bg-violet-600' },
                    { name: 'Dropout', detail: `${modelInfo.architecture.dropoutRate * 100}%`, color: 'bg-amber-600' },
                    { name: 'Dense', detail: `${modelInfo.architecture.denseUnits} birim, ReLU`, color: 'bg-emerald-600' },
                    { name: 'Output', detail: '1 birim, Linear', color: 'bg-rose-600' },
                  ].map((layer, i) => (
                    <div key={layer.name} className="flex items-center gap-2">
                      <div className={`${layer.color} px-3 py-1.5 rounded-lg`}>
                        <p className="text-[10px] font-bold text-white">{layer.name}</p>
                        <p className="text-[9px] text-white/70">{layer.detail}</p>
                      </div>
                      {i < 4 && <span className="text-slate-600 text-xs">→</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  )
}

export default DeviceForecast
