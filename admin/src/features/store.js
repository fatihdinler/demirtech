import { combineReducers, configureStore } from '@reduxjs/toolkit'
import devicesReducer from './devices/devices.reducer'
import sidebarReducer from './sidebar/sidebar.state'
import customersReducer from './customers/customers.reducer'
import branchesReducer from './branches/branches.reducer'
import locationsReducer from './locations/locations.reducer'
import dashboardReducer from './dashboard/dashboard.reducer'
import usersReducer from './users/users.reducer'
import authReducer from './auth/auth.reducer'
import loginReducer from './login/login.state'

const rootReducer = combineReducers({
  devices: devicesReducer,
  sidebar: sidebarReducer,
  customers: customersReducer,
  branches: branchesReducer,
  locations: locationsReducer,
  dashboard: dashboardReducer,
  users: usersReducer,
  auth: authReducer,
  login: loginReducer,
})

const store = configureStore({
  reducer: rootReducer,
})

export default store