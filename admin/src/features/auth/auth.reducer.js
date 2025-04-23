import { combineReducers } from '@reduxjs/toolkit'
import authApiStore from './auth.api'

const authReducer = combineReducers({
  api: authApiStore,
})

export default authReducer