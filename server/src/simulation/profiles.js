/**
 * 15 sanal cihaz profili.
 *
 * Her profil farklı bir veri deseni üretir, böylece cause-analysis
 * motorundaki tüm neden türleri en az bir cihazda tetiklenir.
 *
 * generate(step) → Number : verilen adım numarası için ölçüm değeri döner.
 *   step, sunucu ilk başladığında 0'dan başlar ve her tick'te 1 artar.
 *   Döngüsel profillerde `step % cycleLength` kullanılır; böylece
 *   script sonsuza kadar tutarlı veri üretir.
 */

function noise(amplitude) {
  return (Math.random() - 0.5) * 2 * amplitude
}

function round(v, d = 2) {
  const f = Math.pow(10, d)
  return Math.round(v * f) / f
}

const PROFILES = [
  // ──────────────── SICAKLIK CİHAZLARI ────────────────

  // 1 ▸ Kararlı soğuk oda — mükemmel çalışan sistem
  //   Tetikler: Stability Duration, Optimal Threshold, Low Volatility
  {
    name: 'Soğuk Oda 1 - Sıcaklık',
    chipId: '30100001',
    measurementType: 'TEMPERATURE',
    deviceType: 'DT-100',
    generate(step) {
      return round(4.0 + noise(0.15))
    },
  },

  // 2 ▸ Yükselen sıcaklık — kompresör verimsizleşiyor
  //   Tetikler: Trend Momentum (rising), Threshold Warning/Critical
  {
    name: 'Soğuk Oda 2 - Sıcaklık',
    chipId: '30100002',
    measurementType: 'TEMPERATURE',
    deviceType: 'DT-100',
    generate(step) {
      const phase = step % 200
      if (phase < 140) {
        return round(4.0 + phase * 0.1 + noise(0.2))
      }
      const t = (phase - 140) / 60
      return round(4.0 + 14.0 * Math.max(0, 1 - t) + noise(0.3))
    },
  },

  // 3 ▸ Düşen sıcaklık — soğutma sistemi fazla çalışıyor
  //   Tetikler: Trend Momentum (falling), Critical Low Threshold
  {
    name: 'Derin Dondurucu - Sıcaklık',
    chipId: '30100003',
    measurementType: 'TEMPERATURE',
    deviceType: 'DT-100',
    generate(step) {
      const phase = step % 200
      if (phase < 140) {
        return round(8.0 - phase * 0.06 + noise(0.2))
      }
      const t = (phase - 140) / 60
      return round(8.0 - 8.4 * Math.max(0, 1 - t) + noise(0.3))
    },
  },

  // 4 ▸ Ani spike'lar — kapak periyodik olarak açılıyor
  //   Tetikler: Sudden Change Detection (anomaly)
  {
    name: 'Meyve & Sebze Reyonu - Sıcaklık',
    chipId: '30100004',
    measurementType: 'TEMPERATURE',
    deviceType: 'DT-100',
    generate(step) {
      const base = 8.0 + noise(0.3)
      const cyclePos = step % 25
      if (cyclePos >= 22) {
        return round(base + 5.5 + noise(1.2))
      }
      return round(base)
    },
  },

  // 5 ▸ Yüksek dalgalanma — yükleme rampası, dış etki
  //   Tetikler: Volatility (high), Forecast Uncertainty
  {
    name: 'Yükleme Rampası - Sıcaklık',
    chipId: '30100005',
    measurementType: 'TEMPERATURE',
    deviceType: 'DT-100',
    generate(step) {
      return round(15.0 + noise(4.0))
    },
  },

  // 6 ▸ Döngüsel — gün/gece siklüsü simülasyonu
  //   Tetikler: Cyclic Pattern Detection
  {
    name: 'Ana Salon - Sıcaklık',
    chipId: '30100006',
    measurementType: 'TEMPERATURE',
    deviceType: 'DT-100',
    generate(step) {
      const period = 80
      return round(22.0 + 3.5 * Math.sin(2 * Math.PI * step / period) + noise(0.25))
    },
  },

  // 7 ▸ Ortalamaya dönüş — ani yükselme sonrası doğal düşüş
  //   Tetikler: Mean Reversion, Sudden Change (spike anında)
  {
    name: 'Et Deposu - Sıcaklık',
    chipId: '30100007',
    measurementType: 'TEMPERATURE',
    deviceType: 'DT-100',
    generate(step) {
      const phase = step % 120
      if (phase < 8) {
        return round(2.0 + phase * 1.2 + noise(0.3))
      }
      const decay = Math.exp(-(phase - 8) * 0.04)
      return round(2.0 + 9.6 * decay + noise(0.2))
    },
  },

  // 8 ▸ Hızlanan yükselme — sistem kapasitesi aşılıyor
  //   Tetikler: Rate of Change Acceleration, Trend Momentum
  {
    name: 'Kompresör Odası - Sıcaklık',
    chipId: '30100008',
    measurementType: 'TEMPERATURE',
    deviceType: 'DT-100',
    generate(step) {
      const phase = step % 160
      if (phase < 110) {
        const t = phase / 110
        return round(25.0 + 12.0 * Math.pow(t, 1.8) + noise(0.3))
      }
      const t = (phase - 110) / 50
      return round(25.0 + 12.0 * Math.max(0, 1 - t) + noise(0.4))
    },
  },

  // 9 ▸ Yavaşlayan toparlanma — sistem dengeye yaklaşıyor
  //   Tetikler: Rate of Change Deceleration
  {
    name: 'Süt Ürünleri Dolabı - Sıcaklık',
    chipId: '30100009',
    measurementType: 'TEMPERATURE',
    deviceType: 'DT-100',
    generate(step) {
      const phase = step % 140
      if (phase < 100) {
        const t = phase / 100
        return round(10.0 - 6.0 * (Math.log(1 + t * 9) / Math.log(10)) + noise(0.2))
      }
      const t = (phase - 100) / 40
      return round(4.0 + 6.0 * t + noise(0.3))
    },
  },

  // 10 ▸ Uyarı bölgesine yaklaşan — yavaş sürünen tehlike
  //   Tetikler: Forecast Divergence, Threshold Proximity Forecast
  {
    name: 'Dondurucu Tezgah - Sıcaklık',
    chipId: '30100010',
    measurementType: 'TEMPERATURE',
    deviceType: 'DT-100',
    generate(step) {
      const phase = step % 200
      if (phase < 160) {
        return round(24.0 + phase * 0.03 + noise(0.15))
      }
      const t = (phase - 160) / 40
      return round(24.0 + 4.8 * Math.max(0, 1 - t) + noise(0.2))
    },
  },

  // ──────────────── NEM CİHAZLARI ────────────────

  // 11 ▸ Kararlı nem — ilaç deposu, kontrollü ortam
  //   Tetikler: Stability Duration (humidity), Optimal Threshold
  {
    name: 'İlaç Deposu - Nem',
    chipId: '30100011',
    measurementType: 'HUMIDITY',
    deviceType: 'DT-100',
    generate(step) {
      return round(45.0 + noise(1.5))
    },
  },

  // 12 ▸ Yükselen nem — havalandırma yetersizliği
  //   Tetikler: Trend Momentum (rising, humidity), Threshold Warning
  {
    name: 'Soğuk Oda 1 - Nem',
    chipId: '30100012',
    measurementType: 'HUMIDITY',
    deviceType: 'DT-100',
    generate(step) {
      const phase = step % 180
      if (phase < 130) {
        return round(45.0 + phase * 0.25 + noise(1.0))
      }
      const t = (phase - 130) / 50
      return round(45.0 + 32.5 * Math.max(0, 1 - t) + noise(1.5))
    },
  },

  // 13 ▸ Dalgalı nem — kararsız ortam koşulları
  //   Tetikler: Volatility (high, humidity)
  {
    name: 'Meyve & Sebze Reyonu - Nem',
    chipId: '30100013',
    measurementType: 'HUMIDITY',
    deviceType: 'DT-100',
    generate(step) {
      return round(55.0 + noise(9.0))
    },
  },

  // 14 ▸ Kritik yüksek nem — kontrol dışı ortam
  //   Tetikler: Critical Threshold (humidity)
  {
    name: 'Ana Salon - Nem',
    chipId: '30100014',
    measurementType: 'HUMIDITY',
    deviceType: 'DT-100',
    generate(step) {
      const phase = step % 200
      if (phase < 150) {
        return round(82.0 + phase * 0.08 + noise(0.8))
      }
      const t = (phase - 150) / 50
      return round(82.0 + 12.0 * Math.max(0, 1 - t) + noise(1.0))
    },
  },

  // 15 ▸ Nem toparlanması — yüksekten düşüşe geçiş
  //   Tetikler: Mean Reversion (humidity), Deceleration
  {
    name: 'Yükleme Rampası - Nem',
    chipId: '30100015',
    measurementType: 'HUMIDITY',
    deviceType: 'DT-100',
    generate(step) {
      const phase = step % 150
      if (phase < 10) {
        return round(42.0 + phase * 4.0 + noise(1.0))
      }
      const decay = Math.exp(-(phase - 10) * 0.025)
      return round(42.0 + 40.0 * decay + noise(1.5))
    },
  },
]

module.exports = PROFILES
