import { combineReducers, configureStore } from '@reduxjs/toolkit'
import sidebarReducer from './sidebar/sidebar.state'
import dashboardReducer from './dashboard/dashboard.reducer'

const rootReducer = combineReducers({
  sidebar: sidebarReducer,
  dashboard: dashboardReducer,
})

const store = configureStore({
  reducer: rootReducer,
})

export default store