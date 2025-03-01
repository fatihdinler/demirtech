import { combineReducers } from '@reduxjs/toolkit'
import climatesApiReducer from './climates.api'
import climatesListReducer from './climates-list.state'
import climatesCreateReducer from './climates-create.state'
import climatesEditReducer from './climates-edit.state'

const climatesReducer = combineReducers({
  list: climatesListReducer,
  edit: climatesEditReducer,
  create: climatesCreateReducer,
  api: climatesApiReducer,
})

export default climatesReducer