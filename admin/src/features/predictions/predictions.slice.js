import { createSlice } from '@reduxjs/toolkit'
import { fetchDeviceForecast } from './predictions.api'

const initialState = {
    byDevice: {},
}

const predictionsSlice = createSlice({
    name: 'predictions',
    initialState,
    reducers: {
        clearForecast: (state, action) => {
            delete state.byDevice[action.payload]
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDeviceForecast.pending, (state, action) => {
                // GÜVENLÝ ERÝÞÝM: Eðer arg bir obje ise id'yi al, deðilse arg'ýn kendisini al
                const deviceId = typeof action.meta.arg === 'object' ? action.meta.arg.id : action.meta.arg;

                if (deviceId) {
                    state.byDevice[deviceId] = { data: null, isLoading: true, error: null };
                }
            })
            .addCase(fetchDeviceForecast.fulfilled, (state, action) => {
                const { deviceId, data } = action.payload;
                state.byDevice[deviceId] = { data, isLoading: false, error: null };
            })
            .addCase(fetchDeviceForecast.rejected, (state, action) => {
                // rejectWithValue ile gönderdiðimiz objeyi güvenli alalým
                const payload = action.payload || {};
                const deviceId = payload.deviceId;
                if (deviceId) {
                    state.byDevice[deviceId] = { data: null, isLoading: false, error: payload.message };
                }
            })
    },
})

export const { clearForecast } = predictionsSlice.actions
export default predictionsSlice.reducer