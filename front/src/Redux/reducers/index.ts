import { combineReducers } from 'redux'
import order from './order'
import menu from './menu'
import auth, * as fromAuth from './auth'
import app, * as fromApp from './app'
import orderItem, * as fromOrderItem from './orderItem'

export default combineReducers({
  menu,
  auth,
  app,
  order,
  orderItem,
})
