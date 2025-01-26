import { combineReducers, configureStore } from '@reduxjs/toolkit'
import devicesReducer from './devices/devices.reducer'
import sidebarReducer from './sidebar/sidebar.state'

const rootReducer = combineReducers({
  devices: devicesReducer,
  sidebar: sidebarReducer,
})

const store = configureStore({
  reducer: rootReducer,
})

export default store