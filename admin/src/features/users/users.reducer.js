import { combineReducers } from '@reduxjs/toolkit'
import usersApiReducer from './users.api'
import usersListReducer from './users-list.state'
import usersCreateReducer from './users-create.state'
import usersEditReducer from './users-edit.state'

const branchesReducer = combineReducers({
  list: usersListReducer,
  edit: usersEditReducer,
  create: usersCreateReducer,
  api: usersApiReducer,
})

export default branchesReducer