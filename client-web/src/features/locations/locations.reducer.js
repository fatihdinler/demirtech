import { combineReducers } from '@reduxjs/toolkit'
import locationsApiReducer from './locations.api'
import locationsListReducer from './locations-list.state'

const locationsReducer = combineReducers({
  list: locationsListReducer,
  api: locationsApiReducer,
})

export default locationsReducer