import { combineReducers, configureStore } from '@reduxjs/toolkit'
import devicesReducer from './devices/devices.reducer'
import sidebarReducer from './sidebar/sidebar.state'
import customersReducer from './customers/customers.reducer'

const rootReducer = combineReducers({
  devices: devicesReducer,
  sidebar: sidebarReducer,
  customers: customersReducer,
})

const store = configureStore({
  reducer: rootReducer,
})

export default store