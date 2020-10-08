import { Variant } from 'react-bootstrap/esm/types'
import { RootState } from '..'
import Modifier from '../../Interfaces/Modifier'
import OrderItem from '../../Interfaces/OrderItem'
import OrderItemModifier from '../../Interfaces/OrderItemModifier'
import Product from '../../Interfaces/Product'
import {
  SET_ORDER_ITEM,
  SET_ORDER_ITEM_AMOUNT,
  SET_ORDER_ITEM_MODIFIERS,
  SET_ORDER_ITEM_SIZE,
  SET_ORDER_ITEM_VALUE,
  SET_PRODUCT,
} from '../constants/ActionTypes'
import { OrderItemAction } from '../interfaces/orderItem'
import { showProductDialog } from './app'

export const setProduct = (product: Product) => {
  return (dispatch: any, getState: any) => {
    const orderId = getState().order.order.id
    dispatch(setProductAction(product, orderId))
    dispatch(calculateOrderItemValue())
    dispatch(showProductDialog(false))
  }
}

export const changeOrderItemSize = (variant: Variant) => {
  return (dispatch: any) => {
    dispatch(setOrderItemSize(variant))
    dispatch(calculateOrderItemValue())
  }
}

export const changeOrderItemAmount = (amount: number) => {
  return (dispatch: any) => {
    dispatch(setOrderItemAmount(amount))
    dispatch(calculateOrderItemValue())
  }
}

export const changeOrderItemModifiers = (modifiers: OrderItemModifier[]) => {
  return (dispatch: any, getState: any) => {
    dispatch(setOrderItemModifiers(modifiers))
    dispatch(calculateOrderItemValue())
  }
}

export const setOrderItem = (orderItem: OrderItem) => ({
  type: SET_ORDER_ITEM,
  orderItem: orderItem,
})

const setProductAction = (product: Product, orderId: number): OrderItemAction => ({
  type: SET_PRODUCT,
  product: product,
  orderId: orderId,
})

const calculateOrderItemValue = () => {
  return (dispatch: any, getState: any) => {
    const { orderItem } = getState().orderItem
    let modifiersPrice = 0
    const productPrice = orderItem.productVariant.price
    orderItem.orderItemModifiers.map((modifier: OrderItemModifier) => {
      modifiersPrice += modifier.amount * modifier.productModifier.modifier.price
    })
    const result = productPrice + modifiersPrice
    orderItem.value = result
    dispatch(setOrderItemValue(result))
  }
}

const setOrderItemModifiers = (modifiers: OrderItemModifier[]) => ({
  type: SET_ORDER_ITEM_MODIFIERS,
  modifiers: modifiers,
})
const setOrderItemValue = (value: number) => ({
  type: SET_ORDER_ITEM_VALUE,
  value: value,
})

const setOrderItemSize = (variant: Variant) => ({
  type: SET_ORDER_ITEM_SIZE,
  variant: variant,
})

const setOrderItemAmount = (amount: number) => ({
  type: SET_ORDER_ITEM_AMOUNT,
  amount: amount,
})
