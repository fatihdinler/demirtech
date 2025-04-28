import apiClient from '../utils/api-client'

export function _getDevicesByUserId() {
  return apiClient.get('/devices/get-devices-by-user-id')
}
