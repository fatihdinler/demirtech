/**
 * Root-Cause Analysis Engine
 *
 * Eşik aşımı tespit edildiğinde, son N okumayı analiz ederek
 * anomalinin en olası fiziksel sebebini belirler.
 *
 * Yaklaşım:
 *   1. Son 30 okumadan pattern çıkar (trend, volatilite, spike, değişim hızı)
 *   2. Cihazın causeContext'i ile eşleştir (sealed/semi-open, cooling, defrost, ...)
 *   3. Kural tabanlı eşleştirme ile en olası sebebi seç
 *   4. Sebep + güven seviyesi + öneriler döndür
 *
 * Bu modül hem simülasyon hem gerçek cihazlar için çalışır.
 * causeContext yoksa measurementType'a göre varsayılan context kullanılır.
 */

const { getDeviceDataModel } = require('../helpers/device-data.helper')

const ANALYSIS_WINDOW = 30

const DEFAULT_CONTEXTS = {
  TEMPERATURE: { environment: 'sealed', cooling: true, defrostCycle: false, frequentAccess: false },
  HUMIDITY: { environment: 'controlled', cooling: false, defrostCycle: false, frequentAccess: false },
}

// ─── ANA FONKSİYON ──────────────────────────────────────────

async function analyzeRootCause({ deviceId, measurementType, value, minValue, maxValue, causeContext }) {
  const mt = (measurementType || 'TEMPERATURE').toUpperCase()
  const context = causeContext || DEFAULT_CONTEXTS[mt] || DEFAULT_CONTEXTS.TEMPERATURE

  const direction = (maxValue != null && value > maxValue) ? 'high'
    : (minValue != null && value < minValue) ? 'low'
    : null

  if (!direction) return null

  try {
    const readings = await fetchRecentReadings(deviceId, ANALYSIS_WINDOW)
    if (readings.length < 5) {
      return fallbackCause(mt, direction, context)
    }

    const values = readings.map(r => r.value)
    const pattern = analyzePattern(values)

    return matchCause({ pattern, measurementType: mt, direction, context })
  } catch (err) {
    console.error('[RootCause] Analiz hatası:', err.message)
    return fallbackCause(mt, direction, context)
  }
}

// ─── VERİ OKUMA ──────────────────────────────────────────────

async function fetchRecentReadings(deviceId, count) {
  const Model = getDeviceDataModel(deviceId)
  const docs = await Model.find().sort({ occurredTime: -1 }).limit(count).lean()
  return docs.reverse()
}

// ─── PATTERN ANALİZİ ─────────────────────────────────────────

function analyzePattern(values) {
  const n = values.length
  return {
    trend: linearSlope(values),
    volatility: stdDev(values),
    recentDelta: recentChangeDelta(values),
    spikeDetected: detectSpike(values),
    rateOfChange: instantRate(values),
    mean: mean(values),
    n,
  }
}

function linearSlope(values) {
  const n = values.length
  if (n < 2) return 0
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0
  for (let i = 0; i < n; i++) {
    sumX += i
    sumY += values[i]
    sumXY += i * values[i]
    sumX2 += i * i
  }
  const denom = n * sumX2 - sumX * sumX
  if (denom === 0) return 0
  return (n * sumXY - sumX * sumY) / denom
}

function mean(arr) {
  if (!arr.length) return 0
  return arr.reduce((a, b) => a + b, 0) / arr.length
}

function stdDev(arr) {
  if (arr.length < 2) return 0
  const m = mean(arr)
  return Math.sqrt(arr.reduce((s, v) => s + (v - m) ** 2, 0) / (arr.length - 1))
}

function detectSpike(values) {
  const n = values.length
  if (n < 5) return false
  const sd = stdDev(values)
  if (sd === 0) return false
  for (let i = Math.max(1, n - 5); i < n; i++) {
    if (Math.abs(values[i] - values[i - 1]) > sd * 2.0) return true
  }
  return false
}

function recentChangeDelta(values) {
  const n = values.length
  if (n < 6) return 0
  const split = Math.min(5, Math.floor(n / 3))
  return mean(values.slice(-split)) - mean(values.slice(0, -split))
}

function instantRate(values) {
  const n = values.length
  if (n < 3) return 0
  return (values[n - 1] - values[n - 3]) / 2
}

// ─── SEBEP EŞLEŞTİRME ───────────────────────────────────────

function matchCause({ pattern, measurementType, direction, context }) {
  const isTemp = measurementType === 'TEMPERATURE'

  if (isTemp && direction === 'high') return matchTempHigh(pattern, context)
  if (isTemp && direction === 'low')  return matchTempLow(pattern, context)
  if (!isTemp && direction === 'high') return matchHumidityHigh(pattern, context)
  return matchHumidityLow(pattern, context)
}

