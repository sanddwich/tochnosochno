import {
  GET_APP,
  HIDE_SIDE_DIALOG,
  SHOW_CART,
  SHOW_COOKING_TIME,
  SHOW_CREDIT_CARD_FORM,
  SHOW_HISTORY,
  SHOW_ORDER,
  SHOW_ORDER_DETAIL,
  SHOW_PAYMENT,
  SHOW_PRODUCT,
} from '../constants/ActionTypes'
import { AppActionType } from '../interfaces/app'
import { AppState } from '../interfaces/interfaces'

const initialState: AppState = {
  isChangePoduct: false,
  loading: false,
  error: false,
  showSideDialog: false,
  formType: 'product',
}
const app = (state: AppState = initialState, action: AppActionType) => {
  switch (action.type) {
    case SHOW_PRODUCT:
      return {
        ...state,
        showSideDialog: true,
        formType: 'product',
        isChangeProduct: action.isChangeProduct,
      }
    case SHOW_ORDER:
      return {
        ...state,
        showSideDialog: true,
        formType: 'order',
      }
    case SHOW_CART:
      return {
        ...state,
        showSideDialog: true,
        formType: 'cart',
      }
    case SHOW_HISTORY:
      return {
        ...state,
        showSideDialog: true,
        formType: 'history',
      }
    case SHOW_ORDER_DETAIL:
      return {
        ...state,
        showSideDialog: true,
        formType: 'orderDetails',
        orderHistory: action.order,
      }
    case SHOW_PAYMENT:
      return {
        ...state,
        showSideDialog: true,
        formType: 'payment',
      }
    case SHOW_CREDIT_CARD_FORM:
      return {
        ...state,
        showSideDialog: true,
        formType: 'creditCard',
      }

    case SHOW_COOKING_TIME:
      return {
        ...state,
        showSideDialog: true,
        formType: 'cookingTime',
      }

    case HIDE_SIDE_DIALOG:
      return {
        ...state,
        showSideDialog: false,
      }
    default:
      return state
  }
}

export default app
