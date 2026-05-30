import axios from 'axios'

const API_BASE_URL = `${process.env.REACT_APP_API_URL}/devices`

// timeRange eklendi ve URL'ye parametre olarak verildi
export const _getDeviceForecast = async (deviceId, timeRange = 'hourly') => {
    // URL'in sonuna &t=... ile o anýn milisaniyesini ekliyoruz. 
    // Bu sayede tarayýcý her isteði tamamen "yeni ve benzersiz" sanýp önbellekten veri getiremez.
    const timestamp = new Date().getTime();
    const response = await axios.get(`${API_BASE_URL}/${deviceId}/forecast?timeRange=${timeRange}&t=${timestamp}`)
    return response.data
}