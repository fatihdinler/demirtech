// src/pages/customer-dashboard/customer-dashboard.hook.jsx
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { fetchDevices } from '../../features/devices/devices.api'

/**
 * Müşteri paneli için cihaz listesini ve metrikleri hazırlar.
 */
const useDashboard = () => {
  const dispatch = useDispatch()
  const { data: devices, isLoading, error, hasFetched } = useSelector(
    state => state.devices.api,
    shallowEqual
  )

  useEffect(() => {
    if (!hasFetched && !isLoading) dispatch(fetchDevices())
  }, [dispatch, hasFetched, isLoading])

  // durum metrikleri
  const metrics = useMemo(() => {
    const counts = { total: 0, normal: 0, warning: 0, critical: 0 }
    devices.forEach(dev => {
      counts.total++
      const live = dev._live
      if (!live) return counts
      const v = Number(live.value)
      const t = live.type.toLowerCase()
      let status = 'normal'
      if (t.includes('temperature') || t.includes('sicaklik')) {
        status = v < 17 || v > 28 ? (v < 15 || v > 30 ? 'critical' : 'warning') : 'normal'
      }
      if (t.includes('humidity') || t.includes('nem')) {
        status = v < 30 || v > 70 ? (v < 20 || v > 80 ? 'critical' : 'warning') : 'normal'
      }
      counts[status]++
    })
    return counts
  }, [devices])

  return { devices, isLoading, error, metrics }
}

export default useDashboard
