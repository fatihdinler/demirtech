const { transporter, isGmailConfigured } = require('../helpers/mail/gmail.config')
const config = require('../config')

const ALERT_COOLDOWN_MS = 30 * 60 * 1000 // 30 dakika
const cooldownMap = new Map() // deviceId → son alert zamanı

const THRESHOLDS = {
  TEMPERATURE: {
    warning: { low: 2, high: 35 },
    critical: { low: -5, high: 40 },
  },
  HUMIDITY: {
    warning: { low: 25, high: 75 },
    critical: { low: 15, high: 90 },
  },
}

/**
 * Ölçüm değerini eşiklerle karşılaştırır.
 * @returns {{ level: 'normal'|'warning'|'critical', direction: 'low'|'high'|null }}
 */
function checkThreshold(measurementType, value) {
  const mt = (measurementType || 'TEMPERATURE').toUpperCase()
  const t = THRESHOLDS[mt] || THRESHOLDS.TEMPERATURE

  if (value <= t.critical.low)  return { level: 'critical', direction: 'low' }
  if (value >= t.critical.high) return { level: 'critical', direction: 'high' }
  if (value <= t.warning.low)   return { level: 'warning',  direction: 'low' }
  if (value >= t.warning.high)  return { level: 'warning',  direction: 'high' }
  return { level: 'normal', direction: null }
}

/**
 * Değer eşik aşımı yapıyorsa e-posta gönderir.
 * Aynı cihaz için 30 dakika boyunca tekrar göndermez (cooldown).
 */
async function checkAndAlert({ deviceId, deviceName, chipId, measurementType, value }) {
  if (!isGmailConfigured()) return

  const { level, direction } = checkThreshold(measurementType, value)
  if (level === 'normal') return

  const cooldownKey = `${deviceId}-${level}-${direction}`
  const lastAlert = cooldownMap.get(cooldownKey)
  if (lastAlert && Date.now() - lastAlert < ALERT_COOLDOWN_MS) return

  cooldownMap.set(cooldownKey, Date.now())

  const isTemp = measurementType?.toUpperCase() === 'TEMPERATURE'
  const unit = isTemp ? '°C' : '%'
  const label = isTemp ? 'Sıcaklık' : 'Nem'
  const emoji = level === 'critical' ? '🚨' : '⚠️'
  const levelTr = level === 'critical' ? 'KRİTİK' : 'UYARI'
  const dirTr = direction === 'high' ? 'yüksek' : 'düşük'

  const subject = `${emoji} ${levelTr}: ${deviceName} — ${label} çok ${dirTr} (${value.toFixed(1)}${unit})`

  const thresholds = THRESHOLDS[measurementType?.toUpperCase()] || THRESHOLDS.TEMPERATURE
  const warnRange = `${thresholds.warning.low}${unit} – ${thresholds.warning.high}${unit}`
  const critRange = `${thresholds.critical.low}${unit} – ${thresholds.critical.high}${unit}`

  const html = buildAlertHtml({
    levelTr, emoji, deviceName, chipId, label, value, unit, dirTr, warnRange, critRange, level,
  })

  const to = config.GMAIL_USER

  try {
    await transporter.sendMail({
      from: `"Demirtech Alarm Sistemi" <${config.GMAIL_USER}>`,
      to,
      subject,
      html,
    })
    console.log(`[Alert] ${levelTr} e-postası gönderildi → ${to} (${deviceName}: ${value.toFixed(1)}${unit})`)
  } catch (err) {
    console.error(`[Alert] E-posta gönderilemedi:`, err.message)
  }
}

function buildAlertHtml({ levelTr, emoji, deviceName, chipId, label, value, unit, dirTr, warnRange, critRange, level }) {
  const color = level === 'critical' ? '#dc2626' : '#d97706'
  const bgColor = level === 'critical' ? '#fef2f2' : '#fffbeb'

  return `
<!DOCTYPE html>
<html lang="tr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.08);">

        <tr><td style="background:${color};padding:24px 32px;">
          <h1 style="color:#fff;font-size:20px;margin:0;">${emoji} ${levelTr} ALARM</h1>
          <p style="color:rgba(255,255,255,0.85);font-size:13px;margin:8px 0 0;">Demirtech IoT Alarm Sistemi</p>
        </td></tr>

        <tr><td style="padding:28px 32px;">
          <div style="background:${bgColor};border:1px solid ${color}33;border-radius:8px;padding:20px;text-align:center;margin-bottom:24px;">
            <p style="font-size:13px;color:#64748b;margin:0 0 4px;">Ölçülen ${label}</p>
            <p style="font-size:36px;font-weight:800;color:${color};margin:0;">${value.toFixed(1)}${unit}</p>
            <p style="font-size:12px;color:${color};margin:6px 0 0;font-weight:600;">${label} çok ${dirTr}</p>
          </div>

          <table width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;color:#334155;">
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #f1f5f9;color:#94a3b8;">Cihaz</td>
              <td style="padding:8px 0;border-bottom:1px solid #f1f5f9;font-weight:600;text-align:right;">${deviceName}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #f1f5f9;color:#94a3b8;">Chip ID</td>
              <td style="padding:8px 0;border-bottom:1px solid #f1f5f9;font-weight:600;text-align:right;font-family:monospace;">${chipId}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #f1f5f9;color:#94a3b8;">Uyarı Aralığı</td>
              <td style="padding:8px 0;border-bottom:1px solid #f1f5f9;font-weight:600;text-align:right;">${warnRange}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #f1f5f9;color:#94a3b8;">Kritik Aralığı</td>
              <td style="padding:8px 0;border-bottom:1px solid #f1f5f9;font-weight:600;text-align:right;">${critRange}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#94a3b8;">Zaman</td>
              <td style="padding:8px 0;font-weight:600;text-align:right;">${new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' })}</td>
            </tr>
          </table>
        </td></tr>

        <tr><td style="background:#f8fafc;padding:16px 32px;text-align:center;">
          <p style="font-size:11px;color:#94a3b8;margin:0;">Bu e-posta Demirtech alarm sistemi tarafından otomatik olarak gönderilmiştir.</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

module.exports = { checkAndAlert }