// ══════════════════════════════════════════════════════════════
// SICAKLIK — YÜKSEK (value > maxValue)
// ══════════════════════════════════════════════════════════════

function matchTempHigh(pattern, ctx) {
  const { trend, volatility, spikeDetected, rateOfChange, recentDelta } = pattern
  const { environment, cooling, defrostCycle, frequentAccess } = ctx

  if (environment === 'sealed' || environment === 'controlled') {
    if (defrostCycle && spikeDetected && rateOfChange > 0.3) {
      return cause(
        'Defrost Döngüsü (Normal İşletim)',
        'Sıcaklık artışı cihazın otomatik defrost döngüsüyle uyumludur. Evaporatör üzerinde biriken buz periyodik olarak eritilir ve bu süreçte iç sıcaklık geçici olarak yükselir. Döngü tamamlandığında sıcaklık normal aralığa dönecektir.',
        'high',
        [
          'İzlemeye devam edin — defrost sonrası sıcaklık düşecektir',
          'Defrost süresi 30 dakikayı aşarsa teknik servis çağırın',
          'Defrost sıklığı artmışsa evaporatör temizliği yaptırın',
        ]
      )
    }

    if (spikeDetected && Math.abs(rateOfChange) > 0.4) {
      return cause(
        'Kapak/Kapı Açık Kalmış Olabilir',
        'Son okumalarda ani bir sıcaklık artışı tespit edildi. Bu patern, birimin kapak veya kapısının açık kalmasıyla sıcak ortam havasının içeri girmesine işaret etmektedir. Açık kalan kapı soğutma kompresörünün sürekli çalışmasına ve enerji kaybına neden olur.',
        frequentAccess ? 'high' : 'medium',
        [
          'Kapak ve kapı durumunu derhal kontrol edin',
          'Kapı contalarını aşınma ve deformasyon açısından inceleyin',
          'Otomatik kapı kapatma mekanizmasını kontrol edin',
          'Personeli kapı açık kalma süresini minimize etmesi konusunda uyarın',
        ]
      )
    }

    if (cooling && trend > 0.03 && volatility < 2.0 && !spikeDetected) {
      return cause(
        'Kompresör Performans Kaybı',
        'Sıcaklık son okumalarda kademeli ve istikrarlı bir yükseliş göstermektedir. Bu patern, soğutma kompresörünün verimliliğinin düştüğüne veya soğutucu akışkan (freon) kaçağı olabileceğine işaret eder. Kompresör artan ısı yükünü karşılayamadığında birim içi sıcaklık yavaşça yükselir.',
        'high',
        [
          'Kompresör çalışma sesini ve titreşimini kontrol edin',
          'Soğutucu gaz (freon) seviyesini kontrol ettirin',
          'Kondenser bobinlerini temizleyin — toz birikimi verimliliği düşürür',
          'Kompresör çalışma süresini izleyin — sürekli çalışma arıza belirtisidir',
          'Acil değilse teknik servis randevusu alın',
        ]
      )
    }

    if (recentDelta > 0.8 && trend > 0 && !spikeDetected) {
      return cause(
        'Aşırı Ürün Yüklemesi',
        'Birime kısa süre içinde fazla miktarda ürün yüklenmiş olabilir. Yeni yüklenen ürünlerin ısısı birim içi sıcaklığı yükseltmiştir. Soğutma sistemi artan ısı yükünü dengelemek için daha uzun süre çalışacaktır.',
        'medium',
        [
          'Birim içindeki ürün miktarını ve yerleşimini kontrol edin',
          'Hava sirkülasyonunu engelleyen ürün yığılmalarını düzeltin',
          'Yeni ürünleri yüklemeden önce ön soğutma uygulayın',
          'Yükleme miktarını birimin soğutma kapasitesiyle orantılı tutun',
        ]
      )
    }

    if (cooling) {
      return cause(
        'İzolasyon veya Conta Bozulması',
        'Sıcaklık yükselişi belirgin bir tek sebebe işaret etmemektedir. Bu durum genellikle birimin izolasyon panellerinde veya kapı contalarında oluşan aşınma/bozulma kaynaklıdır. İzolasyon kaybı dış ortamdan sürekli ısı transferine neden olarak iç sıcaklığı yavaşça yükseltir.',
        'low',
        [
          'İzolasyon panellerini gözle kontrol edin — çatlak, şişme veya nem arayın',
          'Kapı contalarını parmakla kontrol edin — sertleşme veya deformasyon var mı',
          'Birim etrafında anormal sıcak noktalar olup olmadığını kontrol edin',
          'Gerekirse izolasyon tamiratı veya conta değişimi yaptırın',
        ]
      )
    }
  }

  if (environment === 'semi-open') {
    if (spikeDetected) {
      return cause(
        'Yükleme/Boşaltma Operasyonu',
        'Yükleme alanında ani bir sıcaklık artışı tespit edildi. Bu durum genellikle araç veya malzeme giriş-çıkışı sırasında kapıların uzun süre açık kalması ve sıcak dış havanın alana girmesiyle oluşur.',
        'medium',
        [
          'Yükleme/boşaltma süresini minimize edin',
          'Hava perdesi (air curtain) sistemini kontrol edin',
          'Dock kapılarının araç yokken kapalı tutulmasını sağlayın',
          'Operasyonları mümkünse serin saatlere planlayın',
        ]
      )
    }

    return cause(
      'Dış Hava Sıcaklığı Etkisi',
      'Yarı açık alandaki sıcaklık dış ortam koşullarından doğrudan etkilenmektedir. Gün içi güneş ışınımı ve dış hava sıcaklığının artışıyla birlikte alan sıcaklığı da yükselmektedir. Bu, yarı açık alanlar için beklenen bir durumdur.',
      'high',
      [
        'Sıcaklığa hassas ürünlerin bu alanda bekleme süresini sınırlayın',
        'Yükleme operasyonlarını sabah erken veya akşam serin saatlere kaydırın',
        'Gölgelendirme veya fan sistemi ile hava sirkülasyonunu iyileştirin',
        'Gerekirse portatif soğutma ünitesi kullanmayı değerlendirin',
      ]
    )
  }

  return cause(
    'Ortam Sıcaklığı Yükselmesi',
    'Birimin sıcaklığı tanımlı üst eşiğin üzerine çıkmıştır. Mevcut veri paterni kesin bir tek sebebe işaret etmemektedir.',
    'low',
    ['Soğutma sistemini kontrol edin', 'Ortam koşullarını değerlendirin']
  )
}

