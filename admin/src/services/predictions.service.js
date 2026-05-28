import axios from 'axios'

const API_BASE_URL = `${process.env.REACT_APP_API_URL}/devices`

// timeRange eklendi ve URL'ye parametre olarak verildi
export const _getDeviceForecast = async (deviceId, timeRange = 'hourly') => {
    const response = await axios.get(`${API_BASE_URL}/${deviceId}/forecast?timeRange=${timeRange}`)
    return response.data
}