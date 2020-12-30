import Order from '../../Interfaces/Order'
import {
  ADD_TO_ORDER,
  CALCULATE_ORDER,
  CHANGE_ADDRESS,
  CHANGE_ITEM_ORDER,
  CHANGE_ORDER_ITEM_AMOUNT,
  CLEAR_ORDER_ERROR,
  DELETE_DELIVERY_SERVICE_PRODUCT,
  DELETE_FROM_ORDER,
  HIDE_ORDER_LOADING,
  HIDE_PAYMENT_SELECTION,
  PROCESS_ORDER,
  SET_COMMENT,
  SET_DELIVERY,
  SET_GUEST_COUNT,
  SET_INIT_ORDER,
  SET_ORDER_AMOUNT,
  SET_ORDER_BONUS,
  SET_ORDER_ERROR,
  SET_ORDER_LOADING,
  SET_ORDER_PAYMENT,
  SET_ORDER_PHONE,
  SET_ORDER_POLITIC,
  SET_PREPARE_TIME,
  SET_TERMINAL,
  SET_TERMINALS,
  SHOW_PAYMENT_SELECTION,
} from '../constants/ActionTypes'
import { OrderState } from '../interfaces/interfaces'
import { OrderActionType } from '../interfaces/order'
import { v4 as uuidv4 } from 'uuid'
import { act } from '@testing-library/react'
import OrderItemModifier from '../../Interfaces/OrderItemModifier'
import { getRequiredModifiers } from '../../utils/utils'

const initialDate = new Date().toLocaleDateString('ru-RU') + ' ' + new Date().toLocaleTimeString('ru-RU')

const initialOrder = new Order(navigator.appVersion, initialDate, [])

const initialState: OrderState = {
  order: initialOrder,
  loading: false,
  error: '',
  ruleCheck: true,
  smsCheck: true,
  personCheck: true,
  isShowPaymentSelection: false,
}

