/**
 * Gelişmiş Tahmin Neden Analizi — 8 Perspektif
 *
 * Her perspektif TAM OLARAK 1 neden üretir.
 * Her cihaz için her zaman 8 neden döner.
 *
 *   1. Trend           → Değer yükseliyor mu, düşüyor mu, sabit mi?
 *   2. Anlık Durum      → Değer şu an hangi bölgede? (optimal / uyarı / kritik)
 *   3. Dalgalanma       → Ölçümler ne kadar stabil veya kararsız?
 *   4. Ani Değişim      → Son ölçümlerde ani bir sıçrama var mı?
 *   5. Tahmin Yönü      → LSTM modeli ne öngörüyor?
 *   6. Zaman Bağlamı    → Günün saati ölçümleri nasıl etkiliyor?
 *   7. Mevsimsel Bağlam → Mevsim ve hava koşulları ölçümleri nasıl etkiliyor?
 *   8. Cihaz Eşik       → Cihaza tanımlı min/max eşiklerine göre durum
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

const SEASONS = {
  winter: { months: [12, 1, 2], name: 'Kış', tempEffect: 'düşük', humidityEffect: 'yüksek' },
  spring: { months: [3, 4, 5], name: 'İlkbahar', tempEffect: 'değişken', humidityEffect: 'orta' },
  summer: { months: [6, 7, 8], name: 'Yaz', tempEffect: 'yüksek', humidityEffect: 'düşük' },
  autumn: { months: [9, 10, 11], name: 'Sonbahar', tempEffect: 'düşen', humidityEffect: 'artan' },
}

const TIME_PERIODS = {
  night:    { hours: [0, 1, 2, 3, 4, 5], name: 'Gece', tempDesc: 'Gece saatlerinde radyasyonel soğuma nedeniyle sıcaklık düşüş eğilimindedir.', humDesc: 'Gece saatlerinde bağıl nem genellikle yükselir.' },
  morning:  { hours: [6, 7, 8, 9, 10, 11], name: 'Sabah', tempDesc: 'Sabah saatlerinde güneş ışınımıyla sıcaklık artış eğilimindedir.', humDesc: 'Sabah çiğ oluşumu nedeniyle nem yüksek olabilir.' },
  afternoon:{ hours: [12, 13, 14, 15, 16, 17], name: 'Öğleden Sonra', tempDesc: 'Öğleden sonra güneş ışınımı maksimuma ulaşır; sıcaklık en yüksek seviyededir.', humDesc: 'Öğleden sonra artan sıcaklıkla bağıl nem düşme eğilimindedir.' },
  evening:  { hours: [18, 19, 20, 21, 22, 23], name: 'Akşam', tempDesc: 'Akşam saatlerinde güneş batışıyla birlikte sıcaklık düşmeye başlar.', humDesc: 'Akşam saatlerinde soğumayla birlikte nem artmaya başlar.' },
}

function analyzeCauses(timeSeries, timestamps, forecast, stats, trend, measurementType, device) {
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
    analyzeTimeContext(timestamps, timeSeries, unit, label, isTemp),
    analyzeSeasonalContext(timestamps, lastValue, unit, label, isTemp),
    analyzeDeviceThreshold(lastValue, forecast, device, unit, label),
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
    `Eski ölçüm ortalaması ${oldMean.toFixed(1)}${unit}, son ölçüm ortalaması ${newMean.toFixed(1)}${unit}. LSTM modeli bu trendi tahmine yansıtmaktadır.`,
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
    'Bu öngörü LSTM modelinin zaman serisi paternlerini öğrenmesiyle elde edilmiştir.',
    `→ ${forecastLast.toFixed(1)}${unit}`)
}

// ─── 6. ZAMAN BAĞLAMI ──────────────────────────────────────

function analyzeTimeContext(timestamps, timeSeries, unit, label, isTemp) {
  if (!timestamps.length) {
    return cause('time_context', 'info', 'Zaman Bağlamı', 'Zaman bilgisi mevcut değil.', '', '—')
  }

  const now = new Date()
  const currentHour = now.getHours()
  let currentPeriod = null

  for (const [key, period] of Object.entries(TIME_PERIODS)) {
    if (period.hours.includes(currentHour)) {
      currentPeriod = { key, ...period }
      break
    }
  }

  if (!currentPeriod) {
    return cause('time_context', 'info', 'Zaman Bağlamı', 'Zaman dilimi belirlenemedi.', '', '—')
  }

  const desc = isTemp ? currentPeriod.tempDesc : currentPeriod.humDesc

  const periodIndices = []
  for (let i = 0; i < timestamps.length; i++) {
    const ts = new Date(timestamps[i])
    if (currentPeriod.hours.includes(ts.getHours())) {
      periodIndices.push(i)
    }
  }

  let periodAvg = null
  if (periodIndices.length > 2) {
    const periodValues = periodIndices.map(i => timeSeries[i])
    periodAvg = avg(periodValues)
  }

  const lastValue = timeSeries[timeSeries.length - 1]
  let comparison = ''
  if (periodAvg !== null) {
    const diff = lastValue - periodAvg
    if (Math.abs(diff) > 1) {
      comparison = ` Aynı zaman dilimindeki ortalamaya göre ${Math.abs(diff).toFixed(1)}${unit} ${diff > 0 ? 'daha yüksek' : 'daha düşük'}.`
    } else {
      comparison = ` Aynı zaman dilimindeki ortalamayla uyumlu.`
    }
  }

  return cause('time_context', 'info', `${currentPeriod.name} Saatleri Etkisi`,
    `Şu an ${currentPeriod.name.toLowerCase()} saatlerindeyiz (${String(currentHour).padStart(2, '0')}:00).`,
    `${desc}${comparison}`,
    `${currentPeriod.name}`)
}

// ─── 7. MEVSİMSEL BAĞLAM ───────────────────────────────────

function analyzeSeasonalContext(timestamps, lastValue, unit, label, isTemp) {
  const now = new Date()
  const currentMonth = now.getMonth() + 1
  let currentSeason = null

  for (const [key, season] of Object.entries(SEASONS)) {
    if (season.months.includes(currentMonth)) {
      currentSeason = { key, ...season }
      break
    }
  }

  if (!currentSeason) {
    return cause('seasonal', 'info', 'Mevsimsel Bağlam', 'Mevsim belirlenemedi.', '', '—')
  }

  const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']
  const monthName = monthNames[currentMonth - 1]

  const effect = isTemp ? currentSeason.tempEffect : currentSeason.humidityEffect

  let explanation = ''
  if (isTemp) {
    switch (currentSeason.key) {
      case 'winter':
        explanation = `Kış aylarında dış ortam sıcaklığı düşük olduğundan iç ortam sıcaklığı da etkilenebilir. Soğutma sistemleri daha az enerji harcar ancak izolasyon kayıpları artabilir. İstanbul ve çevresi için ortalama dış sıcaklık 3–10°C aralığındadır.`
        break
      case 'spring':
        explanation = `İlkbahar aylarında dış sıcaklıklar hızla değişir. Gece-gündüz sıcaklık farkı artır ve bu durum iç ortam sıcaklığında dalgalanmalara neden olabilir.`
        break
      case 'summer':
        explanation = `Yaz aylarında dış ortam sıcaklığı 25–35°C aralığına çıkar. Soğutma sistemleri yoğun çalışır ve enerji tüketimi artar. Soğuk oda sıcaklıklarında artış riski yükselir.`
        break
      case 'autumn':
        explanation = `Sonbahar aylarında sıcaklıklar düşüş eğilimindedir. Gece-gündüz farkları artmaya başlar ve ortam koşulları değişkenlik gösterir.`
        break
    }
  } else {
    switch (currentSeason.key) {
      case 'winter':
        explanation = `Kış aylarında kapalı ortamlarda ısıtma sistemleri havayı kurutur, nem düşebilir. Dış ortamda ise yağış nedeniyle nem genellikle yüksektir.`
        break
      case 'spring':
        explanation = `İlkbahar aylarında yağışlar ve sıcaklık değişimleri nem oranını doğrudan etkiler. Nem dalgalanmaları normaldir.`
        break
      case 'summer':
        explanation = `Yaz aylarında yüksek sıcaklıklar nedeniyle bağıl nem düşer. Ancak klima sistemleri havayı nemlendirebilir veya kurutabilir.`
        break
      case 'autumn':
        explanation = `Sonbahar aylarında sıcaklık düşüşüyle birlikte yoğuşma artar ve bağıl nem yükselme eğilimindedir.`
        break
    }
  }

  return cause('seasonal', 'info', `${currentSeason.name} Mevsimi Etkisi`,
    `${monthName} ayı ${currentSeason.name.toLowerCase()} mevsimine denk gelmektedir. ${isTemp ? 'Sıcaklık' : 'Nem'} etkisi: ${effect}.`,
    explanation,
    `${currentSeason.name}`)
}

// ─── 8. CİHAZ EŞİK ANALİZİ ─────────────────────────────────

function analyzeDeviceThreshold(lastValue, forecast, device, unit, label) {
  const minVal = device?.minValue
  const maxVal = device?.maxValue

  if (minVal == null && maxVal == null) {
    return cause('device_threshold', 'info', `${label} Eşik Tanımsız`,
      'Bu cihaz için özel min/max eşik değeri tanımlanmamıştır.',
      'Cihaz ayarlarından min ve max değerler tanımlanarak kişiselleştirilmiş uyarılar alabilirsiniz.',
      '—')
  }

  const violations = []

  if (minVal != null && lastValue < minVal) {
    violations.push({
      type: 'current_low',
      severity: 'critical',
      msg: `Anlık değer (${lastValue.toFixed(1)}${unit}) tanımlı minimum (${minVal}${unit}) altında.`,
    })
  }
  if (maxVal != null && lastValue > maxVal) {
    violations.push({
      type: 'current_high',
      severity: 'critical',
      msg: `Anlık değer (${lastValue.toFixed(1)}${unit}) tanımlı maksimum (${maxVal}${unit}) üstünde.`,
    })
  }

  for (const f of forecast) {
    if (minVal != null && f.value < minVal) {
      violations.push({
        type: 'forecast_low',
        severity: 'warning',
        msg: `Tahmin edilen değer (${f.value}${unit}) minimum eşiğin (${minVal}${unit}) altına düşebilir.`,
      })
      break
    }
    if (maxVal != null && f.value > maxVal) {
      violations.push({
        type: 'forecast_high',
        severity: 'warning',
        msg: `Tahmin edilen değer (${f.value}${unit}) maksimum eşiğin (${maxVal}${unit}) üstüne çıkabilir.`,
      })
      break
    }
  }

  if (violations.length === 0) {
    const range = [minVal, maxVal].filter(v => v != null)
    const rangeStr = range.length === 2
      ? `${minVal}${unit} – ${maxVal}${unit}`
      : (minVal != null ? `min: ${minVal}${unit}` : `max: ${maxVal}${unit}`)

    return cause('device_threshold', 'info', `${label} Eşik Uyumlu`,
      `Anlık ve tahmin edilen değerler tanımlı eşikler (${rangeStr}) içindedir.`,
      'Herhangi bir eşik ihlali tespit edilmemiştir.',
      `${lastValue.toFixed(1)}${unit}`)
  }

  const worstSeverity = violations.some(v => v.severity === 'critical') ? 'critical' : 'warning'
  const title = worstSeverity === 'critical' ? `${label} Eşik İhlali` : `${label} Eşik Uyarısı`
  const summary = violations[0].msg
  const detail = violations.length > 1
    ? violations.map(v => v.msg).join(' ')
    : `Cihaz eşikleri: ${minVal != null ? `min=${minVal}${unit}` : ''} ${maxVal != null ? `max=${maxVal}${unit}` : ''}.`

  return cause('device_threshold', worstSeverity, title, summary, detail, `${lastValue.toFixed(1)}${unit}`)
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
