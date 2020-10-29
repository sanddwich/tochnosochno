import Category from '../../Interfaces/Category'
import ComboItemOrder from '../../Interfaces/ComboItemOrder'
import Order from '../../Interfaces/Order'
import Product from '../../Interfaces/Product'
import {
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

export const showProductModal = (product: Product) => ({
  type: SHOW_PRODUCT_MODAL,
  product: product,
})

export const hideProductModal = () => ({
  type: HIDE_PRODUCT_MODAL,
})

export const showComboModal = (combo: Category, comboItemOrder?: ComboItemOrder) => ({
  type: SHOW_COMBO_MODAL,
  combo: combo,
  comboItemOrder: comboItemOrder,
})

export const hideComboModal = () => ({
  type: HIDE_COMBO_MODAL,
})

export const showLoginModal = () => ({
  type: SHOW_LOGIN,
})

export const hideLoginModal = () => ({
  type: HIDE_LOGIN,
})

export const showSuccessModal = () => ({
  type: SHOW_SUCCESS_MODAL,
})

export const hideSuccessModal = () => ({
  type: HIDE_SUCCESS_MODAL,
})
