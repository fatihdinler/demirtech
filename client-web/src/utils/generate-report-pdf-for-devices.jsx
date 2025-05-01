// src/utils/pdfGenerator.js
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import logo from '../assets/demirtek-logo-secondary.png'

/**
 * reportData: {
 *   [deviceId: string]: Array<{ occurredTime: string; value: number }>
 * }
 * devices: Array<{
 *   id: string
 *   name: string
 *   chipId: string
 *   deviceType: string
 *   measurementType: 'TEMPERATURE' | 'HUMIDITY' | string
 * }>
 */
export function generateReportPdfForDevices(reportData, devices) {
  // deviceId → tüm cihaz meta verilerini içeren obje map'i
  const deviceMap = devices.reduce((acc, d) => {
    acc[d.id] = d
    return acc
  }, {})

  const doc = new jsPDF({ unit: 'pt', format: 'A4' })
  const entries = Object.entries(reportData)

  entries.forEach(([deviceId, rows], idx) => {
    // Her sayfada logoyu ekle
    // x=520, y=20, width=60, height=30 (A4 sayfada sağ üst köşe civarı)
    doc.addImage(logo, 'PNG', 520, 20, 60, 30)

    const device = deviceMap[deviceId] || {}
    const deviceName =
      device.name || deviceId
    const chipId =
      device.chipId || ''
    const deviceType =
      device.deviceType || ''
    const rawMeas =
      device.measurementType || ''
    const measurementLabel =
      rawMeas === 'TEMPERATURE'
        ? 'Sıcaklık'
        : rawMeas === 'HUMIDITY'
          ? 'Nem'
          : rawMeas

    // Başlık ve meta bilgileri
    let cursorY = 70
    doc.setFontSize(14)
    doc.text(`Cihaz: ${deviceName}`, 40, cursorY)

    doc.setFontSize(11)
    cursorY += 20
    doc.text(`Chip ID: ${chipId}`, 40, cursorY)
    cursorY += 15
    doc.text(`Cihaz Türü: ${deviceType}`, 40, cursorY)
    cursorY += 15
    doc.text(`Ölçüm Tipi: ${measurementLabel}`, 40, cursorY)

    // İçerik başlangıç Y konumu
    const startY = cursorY + 25

    if (rows.length > 0) {
      autoTable(doc, {
        startY,
        head: [['Tarih', 'Değer', 'Chip ID', 'Cihaz Türü', 'Ölçüm Tipi']],
        body: rows.map(r => [
          new Date(r.occurredTime).toLocaleString('tr-TR'),
          r.value,
          chipId,
          deviceType,
          measurementLabel
        ]),
        styles: { fontSize: 10 },
        headStyles: { fillColor: [40, 40, 40] },
        margin: { left: 40, right: 40 }
      })
    } else {
      doc.setFontSize(12)
      doc.text(
        'Seçilen tarih aralığında kayıtlı değer bulunamadı.',
        40,
        startY
      )
    }

    // Sonraki cihaz için yeni sayfa ekle
    if (idx < entries.length - 1) {
      doc.addPage()
    }
  })

  // Dosya adına bugünün tarihini ekle (YYYY-MM-DD)
  const today = new Date().toISOString().split('T')[0]
  doc.save(`cihaz-raporu-${today}.pdf`)
}
