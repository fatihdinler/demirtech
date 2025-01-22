import { combineReducers, configureStore } from '@reduxjs/toolkit'
import devicesReducer from './devices/devices.reducer'

const rootReducer = combineReducers({
  devices: devicesReducer,
})

const store = configureStore({
  reducer: rootReducer,
})

export default store