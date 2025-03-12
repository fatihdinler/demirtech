import { combineReducers, configureStore } from '@reduxjs/toolkit'
import devicesReducer from './devices/devices.reducer'
import sidebarReducer from './sidebar/sidebar.state'
import customersReducer from './customers/customers.reducer'
import branchesReducer from './branches/branches.reducer'
import locationsReducer from './locations/locations.reducer'

const rootReducer = combineReducers({
  devices: devicesReducer,
  sidebar: sidebarReducer,
  customers: customersReducer,
  branches: branchesReducer,
  locations: locationsReducer,
})

const store = configureStore({
  reducer: rootReducer,
})

export default store