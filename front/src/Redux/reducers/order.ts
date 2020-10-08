import Order from '../../Interfaces/Order'
import {
  ADD_TO_ORDER,
  CALCULATE_ORDER,
  CHANGE_ADDRESS,
  CHANGE_ITEM_ORDER,
  CHANGE_ORDER_ITEM_AMOUNT,
  CLEAR_ORDER_ERROR,
  DELETE_FROM_ORDER,
  HIDE_ORDER_LOADING,
  PROCESS_ORDER,
  SET_DELIVERY,
  SET_INIT_ORDER,
  SET_ORDER_AMOUNT,
  SET_ORDER_BONUS,
  SET_ORDER_ERROR,
  SET_ORDER_LOADING,
  SET_ORDER_PAYMENT,
  SET_PREPARE_TIME,
} from '../constants/ActionTypes'
import { OrderState } from '../interfaces/interfaces'
import { OrderActionType } from '../interfaces/order'
const initialDate = new Date().toLocaleDateString('ru-RU') + ' ' + new Date().toLocaleTimeString('ru-RU')

const initialOrder = new Order('Новый', navigator.appVersion, initialDate, [])

const initialState: OrderState = {
  order: initialOrder,
  loading: false,
  error: '',
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
        loading: false,
        error: '',
        order: new Order('Новый', navigator.appVersion, initialDate, []),
      }
    case ADD_TO_ORDER:
      return {
        ...state,
        order: {
          bonus: 0,
          ...state.order,
          amount: state.order.amount + action.orderItem.value * action.orderItem.amount,
          orderItems: [...(state.order.orderItems || []), action.orderItem],
          date: new Date().toLocaleDateString('ru-RU') + ' ' + new Date().toLocaleTimeString('ru-RU'),
        },
      }
    case DELETE_FROM_ORDER:
      return {
        ...state,
        order: {
          ...state.order,

          amount: state.order.amount + (state.order.bonus || 0) - action.orderItem.value * action.orderItem.amount,
          orderItems: state.order.orderItems?.filter((orderItem) => {
            return orderItem !== action.orderItem
          }),
          bonus: 0,
        },
      }

    case CHANGE_ORDER_ITEM_AMOUNT:
      return {
        ...state,
        order: {
          ...state.order,
          bonus: 0,
          orderItems: state.order.orderItems?.map((orderItem) => {
            if (orderItem.id === action.orderItem.id) {
              orderItem.amount = action.amount
            }
            return orderItem
          }),

          amount: state.order.orderItems?.reduce((acc, currentOrderItem) => {
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
        order: {
          ...state.order,
          orderItems: state.order.orderItems?.map((orderItem) => {
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
          amount: state.order.orderItems?.reduce((acc, currentOrderItem) => {
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
          address: action.address,
        },
      }

    case SET_PREPARE_TIME:
      return {
        ...state,
        order: {
          ...state.order,
          prepareDate: action.date,
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

    default:
      return state
  }
}

export default order
