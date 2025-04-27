import apiClient from '../utils/api-client'

// GET /api/devices/get-devices-by-user-id
// (req.userId, verifyToken middleware ile geliyor)
export function _getLocationsByUserId() {
  return apiClient.get('/locations/get-locations-by-user-id')
}