// ══════════════════════════════════════════════════════════════
// SICAKLIK — DÜŞÜK (value < minValue)
// ══════════════════════════════════════════════════════════════

function matchTempLow(pattern, ctx) {
  const { trend, spikeDetected, rateOfChange } = pattern
  const { environment, cooling } = ctx

  if (environment === 'sealed' || environment === 'controlled') {
    if (cooling && trend < -0.03) {
      return cause(
        'Termostat veya Kontrol Sistemi Arızası',
        'Sıcaklık normal aralığın altına düşmüş ve düşüş trendi devam etmektedir. Bu durum termostat sensöründe veya soğutma kontrol ünitesinde bir arızaya işaret edebilir. Kompresör gereğinden fazla çalışarak birimi aşırı soğutmaktadır.',
        'high',
        [
          'Termostat ayarlarını ve sensör durumunu kontrol edin',
          'Kompresörün sürekli çalışıp çalışmadığını gözlemleyin',
          'Kontrol kartı (PCB) hata kodlarını okuyun',
          'Ürünlerde donma riski varsa acil müdahale edin',
        ]
      )
    }

    if (cooling && spikeDetected && rateOfChange < -0.3) {
      return cause(
        'Soğutma Sistemi Ani Devreye Girişi',
        'Kısa süre içinde sert bir sıcaklık düşüşü yaşandı. Soğutma sistemi normalden daha agresif çalışmış olabilir. Bu durum solenoid valf arızası, kontrol parametrelerinin yanlış ayarlanması veya defrost sonrası aşırı telafi soğutmasından kaynaklanabilir.',
        'medium',
        [
          'Soğutma sisteminin set point değerlerini kontrol edin',
          'Solenoid valf çalışmasını gözlemleyin',
          'Ürünlerin donma durumunu kontrol edin',
        ]
      )
    }

    return cause(
      'Soğutma Sistemi Aşırı Çalışması',
      'Birim içi sıcaklık beklenen minimum değerin altına düşmüştür. Soğutma sistemi, olması gerekenden daha yoğun çalışıyor olabilir.',
      'low',
      [
        'Termostat set noktasını kontrol edin',
        'Birimin boş veya az yüklü olup olmadığını değerlendirin',
        'Dış ortam sıcaklığının düşüklüğü de etkili olabilir',
      ]
    )
  }

  if (environment === 'semi-open') {
    return cause(
      'Dış Hava Sıcaklığı Düşüklüğü',
      'Yarı açık alan dış ortam koşullarından doğrudan etkilenmektedir. Gece saatlerinde veya mevsimsel soğuklarda alan sıcaklığı düşebilir. Bu durum radyasyonel soğuma ve düşük dış hava sıcaklığıyla ilişkilidir.',
      'high',
      [
        'Soğuğa hassas ürünleri kapalı alanlara taşıyın',
        'Gerekirse ısıtıcı veya sıcak hava perdesi kullanın',
        'Gece saatlerinde dock kapılarını kapalı tutun',
      ]
    )
  }

  return cause(
    'Ortam Sıcaklığı Düşüşü',
    'Birimin sıcaklığı tanımlı alt eşiğin altına inmiştir.',
    'low',
    ['Soğutma sistemi ayarlarını kontrol edin', 'Dış ortam koşullarını değerlendirin']
  )
}

