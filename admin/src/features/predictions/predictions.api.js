import { createAsyncThunk } from '@reduxjs/toolkit'
import { _getDeviceForecast } from '../../services/predictions.service'

export const fetchDeviceForecast = createAsyncThunk(
    'predictions/fetchDeviceForecast',
    async (arg, { rejectWithValue }) => {
        // Arguman bir obje mi yoksa sadece ID mi? Kontrol et ve ayýkla:
        const id = typeof arg === 'object' ? arg.id : arg;
        const timeRange = typeof arg === 'object' ? arg.timeRange : 'hourly';

        try {
            const data = await _getDeviceForecast(id, timeRange)
            return { deviceId: id, data }
        } catch (error) {
            return rejectWithValue({
                deviceId: id,
                message: error.response?.data?.message || error.message,
            })
        }
    }
)