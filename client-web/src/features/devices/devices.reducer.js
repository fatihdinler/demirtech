import { combineReducers } from '@reduxjs/toolkit'
import devicesApiReducer from './devices.api'
import devicesListReducer from './devices-list.state'

const devicesReducer = combineReducers({
  api: devicesApiReducer,
  list: devicesListReducer,
})

export default devicesReducer