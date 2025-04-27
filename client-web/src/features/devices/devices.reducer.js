import { combineReducers } from '@reduxjs/toolkit'
import devicesApiReducer from './devices.api'

const devicesReducer = combineReducers({
  api: devicesApiReducer,
})

export default devicesReducer