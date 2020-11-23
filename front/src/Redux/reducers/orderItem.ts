import OrderItem from '../../Interfaces/OrderItem'
import Product from '../../Interfaces/Product'
import {
  GET_ORDER_ITEM,
  SET_ORDER_ITEM,
  SET_ORDER_ITEM_AMOUNT,
  SET_ORDER_ITEM_MODIFIERS,
  SET_ORDER_ITEM_SIZE,
  SET_PRODUCT,
} from '../constants/ActionTypes'
import { OrderItemState } from '../interfaces/interfaces'
import { OrderItemAction } from '../interfaces/orderItem'
import { v4 as uuidv4 } from 'uuid'

const product: Product = {
  facets: [],
  id: '0',
  image: '',
  ingredients: '',
  isDeleted: false,
  modifiers: [],
  name: '',
  seoDescription: '',
  seoKeywords: '',
  seoText: '',
  seoTitle: '',
  weight: 0,
  variants: [],
  sizePrices: [],
  imageLinks: [],
  doNotPrintInCheque: false,
  order: 0,
  additionalInfo: '',
  tags: [],
  fullNameEnglish: '',
  recomended: [],
}

const initialOrderItem: OrderItem = {
  product: product,
  value: 0,
  amount: 1,
  productVariant: { id: 0, price: 0, product },
  orderItemModifiers: [],
  id: uuidv4(),
}

const initialState: OrderItemState = {
  orderItem: initialOrderItem,
  product,
}
const orderItem = (state = initialState, action: OrderItemAction) => {
  switch (action.type) {
    case SET_PRODUCT:
      let orderItem = initialState
      orderItem.product = action.product
      return {
        ...state,
        orderItem: {
          ...state.orderItem,
          id: Date.now(),
          product: action.product,
          value: 0,
          amount: 1,
          orderItemModifiers: [],
          productVariant: action.product.variants[0],
          order: action.orderId,
        },
        product: action.product,
      }

    case SET_ORDER_ITEM_SIZE:
      return {
        ...state,
        orderItem: {
          ...state.orderItem,
          productVariant: action.variant,
        },
      }
    case SET_ORDER_ITEM_AMOUNT:
      return {
        ...state,
        orderItem: {
          ...state.orderItem,
          amount: action.amount,
        },
      }

    case SET_ORDER_ITEM_MODIFIERS:
      return {
        ...state,
        orderItem: {
          ...state.orderItem,
          orderItemModifiers: action.modifiers.map((modifier) => {
            modifier.orderItem = state.orderItem.id
            return modifier
          }),
        },
      }
    case SET_ORDER_ITEM:
      return {
        ...state,
        orderItem: action.orderItem,
      }

    default:
      return state
  }
}

export default orderItem