const order = (state = initialState, action: OrderActionType) => {
  switch (action.type) {
    case CLEAR_ORDER_ERROR:
      return {
        ...state,
        error: '',
      }
    case SET_INIT_ORDER:
      return {
        ...state,
        isShowPaymentSelection: false,
        loading: false,
        error: '',
        order: new Order(navigator.appVersion, initialDate, []),
      }
    case ADD_TO_ORDER:
      if (!action.orderItem.id) action.orderItem.id = uuidv4()
      const orderItemRequiredModifiers = [] as OrderItemModifier[]
      const requiredModifiers = getRequiredModifiers(action.orderItem.product)
      requiredModifiers.map((modifier) => {
        orderItemRequiredModifiers.push(new OrderItemModifier(1, modifier))
      })

      const orderItem = action.orderItem
      orderItem.orderItemModifiers = ([] as OrderItemModifier[]).concat(orderItemRequiredModifiers)

      return {
        ...state,
        isShowPaymentSelection: false,
        order: {
          bonus: 0,
          ...state.order,

          amount: state.order.amount + action.orderItem.value * action.orderItem.amount,
          items: [
            ...(state.order.items?.filter((orderItem) => {
              return !orderItem.product.parentGroup?.isService
            }) || []),
            orderItem,
          ],

          date: new Date().toLocaleDateString('ru-RU') + ' ' + new Date().toLocaleTimeString('ru-RU'),
        },
      }
    case DELETE_FROM_ORDER:
      return {
        ...state,
        isShowPaymentSelection: false,
        order: {
          ...state.order,

          amount: state.order.amount + (state.order.bonus || 0) - action.orderItem.value * action.orderItem.amount,
          items: state.order.items
            ?.filter((orderItem) => {
              return !orderItem.product.parentGroup?.isService
            })
            .filter((orderItem) => {
              return orderItem !== action.orderItem
            }),
          bonus: 0,
        },
      }

    case CHANGE_ORDER_ITEM_AMOUNT:
      return {
        ...state,
        isShowPaymentSelection: false,
        order: {
          ...state.order,
          bonus: 0,
          items: state.order.items
            ?.filter((orderItem) => {
              return !orderItem.product.parentGroup?.isService
            })
            .map((orderItem) => {
              if (orderItem.id === action.orderItem.id) {
                orderItem.amount = action.amount
              }
              return orderItem
            }),

          amount: state.order.items
            ?.filter((orderItem) => {
              return !orderItem.product.parentGroup?.isService
            })
            .reduce((acc, currentOrderItem) => {
              return acc + currentOrderItem.value * currentOrderItem.amount
            }, 0),
        },
      }

    case CHANGE_ADDRESS:
      return {
        ...state,
        address: action.address,
      }

    case SET_ORDER_AMOUNT:
      return {
        ...state,
        amount: action.amount,
      }

    case CHANGE_ITEM_ORDER:
      return {
        ...state,
        isShowPaymentSelection: false,
        order: {
          ...state.order,
          items: state.order.items?.map((orderItem) => {
            if (orderItem.id === action.orderItem.id) {
              orderItem = action.orderItem
            }
            return orderItem
          }),
        },
      }

    case CALCULATE_ORDER:
      return {
        ...state,

        order: {
          ...state.order,
          amount: state.order.items?.reduce((acc, currentOrderItem) => {
            return acc + currentOrderItem.value * currentOrderItem.amount
          }, -(state.order.bonus || 0)),
        },
      }

    case SET_ORDER_PAYMENT:
      return {
        ...state,
        order: {
          ...state.order,
          isPayment: action.isPayment,
          payment: action.payment,
        },
      }
    case PROCESS_ORDER:
      return {
        ...state,
        loading: false,
        error: '',
      }
    case SET_ORDER_LOADING:
      return {
        ...state,
        loading: true,
        error: '',
      }
    case SET_ORDER_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
      }

    case SET_DELIVERY:
      return {
        ...state,
        order: {
          ...state.order,
          isDelivery: action.isDelivery,
          orderServiceType: action.isDelivery ? 'DeliveryByCourier' : 'DeliveryByClient',
          address: action.address,
          // terminalId: action.isDelivery ? null : action.address.id,
        },
      }
    case SET_TERMINAL:
      return {
        ...state,
        order: {
          ...state.order,
          terminalId: action.terminalId,
        },
      }

    case SET_COMMENT:
      return {
        ...state,
        order: {
          ...state.order,
          comment: action.comment,
        },
      }

    case SET_PREPARE_TIME:
      return {
        ...state,
        order: {
          ...state.order,
          completeBefore: action.date,
        },
      }

    case SET_ORDER_BONUS:
      return {
        ...state,
        order: {
          ...state.order,
          bonus: action.bonus,
        },
      }

    case HIDE_ORDER_LOADING:
      return {
        ...state,
        loading: false,
      }
    case SET_ORDER_POLITIC:
      return {
        ...state,
        smsCheck: action.smsCheck,
        personCheck: action.personCheck,
        ruleCheck: action.ruleCheck,
      }

    case SET_ORDER_PHONE:
      return {
        ...state,
        order: {
          ...state.order,
          phone: action.phone,
        },
      }

    case SET_GUEST_COUNT:
      return {
        ...state,
        order: {
          ...state.order,
          guests: {
            ...state.order.guests,
            count: action.count,
          },
        },
      }

    case SHOW_PAYMENT_SELECTION:
      return {
        ...state,
        isShowPaymentSelection: true,
      }

    case HIDE_PAYMENT_SELECTION:
      return {
        ...state,
        isShowPaymentSelection: false,
      }

    case DELETE_DELIVERY_SERVICE_PRODUCT:
      return {
        ...state,
        isShowPaymentSelection: false,
        order: {
          ...state.order,

          // amount: state.order.amount + (state.order.bonus || 0) - action.orderItem.value * action.orderItem.amount,
          items: state.order.items?.filter((orderItem) => {
            return !orderItem.product.parentGroup?.isService
          }),
          bonus: 0,
        },
      }

    default:
      return state
  }
}

export default order
