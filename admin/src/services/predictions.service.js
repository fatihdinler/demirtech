import axios from 'axios'

const API_BASE_URL = `${process.env.REACT_APP_API_URL}/devices`

export const _getDeviceForecast = async (deviceId) => {
  const response = await axios.get(`${API_BASE_URL}/${deviceId}/forecast`)
  return response.data
}
