import { combineReducers } from '@reduxjs/toolkit'
import branchesApiReducer from './branches.api'
import branchesListReducer from './branches-list.state'
import branchesCreateReducer from './branches-create.state'
import branchesEditReducer from './branches-edit.state'

const branchesReducer = combineReducers({
  list: branchesListReducer,
  edit: branchesEditReducer,
  create: branchesCreateReducer,
  api: branchesApiReducer,
})

export default branchesReducer