/**
 * 10 sanal cihaz profili — Soğuk Hava Deposu Senaryosu
 *
 * Tasarım ilkeleri:
 *   1. Tutarlılık: Ardışık değerler arasında fiziksel olarak imkânsız
 *      sıçramalar olmaz. Tüm geçişler pürüzsüzdür.
 *   2. Determinizm: Aynı step her zaman aynı değeri üretir (sin/cos
 *      tabanlı pseudo-noise, Math.random kullanılmaz).
 *   3. Fiziksel sınırlar: Her profil kendi fiziksel aralığında kalır.
 *   4. Feature kapsamı: Profiller toplu olarak şu feature'ları tetikler:
 *      - Anlık eşik aşımı bildirimi (threshold_exceeded)
 *      - Tahmin bazlı uyarı (prediction_alert)
 *      - Trend analizi (yükseliş / düşüş / stabil)
 *      - Dalgalanma analizi (düşük / normal / yüksek)
 *      - Ani değişim tespiti (anomaly)
 *      - Zaman & mevsim bağlamı
 *      - Cihaz eşik analizi
 *
 * Her profil bir minValue ve maxValue içerir. Bu değerler Device
 * oluşturulurken veritabanına yazılır ve bildirim sistemi tarafından
 * kullanılır.
 */

function round(v, d = 2) {
  const f = Math.pow(10, d)
  return Math.round(v * f) / f
}

/**
 * Deterministic smooth pseudo-noise.
 * Sin/cos kombinasyonu ile adım bazlı, pürüzsüz varyasyon üretir.
 * Aynı step → aynı değer. Ardışık step'ler arasında fark küçüktür.
 */
function smoothNoise(step, amplitude, seed = 0) {
  const s = step + seed
  return amplitude * (
    0.5 * Math.sin(s * 0.37 + 1.23) +
    0.3 * Math.sin(s * 0.71 + 4.56) +
    0.2 * Math.cos(s * 1.13 + 2.78)
  )
}

/**
 * Pürüzsüz rampa: 0'dan 1'e yavaşça yükselir, sonra 1'den 0'a düşer.
 * phase [0, cycleLen) aralığında döner.
 * riseRatio: döngünün ne kadarı yükseliş, geri kalanı düşüş.
 */
function smoothRamp(step, cycleLen, riseRatio = 0.7) {
  const phase = step % cycleLen
  const riseDuration = Math.floor(cycleLen * riseRatio)
  if (phase < riseDuration) {
    const t = phase / riseDuration
    return 0.5 - 0.5 * Math.cos(Math.PI * t)
  }
  const fallDuration = cycleLen - riseDuration
  const t = (phase - riseDuration) / fallDuration
  return 0.5 + 0.5 * Math.cos(Math.PI * t)
}

/**
 * Pürüzsüz spike: belirli periyotlarda yumuşak bir çıkıntı üretir.
 * Spike genişliği spikeWidth adım, geçiş cos ile pürüzsüz.
 */
function smoothSpike(step, period, spikeWidth, amplitude) {
  const phase = step % period
  if (phase >= period - spikeWidth) {
    const t = (phase - (period - spikeWidth)) / spikeWidth
    const envelope = 0.5 - 0.5 * Math.cos(2 * Math.PI * t)
    return amplitude * envelope
  }
  return 0
}

