import { combineReducers } from '@reduxjs/toolkit'
import dashboardReducer from './dashboard.state'

const devicesReducer = combineReducers({
  dashboard: dashboardReducer,
})

export default devicesReducer