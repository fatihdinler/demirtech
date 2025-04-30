import apiClient from '../utils/api-client'

export function _getDevicesByUserId() {
  return apiClient.get('/devices/get-devices-by-user-id')
}

export function _getReportsForDevices({ deviceIds, startTime, endTime }) {
  return apiClient.post(
    '/devices/reports',
    { deviceIds, startTime, endTime }
  )
}