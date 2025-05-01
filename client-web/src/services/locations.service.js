import apiClient from '../utils/api-client'

export function _getLocationsByUserId() {
  return apiClient.get('/locations/get-locations-by-user-id')
}

export function _getReportsForLocations({ locationIds, startTime, endTime }) {
  return apiClient.post('/locations/reports', { locationIds, startTime, endTime })
}