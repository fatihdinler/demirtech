import { combineReducers, configureStore } from '@reduxjs/toolkit'
import devicesReducer from './devices/devices.reducer'
import sidebarReducer from './sidebar/sidebar.state'
import customersReducer from './customers/customers.reducer'
import branchesReducer from './branches/branches.reducer'
import climatesReducer from './climates/climates.reducer'

const rootReducer = combineReducers({
  devices: devicesReducer,
  sidebar: sidebarReducer,
  customers: customersReducer,
  branches: branchesReducer,
  climates: climatesReducer,
})

const store = configureStore({
  reducer: rootReducer,
})

export default store