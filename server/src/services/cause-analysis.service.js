/**
 * Tahmin Neden Analizi — 5 Perspektif
 *
 * Her perspektif TAM OLARAK 1 neden üretir.
 * Her cihaz için her zaman 5 neden döner.
 *
 *   1. Trend       → Değer yükseliyor mu, düşüyor mu, sabit mi?
 *   2. Anlık Durum  → Değer şu an hangi bölgede? (optimal / uyarı / kritik)
 *   3. Dalgalanma   → Ölçümler ne kadar stabil veya kararsız?
 *   4. Ani Değişim  → Son ölçümlerde ani bir sıçrama var mı?
 *   5. Tahmin Yönü  → ARIMA modeli ne öngörüyor?
 */

const THRESHOLDS = {
  TEMPERATURE: {
    critical: { low: -5, high: 40 },
    warning: { low: 2, high: 35 },
    optimal: { low: 18, high: 26 },
  },
  HUMIDITY: {
    critical: { low: 15, high: 90 },
    warning: { low: 25, high: 75 },
    optimal: { low: 35, high: 60 },
  },
}

function analyzeCauses(timeSeries, timestamps, forecast, stats, trend, measurementType) {
  const mt = (measurementType || 'TEMPERATURE').toUpperCase()
  const thresholds = THRESHOLDS[mt] || THRESHOLDS.TEMPERATURE
  const isTemp = mt === 'TEMPERATURE'
  const unit = isTemp ? '°C' : '%'
  const label = isTemp ? 'Sıcaklık' : 'Nem'

  const n = timeSeries.length
  const lastValue = n > 0 ? timeSeries[n - 1] : 0
  const forecastFirst = forecast[0]?.value ?? lastValue
  const forecastLast = forecast[forecast.length - 1]?.value ?? forecastFirst

  return [
    analyzeTrend(timeSeries, unit, label),
    analyzeThreshold(lastValue, thresholds, unit, label, isTemp),
    analyzeVolatility(timeSeries, unit, label, isTemp),
    analyzeAnomaly(timeSeries, stats.stdDev, unit, label, isTemp),
    analyzeForecastDirection(lastValue, forecastFirst, forecastLast, forecast, unit, label),
  ]
}

// ─── 1. TREND ───────────────────────────────────────────────

function analyzeTrend(timeSeries, unit, label) {
  const n = timeSeries.length
  if (n < 6) {
    return cause('trend', 'info', `${label} Trendi`, 'Yetersiz veri', 'Trend hesaplamak için yeterli veri yok.', '—')
  }

  const half = Math.floor(n / 2)
  const oldMean = avg(timeSeries.slice(0, half))
  const newMean = avg(timeSeries.slice(half))
  const diff = newMean - oldMean
  const rate = diff / half

  if (Math.abs(rate) < 0.03) {
    return cause('trend', 'info', `${label} Kararlı`, `Değer sabit seyretmektedir.`, `Son ölçümlerde belirgin bir yükseliş veya düşüş trendi gözlemlenmemektedir. Ortalama değer ${avg(timeSeries).toFixed(1)}${unit} civarında seyretmektedir.`, `~${avg(timeSeries).toFixed(1)}${unit}`)
  }

  const direction = diff > 0 ? 'Yükseliş' : 'Düşüş'
  const severity = Math.abs(diff) > 3 ? 'warning' : 'info'

  return cause('trend', severity, `${label} ${direction} Trendi`,
    `${label} son ölçümlerde ${Math.abs(diff).toFixed(1)}${unit} ${diff > 0 ? 'artış' : 'düşüş'} göstermiştir.`,
    `Eski ölçüm ortalaması ${oldMean.toFixed(1)}${unit}, son ölçüm ortalaması ${newMean.toFixed(1)}${unit}. ARIMA modeli bu trendi tahmine yansıtmaktadır.`,
    `${diff > 0 ? '+' : ''}${diff.toFixed(1)}${unit}`)
}

// ─── 2. ANLIK DURUM ─────────────────────────────────────────

