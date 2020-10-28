import Category from '../../Interfaces/Category'
import Order from '../../Interfaces/Order'
import Product from '../../Interfaces/Product'
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

interface GetAppAction {
  type: typeof GET_APP
}

interface ShowProductDialogAction {
  type: typeof SHOW_PRODUCT
  isChangeProduct: boolean
}

interface ShowOrderDialogAction {
  type: typeof SHOW_ORDER
}
interface ShowCartDialogAction {
  type: typeof SHOW_CART
}
interface ShowHistoryDialogAction {
  type: typeof SHOW_HISTORY
}
interface ShowCookingTimeDialogAction {
  type: typeof SHOW_COOKING_TIME
}

interface HideSideDialogAction {
  type: typeof HIDE_SIDE_DIALOG
}

interface ShowOrderDetailDialogAction {
  type: typeof SHOW_ORDER_DETAIL
  order: Order
}

interface ShowPaymentDialogAction {
  type: typeof SHOW_PAYMENT
}
interface ShowCreditCardFormAction {
  type: typeof SHOW_CREDIT_CARD_FORM
}
interface ShowProductModal {
  type: typeof SHOW_PRODUCT_MODAL
  product: Product
}
interface HideProductModal {
  type: typeof HIDE_PRODUCT_MODAL
}
interface ShowComboModal {
  type: typeof SHOW_COMBO_MODAL
  combo: Category
}
interface HideComboModal {
  type: typeof HIDE_COMBO_MODAL
}

interface ShowLoginModal {
  type: typeof SHOW_LOGIN
}

interface HideLoginModal {
  type: typeof HIDE_LOGIN
}

interface ShowSuccessModal {
  type: typeof SHOW_SUCCESS_MODAL
}

interface HideSuccessModal {
  type: typeof HIDE_SUCCESS_MODAL
}

export type AppActionType =
  | GetAppAction
  | ShowProductDialogAction
  | HideSideDialogAction
  | ShowOrderDialogAction
  | ShowCartDialogAction
  | ShowCookingTimeDialogAction
  | ShowHistoryDialogAction
  | ShowOrderDetailDialogAction
  | ShowPaymentDialogAction
  | ShowCreditCardFormAction
  | ShowProductModal
  | HideProductModal
  | ShowLoginModal
  | HideLoginModal
  | ShowComboModal
  | HideComboModal
  | ShowSuccessModal
  | HideSuccessModal
