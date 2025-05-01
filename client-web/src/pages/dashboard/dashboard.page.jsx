import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Spinner, Card, Tabs, Tab } from 'react-bootstrap'
import { FaThermometerHalf, FaTint, FaExclamationTriangle } from 'react-icons/fa'
import { ListPagesHeader } from '../../components'
import ReactApexChart from 'react-apexcharts'
import useDashboard from './dashboard.hook'
import useRealtimeDeviceData from '../../hooks/socket.hook'
import './Dashboard.css'

const Dashboard = () => {
  const { devices, isLoading, error, metrics } = useDashboard()
  const realtimeMap = useRealtimeDeviceData()
  const [chartTab, setChartTab] = useState('temperature')
  const [historicalData, setHistoricalData] = useState({
    temperature: [],
    humidity: []
  })

  // Simüle edilmiş geçmiş veri üretimi
  useEffect(() => {
    if (devices.length > 0) {
      // Son 24 saat için simüle edilmiş veri (gerçek uygulamada API'dan gelecek)
      const tempData = Array(24).fill(0).map((_, i) => {
        const hour = new Date()
        hour.setHours(hour.getHours() - 24 + i)
        return {
          x: hour.getTime(),
          y: 20 + Math.random() * 10 // 20-30 arası rastgele sıcaklık
        }
      })

      const humidityData = Array(24).fill(0).map((_, i) => {
        const hour = new Date()
        hour.setHours(hour.getHours() - 24 + i)
        return {
          x: hour.getTime(),
          y: 40 + Math.random() * 30 // 40-70 arası rastgele nem
        }
      })

      setHistoricalData({
        temperature: tempData,
        humidity: humidityData
      })
    }
  }, [devices])

  // Cihazları kategorilerine göre grupla
  const devicesByType = React.useMemo(() => {
    const grouped = { temperature: [], humidity: [] }
    devices.forEach(dev => {
      const live = realtimeMap[dev.id]
      if (live) {
        const type = live.type.toLowerCase()
        if (type.includes('temperature') || type.includes('sicaklik')) {
          grouped.temperature.push({ ...dev, value: Number(live.value) })
        } else if (type.includes('humidity') || type.includes('nem')) {
          grouped.humidity.push({ ...dev, value: Number(live.value) })
        }
      }
    })
    return grouped
  }, [devices, realtimeMap])

  const getValueStatus = (type, value) => {
    const t = type.toLowerCase()
    if (t === 'temperature' || t === 'sicaklik') {
      if (value < 15 || value > 30) return 'critical'
      if (value < 17 || value > 28) return 'warning'
      return 'normal'
    }
    if (t === 'humidity' || t === 'nem') {
      if (value < 20 || value > 80) return 'critical'
      if (value < 30 || value > 70) return 'warning'
      return 'normal'
    }
    return 'normal'
  }

  // Sıcaklık trendi için grafik ayarları
  const tempChartOptions = {
    chart: {
      type: 'line',
      height: 350,
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      },
      fontFamily: 'inherit'
    },
    colors: ['#ef4444', '#f59e0b', '#10b981'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    title: {
      text: 'Sıcaklık Verileri (Son 24 Saat)',
      align: 'left',
      style: {
        fontSize: '16px',
        fontWeight: 600
      }
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'],
        opacity: 0.5
      },
    },
    xaxis: {
      type: 'datetime',
      labels: {
        datetimeUTC: false,
        format: 'HH:mm'
      }
    },
    yaxis: {
      title: {
        text: 'Sıcaklık (°C)'
      },
      min: 10,
      max: 35
    },
    tooltip: {
      x: {
        format: 'HH:mm'
      }
    },
    legend: {
      position: 'top'
    }
  }

  // Nem trendi için grafik ayarları
  const humidityChartOptions = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      },
      fontFamily: 'inherit'
    },
    colors: ['#3b82f6'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 90, 100]
      }
    },
    title: {
      text: 'Nem Verileri (Son 24 Saat)',
      align: 'left',
      style: {
        fontSize: '16px',
        fontWeight: 600
      }
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'],
        opacity: 0.5
      },
    },
    xaxis: {
      type: 'datetime',
      labels: {
        datetimeUTC: false,
        format: 'HH:mm'
      }
    },
    yaxis: {
      title: {
        text: 'Nem (%)'
      },
      min: 15,
      max: 85
    },
    tooltip: {
      x: {
        format: 'HH:mm'
      }
    }
  }

  // Canlı cihaz değerleri için gauge chart ayarları
  const gaugeOptions = {
    chart: {
      height: 280,
      type: 'radialBar',
      offsetY: -10
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        dataLabels: {
          name: {
            fontSize: '16px',
            color: '#111827',
            offsetY: 80
          },
          value: {
            offsetY: 40,
            fontSize: '22px',
            color: '#111827',
            formatter: function (val) {
              return chartTab === 'temperature' ? val + "°C" : val + "%";
            }
          }
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        shadeIntensity: 0.15,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 65, 91]
      },
    },
    stroke: {
      dashArray: 4
    },
    colors: ['#10b981'],
    labels: ['Ortalama Değer'],
  }

  // Gauge chart için değer hazırlama
  const getGaugeData = () => {
    const devices = chartTab === 'temperature' ? devicesByType.temperature : devicesByType.humidity;

    if (devices.length === 0) return [0];

    const avg = devices.reduce((sum, dev) => sum + dev.value, 0) / devices.length;
    const normalized = chartTab === 'temperature'
      ? Math.min(100, Math.max(0, ((avg - 10) / 25) * 100)) // 10-35°C aralığını 0-100 arasına normalize et
      : Math.min(100, Math.max(0, ((avg - 15) / 70) * 100)); // 15-85% aralığını 0-100 arasına normalize et

    return [parseFloat(normalized.toFixed(1))];
  };

  if (isLoading) return (
    <div className="loading-indicator">
      <Spinner animation="border" /> Yükleniyor...
    </div>
  )
  if (error) return (
    <div className="error-message">
      Hata: {error.message}
    </div>
  )

  return (
    <Container fluid className="dashboard-container">
      {/* Başlık ve metrikler */}
      <Row className='align-items-center mb-3 justify-content-center'>
        <Col className='px-3'>
          <ListPagesHeader
            breadcrumbItems={[{ label: 'Ana Sayfa', link: '/dashboard' }]}
          />
        </Col>
      </Row>

      <div className="metrics-grid mb-4">
        <div className="metric-card">
          <div className="metric-value">{metrics.total}</div>
          <div className="metric-label">Toplam Cihaz</div>
        </div>
        <div className="metric-card normal">
          <div className="metric-value">{metrics.normal}</div>
          <div className="metric-label">Normal Durum</div>
        </div>
        <div className="metric-card warning">
          <div className="metric-value">{metrics.warning}</div>
          <div className="metric-label">Uyarı Durum</div>
        </div>
        <div className="metric-card critical">
          <div className="metric-value">{metrics.critical}</div>
          <div className="metric-label">Kritik Durum</div>
        </div>
      </div>

      {/* Grafik ve analiz bölümü */}
      <Row className="mb-4">
        <Col lg={8} className="mb-4">
          <Card className="chart-card h-100">
            <Card.Body>
              <Tabs
                activeKey={chartTab}
                onSelect={(k) => setChartTab(k)}
                className="chart-tabs"
              >
                <Tab eventKey="temperature" title={<><FaThermometerHalf className="me-2" /> Sıcaklık</>}>
                  <div className="chart-container">
                    <ReactApexChart
                      options={tempChartOptions}
                      series={[
                        {
                          name: 'Kritik Eşik',
                          data: historicalData.temperature.map(point => ({ x: point.x, y: 30 }))
                        },
                        {
                          name: 'Uyarı Eşik',
                          data: historicalData.temperature.map(point => ({ x: point.x, y: 28 }))
                        },
                        {
                          name: 'Sıcaklık',
                          data: historicalData.temperature
                        }
                      ]}
                      type="line"
                      height={350}
                    />
                  </div>
                </Tab>
                <Tab eventKey="humidity" title={<><FaTint className="me-2" /> Nem</>}>
                  <div className="chart-container">
                    <ReactApexChart
                      options={humidityChartOptions}
                      series={[{
                        name: 'Nem',
                        data: historicalData.humidity
                      }]}
                      type="area"
                      height={350}
                    />
                  </div>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} className="mb-4">
          <Card className="gauge-card h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title className="gauge-title">
                {chartTab === 'temperature' ? 'Ortalama Sıcaklık' : 'Ortalama Nem'}
              </Card.Title>
              <div className="gauge-container">
                <ReactApexChart
                  options={gaugeOptions}
                  series={getGaugeData()}
                  type="radialBar"
                  height={280}
                />
              </div>
              <div className="gauge-info text-center mt-auto">
                <p className="mb-1">
                  {chartTab === 'temperature'
                    ? `${devicesByType.temperature.length} sıcaklık sensörü aktif`
                    : `${devicesByType.humidity.length} nem sensörü aktif`
                  }
                </p>
                <p className="gauge-status">
                  {chartTab === 'temperature'
                    ? `İdeal sıcaklık aralığı: 17-28°C`
                    : `İdeal nem aralığı: 30-70%`
                  }
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Cihaz Kartları */}
      <h4 className="section-title mb-3">Aktif Cihazlar</h4>
      <div className="device-grid">
        {devices.map(dev => {
          const live = realtimeMap[dev.id]
          let icon = <FaExclamationTriangle size={24} />
          let reading = 'N/A'
          let unit = ''
          let status = 'normal'

          if (live) {
            const val = Number(live.value)
            reading = val.toFixed(1)
            if (live.type.toLowerCase().includes('humidity') || live.type.toLowerCase().includes('nem')) {
              icon = <FaTint size={24} />
              unit = '%'
            } else {
              icon = <FaThermometerHalf size={24} />
              unit = '°C'
            }
            status = getValueStatus(live.type, val)
          }

          return (
            <div key={dev.id} className={`device-card ${status}`}>
              <div className="device-header">
                <div className="device-name">{dev.name}</div>
                <div className="device-icon">{icon}</div>
              </div>
              <div className="device-reading">
                <span className="reading-value">{reading}</span>
                <span className="reading-unit">{unit}</span>
              </div>
              <div className="device-meta">
                <div className="device-location">{dev.location || 'Konum bilgisi yok'}</div>
                <div className="device-id">{dev.chipId}</div>
              </div>
              <div className="device-status-indicator">
                <span className={`status-dot ${status}`}></span>
                {status === 'normal' ? 'Normal' : status === 'warning' ? 'Uyarı' : 'Kritik'}
              </div>
            </div>
          )
        })}
      </div>
    </Container>
  )
}

export default Dashboard