function analyzeThreshold(lastValue, thresholds, unit, label, isTemp) {
  if (lastValue < thresholds.critical.low || lastValue > thresholds.critical.high) {
    const side = lastValue < thresholds.critical.low ? 'düşük' : 'yüksek'
    const hint = isTemp
      ? (side === 'düşük' ? 'Donma riski bulunmaktadır.' : 'Aşırı ısınma tespit edilmiştir.')
      : (side === 'düşük' ? 'Aşırı kuru ortam.' : 'Aşırı nemli ortam.')

    return cause('threshold', 'critical', `${label} Kritik Seviyede`,
      `Mevcut değer (${lastValue.toFixed(1)}${unit}) kritik eşiğin ${side === 'düşük' ? 'altında' : 'üstünde'}dir.`,
      `${hint} Kritik aralık: ${thresholds.critical.low}${unit} – ${thresholds.critical.high}${unit}.`,
      `${lastValue.toFixed(1)}${unit}`)
  }

  if (lastValue < thresholds.warning.low || lastValue > thresholds.warning.high) {
    const side = lastValue < thresholds.warning.low ? 'düşük' : 'yüksek'
    return cause('threshold', 'warning', `${label} Uyarı Bölgesinde`,
      `Mevcut değer (${lastValue.toFixed(1)}${unit}) uyarı bölgesindedir.`,
      `Optimal aralık: ${thresholds.optimal.low}${unit} – ${thresholds.optimal.high}${unit}.`,
      `${lastValue.toFixed(1)}${unit}`)
  }

  if (lastValue >= thresholds.optimal.low && lastValue <= thresholds.optimal.high) {
    return cause('threshold', 'info', `${label} Optimal Aralıkta`,
      `Mevcut değer (${lastValue.toFixed(1)}${unit}) ideal aralıktadır.`,
      `Optimal aralık: ${thresholds.optimal.low}${unit} – ${thresholds.optimal.high}${unit}.`,
      `${lastValue.toFixed(1)}${unit}`)
  }

  return cause('threshold', 'info', `${label} Normal Aralıkta`,
    `Mevcut değer (${lastValue.toFixed(1)}${unit}) normal sınırlar içindedir.`,
    `Uyarı eşikleri: ${thresholds.warning.low}${unit} – ${thresholds.warning.high}${unit}.`,
    `${lastValue.toFixed(1)}${unit}`)
}

// ─── 3. DALGALANMA ──────────────────────────────────────────

function analyzeVolatility(timeSeries, unit, label, isTemp) {
  const n = timeSeries.length
  if (n < 5) {
    return cause('volatility', 'info', 'Dalgalanma', 'Yetersiz veri.', '', '—')
  }

  const recent = timeSeries.slice(-20)
  const recentStd = stdDev(recent)
  const globalStd = stdDev(timeSeries)
  const ratio = globalStd > 0 ? recentStd / globalStd : 1

  if (ratio > 1.8 || recentStd > (isTemp ? 2.5 : 8)) {
    return cause('volatility', 'warning', 'Yüksek Dalgalanma',
      `Ölçümler normalden çok daha fazla dalgalanmaktadır (σ=${recentStd.toFixed(1)}${unit}).`,
      `${isTemp ? 'Soğutma/ısıtma sistemi düzensiz çalışıyor veya dış etkenler etkili olabilir.' : 'Havalandırma sistemi kararsız olabilir.'} Tahmin güven aralığı bu nedenle geniştir.`,
      `σ=${recentStd.toFixed(1)}${unit}`)
  }

  if (ratio < 0.5 || recentStd < (isTemp ? 0.3 : 2)) {
    return cause('volatility', 'info', 'Düşük Dalgalanma',
      `Ölçümler oldukça kararlıdır (σ=${recentStd.toFixed(1)}${unit}).`,
      `${isTemp ? 'Ortam kontrol sistemi etkin çalışmaktadır.' : 'Nem kontrol sistemi etkin çalışmaktadır.'} Tahmin güvenilirliği yüksektir.`,
      `σ=${recentStd.toFixed(1)}${unit}`)
  }

  return cause('volatility', 'info', 'Normal Dalgalanma',
    `Ölçüm dalgalanması beklenen aralıktadır (σ=${recentStd.toFixed(1)}${unit}).`,
    'Tahmin güven aralığı makul genişliktedir.',
    `σ=${recentStd.toFixed(1)}${unit}`)
}

