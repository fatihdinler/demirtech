/**
 * 10 sanal cihaz profili — Soğuk Hava Deposu Senaryosu (Demo Optimized)
 *
 * Tasarım ilkeleri:
 *   1. Tutarlılık: Ardışık değerler arasında fiziksel olarak imkânsız
 *      sıçramalar olmaz. Tüm geçişler pürüzsüzdür.
 *   2. Determinizm: Aynı step her zaman aynı değeri üretir (sin/cos
 *      tabanlı pseudo-noise, Math.random kullanılmaz).
 *   3. Fiziksel sınırlar: Hiçbir profil negatif sıcaklık veya aşırı
 *      uç değerler üretmez. Tüm değerler gerçekçi aralıklarda kalır.
 *   4. Demo dostu: 10 cihazdan 8'i kısa döngülerde (10–40 dk)
 *      eşik aşımı yaparak bildirim tetikler. 2 referans cihaz stabil
 *      kalır. Demo esnasında birkaç dakika içinde bildirimler düşer.
 *   5. Feature kapsamı: Profiller toplu olarak şu feature'ları tetikler:
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
 *
 * causeContext: Her profilin fiziksel ortam tanımı. Root-cause analiz
 * motoru bu bilgiyi kullanarak eşik aşımının olası sebebini belirler.
 *   - environment: 'sealed' (kapalı/yalıtımlı) | 'semi-open' (yarı açık) | 'controlled' (kontrollü)
 *   - cooling: Aktif soğutma sistemi var mı
 *   - defrostCycle: Periyodik defrost döngüsü var mı
 *   - frequentAccess: Kapak/kapı sık açılıyor mu (reyon, yükleme alanı)
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

  // ─── 1. Soğuk Oda A — Stabil referans (sağlıklı sistem) ───
  // Mükemmel çalışan kompresör. Düşük dalgalanma, optimal aralık.
  // Eşik aşımı: HAYIR — referans cihaz olarak stabil kalır.
  // Değer aralığı: ~4.6–5.4°C
  {
    name: 'Soğuk Oda A - Sıcaklık',
    chipId: '30100001',
    measurementType: 'TEMPERATURE',
    deviceType: 'DT-100',
    minValue: 2,
    maxValue: 8,
    causeContext: { environment: 'sealed', cooling: true, defrostCycle: false, frequentAccess: false },
    generate(step) {
      return round(5.0 + smoothNoise(step, 0.4, 10))
    },
  },

  // ─── 2. Soğuk Oda B — Kompresör arızası, yavaş yükseliş ───
  // 80 adımlık döngü (~40 dk): 4°C → 9.5°C yükselir, sonra
  // bakım yapılmış gibi yumuşak geçişle 4°C'ye döner.
  // Eşik aşımı: EVET — max:8°C aşılır → bildirim tetiklenir
  // Değer aralığı: ~3.8–9.7°C
  {
    name: 'Soğuk Oda B - Sıcaklık',
    chipId: '30100002',
    measurementType: 'TEMPERATURE',
    deviceType: 'DT-100',
    minValue: 2,
    maxValue: 8,
    causeContext: { environment: 'sealed', cooling: true, defrostCycle: false, frequentAccess: false },
    generate(step) {
      const ramp = smoothRamp(step, 80, 0.7)
      const base = 4.0 + ramp * 5.5
      return round(base + smoothNoise(step, 0.2, 20))
    },
  },

  // ─── 3. Süt Ürünleri Reyonu — Hafif dalgalanma ───
  // 50 adımlık sinüs döngüsü (~25 dk): soğutma kapasitesi
  // yetersiz kaldığında max:6°C'yi aşar.
  // Eşik aşımı: EVET — max:6°C aşılır → bildirim tetiklenir
  // Değer aralığı: ~2.3–6.7°C
  {
    name: 'Süt Ürünleri Reyonu - Sıcaklık',
    chipId: '30100003',
    measurementType: 'TEMPERATURE',
    deviceType: 'DT-100',
    minValue: 2,
    maxValue: 6,
    causeContext: { environment: 'sealed', cooling: true, defrostCycle: false, frequentAccess: true },
    generate(step) {
      const base = 4.5 + smoothNoise(step, 0.4, 30)
      const drift = 1.8 * Math.sin(2 * Math.PI * step / 50)
      return round(base + drift)
    },
  },

  // ─── 4. Meyve & Sebze Reyonu — Kapak açılma spike'ları ───
  // 20 adımda bir spike (~10 dk): personel kapağı açtığında
  // sıcaklık 7.5°C'den ~11.5°C'ye çıkar ve geri döner.
  // Eşik aşımı: EVET — max:10°C aşılır → bildirim tetiklenir
  // Değer aralığı: ~7.2–11.8°C
  {
    name: 'Meyve & Sebze Reyonu - Sıcaklık',
    chipId: '30100004',
    measurementType: 'TEMPERATURE',
    deviceType: 'DT-100',
    minValue: 5,
    maxValue: 10,
    causeContext: { environment: 'sealed', cooling: true, defrostCycle: false, frequentAccess: true },
    generate(step) {
      const base = 7.5 + smoothNoise(step, 0.3, 40)
      const spike = smoothSpike(step, 20, 6, 4.0)
      return round(base + spike)
    },
  },

  // ─── 5. Yükleme Rampası — Gün/gece sıcaklık döngüsü ───
  // 36 adımlık sinüs (~18 dk): yarı açık alan, dış hava etkisi.
  // Gündüz 22°C'yi, gece 12°C'yi aşar.
  // Eşik aşımı: EVET — hem min:12 hem max:22 aşılır → bildirim
  // Değer aralığı: ~11.1–22.9°C
  {
    name: 'Yükleme Rampası - Sıcaklık',
    chipId: '30100005',
    measurementType: 'TEMPERATURE',
    deviceType: 'DT-100',
    minValue: 12,
    maxValue: 22,
    causeContext: { environment: 'semi-open', cooling: false, defrostCycle: false, frequentAccess: true },
    generate(step) {
      const dayNight = 5.5 * Math.sin(2 * Math.PI * step / 36)
      return round(17.0 + dayNight + smoothNoise(step, 0.4, 50))
    },
  },

  // ─── 6. Et Deposu — Defrost döngüsü ───
  // 40 adımlık döngü (~20 dk): defrost sırasında 1.5°C'den
  // 5.5°C'ye yükselir, soğutma devreye girince geri döner.
  // Eşik aşımı: EVET — max:4°C aşılır → bildirim tetiklenir
  // Değer aralığı: ~1.35–5.65°C (negatif değer üretmez)
  {
    name: 'Et Deposu - Sıcaklık',
    chipId: '30100006',
    measurementType: 'TEMPERATURE',
    deviceType: 'DT-100',
    minValue: 0,
    maxValue: 4,
    causeContext: { environment: 'sealed', cooling: true, defrostCycle: true, frequentAccess: false },
    generate(step) {
      const phase = step % 40
      let base
      if (phase < 8) {
        const t = phase / 8
        base = 1.5 + 4.0 * (0.5 - 0.5 * Math.cos(Math.PI * t))
      } else {
        const t = (phase - 8) / 32
        base = 5.5 - 4.0 * (0.5 - 0.5 * Math.cos(Math.PI * t))
      }
      return round(base + smoothNoise(step, 0.15, 60))
    },
  },

  // ══════════════════ NEM CİHAZLARI (4 adet) ══════════════════

  // ─── 7. İlaç Deposu — Stabil referans (kontrollü ortam) ───
  // Hassas nem kontrolü. Düşük dalgalanma.
  // Eşik aşımı: HAYIR — referans cihaz olarak stabil kalır.
  // Değer aralığı: ~46–48%
  {
    name: 'İlaç Deposu - Nem',
    chipId: '30100007',
    measurementType: 'HUMIDITY',
    deviceType: 'DT-100',
    minValue: 40,
    maxValue: 55,
    causeContext: { environment: 'controlled', cooling: true, defrostCycle: false, frequentAccess: false },
    generate(step) {
      return round(47.0 + smoothNoise(step, 1.0, 70))
    },
  },

  // ─── 8. Soğuk Oda A Nem — Havalandırma yetersizliği ───
  // 80 adımlık döngü (~40 dk): %42'den %64'e yükselir,
  // havalandırma tamir edilince %42'ye yumuşak düşüş.
  // Eşik aşımı: EVET — max:60% aşılır → bildirim tetiklenir
  // Değer aralığı: ~41.2–64.8%
  {
    name: 'Soğuk Oda A - Nem',
    chipId: '30100008',
    measurementType: 'HUMIDITY',
    deviceType: 'DT-100',
    minValue: 35,
    maxValue: 60,
    causeContext: { environment: 'sealed', cooling: true, defrostCycle: false, frequentAccess: false },
    generate(step) {
      const ramp = smoothRamp(step, 80, 0.7)
      const base = 42.0 + ramp * 22.0
      return round(base + smoothNoise(step, 0.8, 80))
    },
  },

  // ─── 9. Ana Salon — Gün/gece nem döngüsü ───
  // 36 adımlık sinüs (~18 dk): gün içi nem değişimi.
  // Eşik aşımı: EVET — max:58% aşılır → bildirim tetiklenir
  // Değer aralığı: ~39.2–60.8%
  {
    name: 'Ana Salon - Nem',
    chipId: '30100009',
    measurementType: 'HUMIDITY',
    deviceType: 'DT-100',
    minValue: 35,
    maxValue: 58,
    causeContext: { environment: 'semi-open', cooling: false, defrostCycle: false, frequentAccess: false },
    generate(step) {
      const cycle = 10.0 * Math.sin(2 * Math.PI * step / 36)
      return round(50.0 + cycle + smoothNoise(step, 0.8, 90))
    },
  },

  // ─── 10. Yükleme Rampası Nem — Yüksek volatilite ───
  // Çoklu sinüs dalgası bileşimi: yarı açık alan, dış hava
  // ve malzeme giriş/çıkışı kaynaklı nem dalgalanması.
  // Eşik aşımı: EVET — max:62% sık aşılır → bildirim tetiklenir
  // Değer aralığı: ~35.5–68.5%
  {
    name: 'Yükleme Rampası - Nem',
    chipId: '30100010',
    measurementType: 'HUMIDITY',
    deviceType: 'DT-100',
    minValue: 35,
    maxValue: 62,
    causeContext: { environment: 'semi-open', cooling: false, defrostCycle: false, frequentAccess: true },
    generate(step) {
      const wave1 = 8.0 * Math.sin(2 * Math.PI * step / 24)
      const wave2 = 5.0 * Math.sin(2 * Math.PI * step / 13 + 1.0)
      const wave3 = 3.0 * Math.cos(2 * Math.PI * step / 37 + 2.5)
      return round(52.0 + wave1 + wave2 + wave3 + smoothNoise(step, 0.5, 100))
    },
  },
]

module.exports = PROFILES
