import { useEffect, useState } from 'react'
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
import { FaArrowUp, FaArrowDown, FaMinus, FaChevronLeft, FaSync } from 'react-icons/fa'
import { format, parseISO } from 'date-fns'
import { tr } from 'date-fns/locale'
import { fetchDeviceForecast } from '../../../features/predictions/predictions.api'

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

    // Hem geçmiş ölçümü hem de geçmiş tahmini aynı anda bulabilmek için payload'ı ayrıştırıyoruz
    const histItem = payload.find(p => p.dataKey === 'historicalValue')
    const forecastItem = payload.find(p => p.dataKey === 'forecastValue')
    const upperItem = payload.find(p => p.dataKey === 'upper')
    const lowerItem = payload.find(p => p.dataKey === 'lower')

    return (
        <div className="bg-slate-900/95 border border-slate-700 rounded-xl px-4 py-3 shadow-xl text-xs">
            <p className="text-slate-400 mb-2 font-medium">{formatFullTime(label)}</p>
            <div className="space-y-1.5">
                {/* Gerçek Ölçüm (Mavi) */}
                {histItem && histItem.value !== null && histItem.value !== undefined && (
                    <p className="text-indigo-400 font-bold text-sm">
                        Ölçüm: <span className="text-white">{histItem.value}{unit}</span>
                    </p>
                )}
                {/* Tahmin Edilen Değer (Kırmızı) - Hem geçmişte hem gelecekte çalışır */}
                {forecastItem && forecastItem.value !== null && forecastItem.value !== undefined && (
                    <p className="text-red-400 font-bold text-sm">
                        Tahmin: <span className="text-white">{forecastItem.value}{unit}</span>
                    </p>
                )}
                {/* Güven Aralıkları (Sadece gelecekteki tahminler için gelir) */}
                {upperItem && upperItem.value !== null && lowerItem && lowerItem.value !== null && (
                    <p className="text-slate-500 mt-1 text-[10px]">
                        Üst: {upperItem.value}{unit}
                        <span className="mx-1">·</span>
                        Alt: {lowerItem.value}{unit}
                    </p>
                )}
            </div>
        </div>
    )
}

const DeviceForecast = ({ device, onBack }) => {
    const dispatch = useDispatch()
    const forecastState = useSelector(s => s.predictions.byDevice[device.id])

    const [timeRange, setTimeRange] = useState('hourly')

    useEffect(() => {
        dispatch(fetchDeviceForecast({ id: device.id, timeRange }));

        const intervalId = setInterval(() => {
            dispatch(fetchDeviceForecast({ id: device.id, timeRange }));
        }, 20000);

        return () => clearInterval(intervalId);
    }, [device.id, timeRange, dispatch]);

    const refresh = () => dispatch(fetchDeviceForecast({ id: device.id, timeRange }))

    const meta = measurementMeta[device.measurementType?.toLowerCase()] || { unit: '', label: 'Değer', color: '#6366f1' }

    let chartData = []
    let trendKey = 'stable'
    let stats = null
    let nowIndex = -1

    if (forecastState?.data) {
        const { historical, forecast, trend, stats: s } = forecastState.data
        trendKey = trend
        stats = s

        chartData = [
            ...historical.map(h => ({
                time: h.time,
                historicalValue: h.value,
                // Backend'den geçmiş tahmin verisi 'predictedValue' ile geliyorsa bunu kırmızı çizgi olarak grafiğe ekliyoruz
                forecastValue: h.predictedValue !== undefined ? h.predictedValue : null,
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

    return (
        <div className="animate-fadeSlideIn">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
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

                <div className="flex items-center gap-2">
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button
                            onClick={() => setTimeRange('hourly')}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${timeRange === 'hourly' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            Saatlik (Anlık)
                        </button>
                        <button
                            onClick={() => setTimeRange('daily')}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${timeRange === 'daily' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            24 Saat (Trend)
                        </button>
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
            </div>

            {/* Loading state */}
            {forecastState?.isLoading && (
                <div className="flex flex-col items-center justify-center py-32 gap-4">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500 animate-bounce1" />
                        <div className="w-3 h-3 rounded-full bg-red-500 animate-bounce2" />
                        <div className="w-3 h-3 rounded-full bg-red-500 animate-bounce3" />
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

                        <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-2xl p-4 shadow-sm">
                            <p className="text-xs font-medium text-red-500 mb-1">Sonraki Tahmin</p>
                            <p className="text-2xl font-black text-red-700">
                                {stats?.nextPredicted}<span className="text-lg font-semibold text-red-400 ml-0.5">{meta.unit}</span>
                            </p>
                        </div>

                        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                            <p className="text-xs font-medium text-slate-400 mb-1">Ortalama</p>
                            <p className="text-2xl font-black text-slate-700">
                                {stats?.mean}<span className="text-lg font-semibold text-slate-400 ml-0.5">{meta.unit}</span>
                            </p>
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
                                <h3 className="text-sm font-bold text-slate-800">Zaman Serisi & Tahmin</h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Geçmiş ölçümler ve yapay zeka destekli tahmin
                                </p>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-500">
                                <span className="flex items-center gap-1.5">
                                    <span className="w-6 h-0.5 bg-indigo-500 rounded-full inline-block" />
                                    Geçmiş
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="w-6 h-0.5 bg-red-500 rounded-full border-dashed inline-block" style={{ borderBottom: '2px dashed #ef4444' }} />
                                    Tahmin
                                </span>
                            </div>
                        </div>

                        <div style={{ height: 340 }} className="px-2 pb-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                    <defs>
                                        <linearGradient id="ciGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0.03} />
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
                                        stroke="#ef4444"
                                        strokeWidth={2.5}
                                        strokeDasharray="6 3"
                                        dot={false}
                                        connectNulls={false}
                                        name="LSTM Tahmini"
                                        activeDot={{ r: 4, fill: '#ef4444', stroke: 'white', strokeWidth: 2 }}
                                    />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>
            )}
        </div>
    )
}

export default DeviceForecast