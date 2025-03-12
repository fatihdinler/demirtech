import { combineReducers } from '@reduxjs/toolkit'
import devicesApiReducer from './devices.api'
import devicesListReducer from './devices-list.state'
import devicesEditReducer from './devices-edit.state'
import devicesCreateReducer from './devices-create.state'

const devicesReducer = combineReducers({
  list: devicesListReducer,
  edit: devicesEditReducer,
  create: devicesCreateReducer,
  api: devicesApiReducer,
})

export default devicesReducer