// ══════════════════════════════════════════════════════════════
// NEM — YÜKSEK (value > maxValue)
// ══════════════════════════════════════════════════════════════

function matchHumidityHigh(pattern, ctx) {
  const { trend, volatility, spikeDetected, recentDelta } = pattern
  const { environment, frequentAccess } = ctx

  if (environment === 'sealed' || environment === 'controlled') {
    if (trend > 0.05 && volatility < 3.0 && !spikeDetected) {
      return cause(
        'Havalandırma Sistemi Yetersizliği',
        'Nem oranı kademeli ve istikrarlı bir yükseliş göstermektedir. Havalandırma veya nem kontrol sistemi yeterli performansı sağlayamıyor olabilir. Fan motorları, filtreler veya nem alıcı (dehumidifier) ünitenin kontrol edilmesi gerekmektedir.',
        'high',
        [
          'Havalandırma fan motorlarının çalışma durumunu kontrol edin',
          'Hava filtrelerinin tıkanıp tıkanmadığını kontrol edin',
          'Nem alıcı (dehumidifier) ünitenin çalışmasını doğrulayın',
          'Havalandırma kanallarında tıkanma olup olmadığını kontrol edin',
        ]
      )
    }

    if (spikeDetected) {
      return cause(
        'Kapak Açık — Nemli Hava Girişi',
        'Ani bir nem artışı tespit edildi. Kapak veya kapının açılmasıyla dış ortamın nemli havası içeri girmiş olabilir. Sıcak ve nemli dış hava soğuk birime girdiğinde yoğuşma da oluşabilir.',
        frequentAccess ? 'high' : 'medium',
        [
          'Kapak ve kapı durumunu kontrol edin',
          'Kapı contalarının sızdırmazlığını inceleyin',
          'Dış ortam nem seviyesi yüksekse hava perdesi kullanın',
          'Yoğuşma oluştuysa ürünleri kontrol edin',
        ]
      )
    }

    if (recentDelta > 1.5 && trend > 0) {
      return cause(
        'Ürün Nem Salınımı',
        'Birim içindeki nem oranı ürünlerden kaynaklanan nem salınımı nedeniyle yükselmiş olabilir. Taze meyve, sebze ve et ürünleri ortama nem verir. Yeni yüklenen ürünlerin yüzey nemi de bu artışa katkıda bulunabilir.',
        'medium',
        [
          'Birime son yüklenen ürünlerin nem durumunu kontrol edin',
          'Ürünleri yüklemeden önce yüzey nemini kurutun',
          'Havalandırma kapasitesini artırmayı değerlendirin',
          'Nem emici malzeme (silika jel vb.) kullanmayı düşünün',
        ]
      )
    }

    return cause(
      'Nem Kontrol Sistemi Performans Düşüklüğü',
      'Nem oranı üst eşiğin üzerine çıkmıştır. Ortam nem kontrol sistemi yeterli kapasitede çalışmıyor olabilir.',
      'low',
      [
        'Nem kontrol ünitesini kontrol edin',
        'Havalandırma kanallarını inceleyin',
        'Drenaj sistemini kontrol edin — tıkanma nem birikimine yol açabilir',
      ]
    )
  }

  if (environment === 'semi-open') {
    if (spikeDetected) {
      return cause(
        'Yükleme Operasyonu — Nemli Ortam Girişi',
        'Yükleme alanında ani bir nem artışı tespit edildi. Dışarıdan gelen nemli hava veya yağışlı koşullarda yapılan yükleme operasyonları alan nem seviyesini yükseltmektedir.',
        'medium',
        [
          'Dock kapılarını operasyon dışında kapalı tutun',
          'Yağışlı havalarda yükleme planlamasını gözden geçirin',
          'Zemin su birikintilerini temizleyin — buharlaşma nemi artırır',
        ]
      )
    }

    return cause(
      'Dış Ortam Nem Etkisi',
      'Yarı açık alan dış ortam nem koşullarından doğrudan etkilenmektedir. Mevsimsel nem değişimleri, yağış ve sıcaklık farklılıkları bu alandaki nem seviyesini belirler.',
      'high',
      [
        'Neme hassas ürünleri kapalı ve kontrollü alanlarda saklayın',
        'Hava sirkülasyonunu artırmak için fan kullanın',
        'Gerekirse portatif nem alıcı kullanmayı değerlendirin',
      ]
    )
  }

  return cause(
    'Ortam Nemi Yükselmesi',
    'Nem oranı tanımlı üst eşiğin üzerine çıkmıştır.',
    'low',
    ['Nem kontrol sistemini kontrol edin', 'Havalandırmayı iyileştirin']
  )
}