// ─── 4. ANİ DEĞİŞİM ────────────────────────────────────────

function analyzeAnomaly(timeSeries, globalStdDev, unit, label, isTemp) {
  const n = timeSeries.length
  if (n < 3 || globalStdDev === 0) {
    return cause('anomaly', 'info', 'Ani Değişim Yok', 'Son ölçümlerde ani bir sıçrama tespit edilmemiştir.', '', '—')
  }

  const lookback = Math.min(10, n - 1)
  let maxJump = 0

  for (let i = n - lookback; i < n; i++) {
    const jump = Math.abs(timeSeries[i] - timeSeries[i - 1])
    if (jump > maxJump) maxJump = jump
  }

  const threshold = Math.max(globalStdDev * 2.5, isTemp ? 2 : 5)

  if (maxJump > threshold) {
    const severity = maxJump > globalStdDev * 4 ? 'critical' : 'warning'
    const hint = isTemp
      ? 'Kapı/kapak açılması, soğutma sistemi arızası veya dış ortam etkisi kaynaklı olabilir.'
      : 'Havalandırma değişikliği veya dış ortam etkisi kaynaklı olabilir.'

    return cause('anomaly', severity, `Ani ${label} Değişimi`,
      `Son ölçümlerde ${maxJump.toFixed(1)}${unit} büyüklüğünde ani bir sıçrama tespit edilmiştir.`,
      `${hint} Normal sapma: ${globalStdDev.toFixed(1)}${unit}.`,
      `${maxJump.toFixed(1)}${unit}`)
  }

  return cause('anomaly', 'info', 'Ani Değişim Yok',
    'Son ölçümlerde ani bir sıçrama tespit edilmemiştir.',
    `Maksimum ardışık değişim ${maxJump.toFixed(1)}${unit} olup normal sınırlar içindedir.`,
    `${maxJump.toFixed(1)}${unit}`)
}

// ─── 5. TAHMİN YÖNÜ ────────────────────────────────────────

function analyzeForecastDirection(lastValue, forecastFirst, forecastLast, forecast, unit, label) {
  if (!forecast.length) {
    return cause('forecast', 'info', 'Tahmin Yönü', 'Tahmin verisi bulunamadı.', '', '—')
  }

  const totalChange = forecastLast - lastValue

  if (Math.abs(totalChange) < 0.5) {
    return cause('forecast', 'info', `${label} Stabil Öngörüsü`,
      `Model, değerin ${lastValue.toFixed(1)}${unit} civarında kalacağını öngörmektedir.`,
      `Tahmin edilen değişim (${totalChange > 0 ? '+' : ''}${totalChange.toFixed(1)}${unit}) ihmal edilebilir düzeydedir.`,
      `→ ${forecastLast.toFixed(1)}${unit}`)
  }

  const direction = totalChange > 0 ? 'Artış' : 'Düşüş'
  const severity = Math.abs(totalChange) > 5 ? 'warning' : 'info'

  return cause('forecast', severity, `${label} ${direction} Öngörüsü`,
    `Model, ${Math.abs(totalChange).toFixed(1)}${unit} ${totalChange > 0 ? 'artış' : 'düşüş'} öngörmektedir (${lastValue.toFixed(1)}${unit} → ${forecastLast.toFixed(1)}${unit}).`,
    'Bu öngörü mevcut veri trendinin devam edeceği varsayımına dayanmaktadır.',
    `→ ${forecastLast.toFixed(1)}${unit}`)
}

// ─── YARDIMCI ───────────────────────────────────────────────

function cause(type, severity, title, summary, detail, value) {
  return { type, severity, title, summary, detail, value }
}

function avg(arr) {
  if (!arr.length) return 0
  return arr.reduce((s, v) => s + v, 0) / arr.length
}

function stdDev(arr) {
  if (arr.length < 2) return 0
  const m = avg(arr)
  return Math.sqrt(arr.reduce((s, v) => s + Math.pow(v - m, 2), 0) / arr.length)
}

module.exports = { analyzeCauses }
