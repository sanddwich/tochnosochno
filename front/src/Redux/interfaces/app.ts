import Order from '../../Interfaces/Order'
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
