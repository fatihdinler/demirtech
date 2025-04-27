import apiClient from '../utils/api-client'

// GET /api/devices/get-devices-by-user-id
// (req.userId, verifyToken middleware ile geliyor)
export function _getDevicesByUserId() {
  return apiClient.get('/devices/get-devices-by-user-id')
}