const PROFILES = [
  // ══════════════════ SICAKLIK CİHAZLARI (6 adet) ══════════════════

  // ─── 1. Kararlı soğuk oda — mükemmel çalışan sistem ───
  // Tetikler: Düşük dalgalanma, optimal aralık, stabil tahmin
  // Eşik aşımı: HAYIR (her zaman aralıkta kalır)
  {
    name: 'Soğuk Oda A - Sıcaklık',
    chipId: '30100001',
    measurementType: 'TEMPERATURE',
    deviceType: 'DT-100',
    minValue: 2,
    maxValue: 8,
    generate(step) {
      return round(4.5 + smoothNoise(step, 0.3, 10))
    },
  },

  // ─── 2. Kompresör problemi — yavaş yükseliş trendi ───
  // Tetikler: Yükseliş trendi, MAX eşik aşımı bildirimi,
  //           tahmin bazlı uyarı (tahmin eşiği aşacak)
  // Döngü: 300 adımda 4°C → 10°C yükselir, sonra bakım
  //        yapılmış gibi 4°C'ye yumuşak geçiş
  {
    name: 'Soğuk Oda B - Sıcaklık',
    chipId: '30100002',
    measurementType: 'TEMPERATURE',
    deviceType: 'DT-100',
    minValue: 2,
    maxValue: 8,
    generate(step) {
      const ramp = smoothRamp(step, 300, 0.75)
      const base = 4.0 + ramp * 6.5
      return round(base + smoothNoise(step, 0.25, 20))
    },
  },

  // ─── 3. Derin dondurucu — stabil düşük sıcaklık ───
  // Tetikler: Stabil tahmin, optimal aralık, düşük dalgalanma
  // Eşik aşımı: HAYIR
  {
    name: 'Derin Dondurucu - Sıcaklık',
    chipId: '30100003',
    measurementType: 'TEMPERATURE',
    deviceType: 'DT-100',
    minValue: -22,
    maxValue: -15,
    generate(step) {
      return round(-18.0 + smoothNoise(step, 0.5, 30))
    },
  },

  // ─── 4. Meyve & sebze reyonu — periyodik kapak açılması ───
  // Tetikler: Ani değişim tespiti (anomaly), spike sonrası
  //           ortalamaya dönüş, forecast değişkenliği
  // Her 40 adımda bir kapak açılır → sıcaklık 8°C'den
  // yumuşak şekilde 12°C'ye çıkar ve geri döner
  {
    name: 'Meyve & Sebze Reyonu - Sıcaklık',
    chipId: '30100004',
    measurementType: 'TEMPERATURE',
    deviceType: 'DT-100',
    minValue: 5,
    maxValue: 12,
    generate(step) {
      const base = 8.0 + smoothNoise(step, 0.3, 40)
      const spike = smoothSpike(step, 40, 8, 4.0)
      return round(base + spike)
    },
  },

  // ─── 5. Yükleme rampası — gün/gece döngüsü ───
  // Tetikler: Döngüsel pattern, zaman bağlamı analizi,
  //           mevsimsel bağlam, zaman zaman eşik aşımı
  // Sinüsoidal: 12–22°C arası, periyot 48 adım (~24 saat)
  {
    name: 'Yükleme Rampası - Sıcaklık',
    chipId: '30100005',
    measurementType: 'TEMPERATURE',
    deviceType: 'DT-100',
    minValue: 10,
    maxValue: 20,
    generate(step) {
      const dayNight = 5.0 * Math.sin(2 * Math.PI * step / 48)
      return round(17.0 + dayNight + smoothNoise(step, 0.4, 50))
    },
  },

  // ─── 6. Et deposu — defrost döngüsü ───
  // Tetikler: Mean reversion, ani değişim, forecast uyarısı
  // Her 80 adımda defrost: 1°C → 5°C yükselir, sonra
  // soğutma devreye girer ve yumuşakça 1°C'ye döner
  {
    name: 'Et Deposu - Sıcaklık',
    chipId: '30100006',
    measurementType: 'TEMPERATURE',
    deviceType: 'DT-100',
    minValue: -1,
    maxValue: 4,
    generate(step) {
      const phase = step % 80
      let base
      if (phase < 10) {
        const t = phase / 10
        base = 1.0 + 4.5 * (0.5 - 0.5 * Math.cos(Math.PI * t))
      } else {
        const t = (phase - 10) / 70
        base = 5.5 - 4.5 * (0.5 - 0.5 * Math.cos(Math.PI * t))
      }
      return round(base + smoothNoise(step, 0.15, 60))
    },
  },

  // ══════════════════ NEM CİHAZLARI (4 adet) ══════════════════

  // ─── 7. İlaç deposu — kontrollü ortam, stabil nem ───
  // Tetikler: Düşük dalgalanma, optimal aralık
  // Eşik aşımı: HAYIR
  {
    name: 'İlaç Deposu - Nem',
    chipId: '30100007',
    measurementType: 'HUMIDITY',
    deviceType: 'DT-100',
    minValue: 35,
    maxValue: 55,
    generate(step) {
      return round(45.0 + smoothNoise(step, 1.2, 70))
    },
  },

  // ─── 8. Soğuk oda nem — yavaş yükseliş (havalandırma yetersiz) ───
  // Tetikler: Yükseliş trendi, MAX eşik aşımı bildirimi,
  //           tahmin bazlı uyarı
  // Döngü: 250 adımda %45 → %72 yükselir, sonra havalandırma
  //        tamir edilmiş gibi %45'e yumuşak düşüş
  {
    name: 'Soğuk Oda A - Nem',
    chipId: '30100008',
    measurementType: 'HUMIDITY',
    deviceType: 'DT-100',
    minValue: 35,
    maxValue: 65,
    generate(step) {
      const ramp = smoothRamp(step, 250, 0.72)
      const base = 45.0 + ramp * 27.0
      return round(base + smoothNoise(step, 1.0, 80))
    },
  },

  // ─── 9. Ana salon — gün/gece nem döngüsü ───
  // Tetikler: Döngüsel pattern, zaman bağlamı
  {
    name: 'Ana Salon - Nem',
    chipId: '30100009',
    measurementType: 'HUMIDITY',
    deviceType: 'DT-100',
    minValue: 30,
    maxValue: 65,
    generate(step) {
      const cycle = 8.0 * Math.sin(2 * Math.PI * step / 48)
      return round(48.0 + cycle + smoothNoise(step, 0.8, 90))
    },
  },

  // ─── 10. Yükleme rampası nem — yüksek volatilite ───
  // Tetikler: Yüksek dalgalanma, zaman zaman eşik aşımı,
  //           geniş güven aralığı
  // Birden fazla sinüs dalgasının bileşimi → karmaşık ama pürüzsüz
  {
    name: 'Yükleme Rampası - Nem',
    chipId: '30100010',
    measurementType: 'HUMIDITY',
    deviceType: 'DT-100',
    minValue: 35,
    maxValue: 70,
    generate(step) {
      const wave1 = 8.0 * Math.sin(2 * Math.PI * step / 36)
      const wave2 = 5.0 * Math.sin(2 * Math.PI * step / 17 + 1.0)
      const wave3 = 3.0 * Math.cos(2 * Math.PI * step / 53 + 2.5)
      return round(53.0 + wave1 + wave2 + wave3 + smoothNoise(step, 0.5, 100))
    },
  },
]

module.exports = PROFILES
