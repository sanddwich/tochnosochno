import Address from '../../Interfaces/Address'
import OrderItem from '../../Interfaces/OrderItem'
import PaymentType from '../../Interfaces/PaymentType'
import {
  ADD_TO_ORDER,
  CALCULATE_ORDER,
  CHANGE_ADDRESS,
  CHANGE_ITEM_ORDER,
  CHANGE_ORDER_ITEM_AMOUNT,
  CLEAR_ORDER_ERROR,
  DEC_ORDER_ITEM_AMOUNT,
  DELETE_FROM_ORDER,
  GET_ORDER,
  HIDE_ORDER_LOADING,
  INC_ORDER_ITEM_AMOUNT,
  PROCESS_ORDER,
  SET_DELIVERY,
  SET_INIT_ORDER,
  SET_ORDER_AMOUNT,
  SET_ORDER_BONUS,
  SET_ORDER_ERROR,
  SET_ORDER_LOADING,
  SET_ORDER_PAYMENT,
  SET_ORDER_PHONE,
  SET_PREPARE_TIME,
} from '../constants/ActionTypes'

interface GetOrderAction {
  type: typeof GET_ORDER
}

interface AddToOrderAction {
  type: typeof ADD_TO_ORDER
  orderItem: OrderItem
}

interface DeleteFromOrderAction {
  type: typeof DELETE_FROM_ORDER
  orderItem: OrderItem
  // index: number
}

interface ChangeItemOrderAction {
  type: typeof CHANGE_ITEM_ORDER
  orderItem: OrderItem
}

interface ChangeAddressOrderAction {
  type: typeof CHANGE_ADDRESS
  address: string
}

interface SetAmountOrderAction {
  type: typeof SET_ORDER_AMOUNT
  amount: number
}

interface ChangeOrderItemAmount {
  type: typeof CHANGE_ORDER_ITEM_AMOUNT
  amount: number
  orderItem: OrderItem
}

interface CalculateOrder {
  type: typeof CALCULATE_ORDER
}
interface SetOrderPayment {
  type: typeof SET_ORDER_PAYMENT
  isPayment: boolean
  payment: PaymentType
}

interface ProcessOrder {
  type: typeof PROCESS_ORDER
}

interface SetOrderLoading {
  type: typeof SET_ORDER_LOADING
}

interface SetOrderError {
  type: typeof SET_ORDER_ERROR
  error: string
}

interface SetInitOrder {
  type: typeof SET_INIT_ORDER
}

interface ClearOrderError {
  type: typeof CLEAR_ORDER_ERROR
}

interface SetDelivery {
  type: typeof SET_DELIVERY
  address: Address
  isDelivery: boolean
}

interface SetPrepareTime {
  type: typeof SET_PREPARE_TIME
  date: string
}

interface SetOrderBonus {
  type: typeof SET_ORDER_BONUS
  bonus: number
}

interface HideLoading {
  type: typeof HIDE_ORDER_LOADING
}

interface HideLoading {
  type: typeof HIDE_ORDER_LOADING
}

interface SetOrderPhone {
  type: typeof SET_ORDER_PHONE
  phone: string
}

export type OrderActionType =
  | AddToOrderAction
  | DeleteFromOrderAction
  | ChangeItemOrderAction
  | GetOrderAction
  | ChangeAddressOrderAction
  | SetAmountOrderAction
  | ChangeOrderItemAmount
  | ChangeItemOrderAction
  | CalculateOrder
  | SetOrderPayment
  | ProcessOrder
  | SetOrderError
  | SetOrderLoading
  | SetInitOrder
  | ClearOrderError
  | SetDelivery
  | SetPrepareTime
  | SetOrderBonus
  | HideLoading
  | SetOrderPhone