// ══════════════════════════════════════════════════════════════
// NEM — DÜŞÜK (value < minValue)
// ══════════════════════════════════════════════════════════════

function matchHumidityLow(pattern, ctx) {
  const { trend, spikeDetected } = pattern
  const { environment, cooling } = ctx

  if (environment === 'sealed' || environment === 'controlled') {
    if (cooling && trend < -0.05) {
      return cause(
        'Nem Kontrol Sistemi Aşırı Çalışması',
        'Nem oranı kademeli olarak düşmektedir. Nem alıcı (dehumidifier) ünite veya klima sistemi havayı gereğinden fazla kurutuyor olabilir. Aşırı kuru ortam ürün kalitesini olumsuz etkiler.',
        'high',
        [
          'Nem alıcı ünitenin set noktasını kontrol edin',
          'Klima/soğutma sisteminin nem ayarlarını gözden geçirin',
          'Gerekirse ortama nemlendirici (humidifier) ekleyin',
          'Ürünlerin kuruma durumunu kontrol edin',
        ]
      )
    }

    if (spikeDetected) {
      return cause(
        'Havalandırma Sistemi Ayar Sorunu',
        'Nem oranında ani bir düşüş yaşandı. Havalandırma sistemi normalden fazla kuru hava sirkülasyonu yapıyor olabilir. Fan hızı veya hava giriş ayarları kontrol edilmelidir.',
        'medium',
        [
          'Havalandırma fan hızını ve yönünü kontrol edin',
          'Taze hava giriş damperlerini kontrol edin',
          'Ortam koşullarına göre fan programını ayarlayın',
        ]
      )
    }

    return cause(
      'Ortam Nem Seviyesi Düşüklüğü',
      'Birim içi nem oranı minimum eşiğin altına inmiştir. Uzun süreli düşük nem, ürünlerde kuruma ve kalite kaybına yol açabilir.',
      'low',
      [
        'Nem kontrol sistemini gözden geçirin',
        'Ortama nemlendirici eklemeyi değerlendirin',
        'Havalandırma ayarlarını kontrol edin',
      ]
    )
  }

  if (environment === 'semi-open') {
    return cause(
      'Dış Ortam Kuru Hava Etkisi',
      'Yarı açık alandaki nem oranı dış ortam koşullarından etkilenmektedir. Düşük dış nem, rüzgar veya yüksek sıcaklık havayı kurutarak alan nem seviyesini düşürebilir.',
      'high',
      [
        'Neme hassas ürünleri kapalı alanlara taşıyın',
        'Gerekirse zemin sulama ile nem seviyesini artırın',
        'Fan hızını düşürerek hava sirkülasyonunu azaltın',
      ]
    )
  }

  return cause(
    'Ortam Nemi Düşüşü',
    'Nem oranı tanımlı alt eşiğin altına inmiştir.',
    'low',
    ['Nem kontrol sistemini kontrol edin', 'Havalandırma ayarlarını gözden geçirin']
  )
}

// ─── YARDIMCI ────────────────────────────────────────────────

function cause(title, description, confidence, recommendations) {
  return { title, description, confidence, recommendations }
}

function fallbackCause(measurementType, direction, context) {
  const isTemp = measurementType === 'TEMPERATURE'
  const isHigh = direction === 'high'
  const label = isTemp ? 'Sıcaklık' : 'Nem'
  const dir = isHigh ? 'yükselmesi' : 'düşmesi'

  return cause(
    `${label} ${isHigh ? 'Yükselmesi' : 'Düşmesi'}`,
    `${label} değeri eşik dışına çıkmıştır. Yeterli geçmiş veri olmadığından detaylı sebep analizi yapılamamıştır.`,
    'low',
    ['Cihaz ve ortam koşullarını manuel kontrol edin']
  )
}

module.exports = { analyzeRootCause }
