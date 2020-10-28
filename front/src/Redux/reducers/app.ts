import {
  GET_APP,
  HIDE_COMBO_MODAL,
  HIDE_LOGIN,
  HIDE_PRODUCT_MODAL,
  HIDE_SIDE_DIALOG,
  HIDE_SUCCESS_MODAL,
  SHOW_CART,
  SHOW_COMBO_MODAL,
  SHOW_COOKING_TIME,
  SHOW_CREDIT_CARD_FORM,
  SHOW_HISTORY,
  SHOW_LOGIN,
  SHOW_ORDER,
  SHOW_ORDER_DETAIL,
  SHOW_PAYMENT,
  SHOW_PRODUCT,
  SHOW_PRODUCT_MODAL,
  SHOW_SUCCESS_MODAL,
} from '../constants/ActionTypes'
import { AppActionType } from '../interfaces/app'
import { AppState } from '../interfaces/interfaces'

const initialState: AppState = {
  isChangePoduct: false,
  loading: false,
  error: false,
  showSideDialog: false,
  formType: 'product',
  showProductModal: false,
  showLogin: false,
  showComboModal: false,
  isShowSuccessModal: false,
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
    case SHOW_PRODUCT_MODAL:
      return {
        ...state,
        showProductModal: true,
        productModalProduct: action.product,
      }
    case HIDE_PRODUCT_MODAL:
      return {
        ...state,
        showProductModal: false,
        productModalProduct: undefined,
      }
    case SHOW_COMBO_MODAL:
      return {
        ...state,
        showComboModal: true,
        comboModalElement: action.combo,
      }
    case HIDE_COMBO_MODAL:
      return {
        ...state,
        showComboModal: false,
        comboModalElement: undefined,
      }

    case SHOW_LOGIN:
      return {
        ...state,
        showLogin: true,
      }
    case HIDE_LOGIN:
      return {
        ...state,
        showLogin: false,
      }
    case SHOW_SUCCESS_MODAL:
      return {
        ...state,
        isShowSuccessModal: true,
      }
    case HIDE_SUCCESS_MODAL:
      return {
        ...state,
        isShowSuccessModal: false,
      }
    default:
      return state
  }
}

export default app
