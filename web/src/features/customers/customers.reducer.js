import { combineReducers } from '@reduxjs/toolkit'
import customersApiReducer from './customers.api'
import customersListReducer from './customers-list.state'
import customersCreateReducer from './customers-create.state'
import customersEditReducer from './customers-edit.state'

const devicesReducer = combineReducers({
  list: customersListReducer,
  edit: customersEditReducer,
  create: customersCreateReducer,
  api: customersApiReducer,
})

export default devicesReducer