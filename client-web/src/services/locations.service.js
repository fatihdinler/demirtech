import apiClient from '../utils/api-client'

export function _getLocationsByUserId() {
  return apiClient.get('/locations/get-locations-by-user-id')
}
