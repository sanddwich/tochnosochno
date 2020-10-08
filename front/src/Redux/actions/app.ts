import Order from '../../Interfaces/Order'
import {
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

export const showProductDialog = (isChangeProduct: boolean) => ({
  type: SHOW_PRODUCT,
  isChangeProduct: isChangeProduct,
})

export const hideSideDialog = () => ({
  type: HIDE_SIDE_DIALOG,
})

export const showOrderDialog = () => ({
  type: SHOW_ORDER,
})
export const showCartDialog = () => ({
  type: SHOW_CART,
})

export const showOrderDetail = (order: Order) => ({
  type: SHOW_ORDER_DETAIL,
  order: order,
})

export const showPayment = () => ({
  type: SHOW_PAYMENT,
})

export const showHistoryDialog = () => ({
  type: SHOW_HISTORY,
})
export const showCookingTimeDialog = () => ({
  type: SHOW_COOKING_TIME,
})

export const showCreditCardForm = () => ({
  type: SHOW_CREDIT_CARD_FORM,
})
