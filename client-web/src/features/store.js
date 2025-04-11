import { combineReducers, configureStore } from '@reduxjs/toolkit'
import sidebarReducer from './sidebar/sidebar.state'
import dashboardReducer from './dashboard/dashboard.reducer'
import authReducer from './auth/auth.reducer'

const rootReducer = combineReducers({
  sidebar: sidebarReducer,
  dashboard: dashboardReducer,
  auth: authReducer,
})

const store = configureStore({
  reducer: rootReducer,
})

export default store