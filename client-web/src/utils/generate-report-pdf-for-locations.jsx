import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import logo from '../assets/demirtek-logo-secondary.png'

/**
 * reportData: Array<{
 *   locationId: string,
 *   locationName: string,
 *   devices: Array<{
 *     deviceId: string,
 *     name: string,
 *     chipId: string,
 *     deviceType: string,
 *     measurementType: string,
 *     data: Array<{ occurredTime: string, value: number, type: string }>
 *   }>
 * }>
 */
export function generateReportPdfForLocations(reportData) {
  const doc = new jsPDF({ unit: 'pt', format: 'A4' })
  const today = new Date().toISOString().split('T')[0]

  reportData.forEach((loc, idx) => {
    if (idx > 0) doc.addPage()

    // 1) Logo
    doc.addImage(logo, 'PNG', 520, 20, 60, 30)

    // 2) Lokasyon başlığı
    let cursorY = 70
    doc.setFontSize(14)
    doc.text(`Lokasyon: ${loc.locationName}`, 40, cursorY)

    // 3) Lokasyon ID (opsiyonel meta)
    doc.setFontSize(11)
    cursorY += 20
    doc.text(`Lokasyon ID: ${loc.locationId}`, 40, cursorY)

    // 4) Her cihaz için meta + tablo
    loc.devices.forEach(dev => {
      // Ölçüm tipi etiketi
      const measLabel = dev.measurementType === 'TEMPERATURE'
        ? 'Sıcaklık'
        : dev.measurementType === 'HUMIDITY'
          ? 'Nem'
          : dev.measurementType

      // Cihaz başlığı
      cursorY += 25
      doc.setFontSize(14)
      doc.text(`Cihaz: ${dev.name}`, 40, cursorY)

      // Cihaz meta bilgileri
      doc.setFontSize(11)
      cursorY += 18
      doc.text(`Chip ID: ${dev.chipId}`, 40, cursorY)
      cursorY += 15
      doc.text(`Cihaz Türü: ${dev.deviceType}`, 40, cursorY)
      cursorY += 15
      doc.text(`Ölçüm Tipi: ${measLabel}`, 40, cursorY)

      // Tablo başlangıç Y konumu
      const startY = cursorY + 20

      if (dev.data.length > 0) {
        autoTable(doc, {
          startY,
          head: [['Tarih', 'Değer', 'Chip ID', 'Cihaz Türü', 'Ölçüm Tipi']],
          body: dev.data.map(d => [
            new Date(d.occurredTime).toLocaleString('tr-TR'),
            d.value,
            dev.chipId,
            dev.deviceType,
            measLabel
          ]),
          styles: { fontSize: 10 },
          headStyles: { fillColor: [40, 40, 40] },
          margin: { left: 40, right: 40 }
        })
        cursorY = doc.lastAutoTable.finalY
      } else {
        doc.setFontSize(12)
        doc.text(
          'Seçilen tarih aralığında kayıtlı değer bulunamadı.',
          40,
          startY
        )
        cursorY = startY
      }
    })
  })

  doc.save(`lokasyon-raporu-${today}.pdf`)
}
