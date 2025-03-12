import { combineReducers } from '@reduxjs/toolkit'
import locationsApiReducer from './locations.api'
import locationsListReducer from './locations-list.state'
import locationsCreateReducer from './locations-create.state'
import locationsEditReducer from './locations-edit.state'

const locationsReducer = combineReducers({
  list: locationsListReducer,
  edit: locationsEditReducer,
  create: locationsCreateReducer,
  api: locationsApiReducer,
})

export default locationsReducer