import { combineReducers, configureStore } from '@reduxjs/toolkit'
import sidebarReducer from './sidebar/sidebar.state'
import dashboardReducer from './dashboard/dashboard.reducer'
import authReducer from './auth/auth.reducer'
import devicesReducer from './devices/devices.reducer'
import locationsRedcuer from './locations/locations.reducer'

const rootReducer = combineReducers({
  sidebar: sidebarReducer,
  dashboard: dashboardReducer,
  auth: authReducer,
  devices: devicesReducer,
  locations: locationsRedcuer,
})

const store = configureStore({
  reducer: rootReducer,
})

export default store