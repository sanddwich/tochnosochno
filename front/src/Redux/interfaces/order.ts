import Address from '../../Interfaces/Address'
import OrderItem from '../../Interfaces/OrderItem'
import PaymentType from '../../Interfaces/PaymentType'
import {
  ADD_DELIVERY_SERVICE_PRODUCT,
  ADD_TO_ORDER,
  CALCULATE_ORDER,
  CHANGE_ADDRESS,
  CHANGE_ITEM_ORDER,
  CHANGE_ORDER_ITEM_AMOUNT,
  CLEAR_ORDER_ERROR,
  DEC_ORDER_ITEM_AMOUNT,
  DELETE_DELIVERY_SERVICE_PRODUCT,
  DELETE_FROM_ORDER,
  GET_ORDER,
  HIDE_ORDER_LOADING,
  HIDE_PAYMENT_SELECTION,
  INC_ORDER_ITEM_AMOUNT,
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
  SHOW_PAYMENT_SELECTION,
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

interface SetGuestCount {
  type: typeof SET_GUEST_COUNT
  count: number
}

interface SetOrderPoilitic {
  type: typeof SET_ORDER_POLITIC
  ruleCheck: boolean
  smsCheck: boolean
  personCheck: boolean
}

interface ShowPaymentSelection {
  type: typeof SHOW_PAYMENT_SELECTION
}

interface HidePaymentSelection {
  type: typeof HIDE_PAYMENT_SELECTION
}

interface AddDeliveryToOrderAction {
  type: typeof ADD_DELIVERY_SERVICE_PRODUCT
  delivery: any
}

interface DeleteDeliveryFromOrderAction {
  type: typeof DELETE_DELIVERY_SERVICE_PRODUCT
}

interface SetTerminalAction {
  type: typeof SET_TERMINAL
  terminalId: string
}

interface SetCommentAction {
  type: typeof SET_COMMENT
  comment: string
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
  | SetGuestCount
  | SetOrderPoilitic
  | ShowPaymentSelection
  | HidePaymentSelection
  | AddDeliveryToOrderAction
  | DeleteDeliveryFromOrderAction
  | SetTerminalAction
  | SetCommentAction
