import { Variant } from 'react-bootstrap/esm/types'
import Modifier from '../../Interfaces/Modifier'
import OrderItem from '../../Interfaces/OrderItem'
import OrderItemModifier from '../../Interfaces/OrderItemModifier'
import Product from '../../Interfaces/Product'
import {
  GET_ORDER_ITEM,
  SET_ORDER_ITEM,
  SET_ORDER_ITEM_AMOUNT,
  SET_ORDER_ITEM_MODIFIERS,
  SET_ORDER_ITEM_SIZE,
  SET_ORDER_ITEM_VALUE,
  SET_PRODUCT,
} from '../constants/ActionTypes'

interface SetOrderItemAction {
  type: typeof SET_ORDER_ITEM
  orderItem: OrderItem
}

interface SetProductAction {
  type: typeof SET_PRODUCT
  product: Product
  orderId: number
}

interface GetOrderItemAction {
  type: typeof GET_ORDER_ITEM
  orderItem: OrderItem
}
interface SetOrderItemAmountAction {
  type: typeof SET_ORDER_ITEM_AMOUNT
  amount: number
}

interface SetOrderItemSizeAction {
  type: typeof SET_ORDER_ITEM_SIZE
  variant: Variant
}

interface SetOrderItemModifiersAction {
  type: typeof SET_ORDER_ITEM_MODIFIERS
  modifiers: OrderItemModifier[]
}

interface SetOrderItemValueAction {
  type: typeof SET_ORDER_ITEM_VALUE
  value: number
}

export type OrderItemAction =
  | SetOrderItemAction
  | GetOrderItemAction
  | SetProductAction
  | SetOrderItemSizeAction
  | SetOrderItemAmountAction
  | SetOrderItemModifiersAction
  | SetOrderItemValueAction
