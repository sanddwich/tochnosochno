import { Cookies } from 'react-cookie'
import { ThunkAction } from 'redux-thunk'
import { RootState } from '..'
import Address from '../../Interfaces/Address'
import ApiResponse from '../../Interfaces/ApiResponse'
import Order from '../../Interfaces/Order'
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
  HIDE_ORDER_LOADING,
  INC_ORDER_ITEM_AMOUNT,
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
import { AuthState } from '../interfaces/interfaces'
import { OrderActionType } from '../interfaces/order'

import { showProductDialog, showCartDialog, showCreditCardForm } from './app'
import { getCustomer } from './auth'

const apiServer = 'http://localhost:3001'
// const apiServer = 'http://myaso.holod30.ru'

export const applyBonusOrder = (isClear?: boolean) => {
  return (dispatch: any, getState: any) => {
    const { order } = getState().order
    const { customer } = getState().auth
    const costumerBonus = customer.bonus

    if (isClear) {
      dispatch(setOrderBonus(0))
      dispatch(calculateOrder())
    } else {
      if (!order.bonus) {
        if (order.amount >= costumerBonus) {
          dispatch(setOrderBonus(costumerBonus))
          dispatch(calculateOrder())
        } else {
          dispatch(setOrderBonus(order.amount))
          dispatch(calculateOrder())
        }
      } else {
        dispatch(setOrderBonus(0))
        dispatch(calculateOrder())
      }
    }
  }
}

export const processOrder = (): ThunkAction<void, RootState, null, any> => {
  return async (dispatch, getState) => {
    try {
      const { order } = getState().order
      const { token } = getState().auth
      const auth: AuthState = getState().auth
      const phone = auth.customer?.phone
      const cookies = new Cookies()
      const csrfToken = cookies.get('csrfToken')
      dispatch(setLoading())
      dispatch(setOrderPhone(phone || ''))
      const res = await fetch(`${apiServer}/api/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'CSRF-Token': csrfToken,
        },
        body: JSON.stringify({ order }),
      })

      if (!res.ok) {
        const resData: ApiResponse = await res.json()
        throw new Error(resData.message)
      }
      if (res.status === 201) {
        dispatch(setNewOrder())
        dispatch(getCustomer())
      }
      if (res.status === 200) {
        dispatch(showCreditCardForm())
        dispatch(getCustomer())
        dispatch(hideLoading())
      }
      const resData: [] = await res.json()
    } catch (err) {
      dispatch(setError(err.message))
    }
  }
}

export const getStreetVariants = (street: string): ThunkAction<void, RootState, null, any> => {
  return async (dispatch, getState) => {
    try {
      const { token } = getState().auth
      const cookies = new Cookies()
      const csrfToken = cookies.get('csrfToken')
      dispatch(setLoading())
      const res = await fetch(`${apiServer}/api/street`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'CSRF-Token': csrfToken,
        },
        body: JSON.stringify({ street }),
      })

      if (!res.ok) {
        const resData: ApiResponse = await res.json()
        throw new Error(resData.message)
      }
      if (res.status === 200) {
        dispatch(hideLoading())
      }
      const resData: [] = await res.json()
      return resData
    } catch (err) {
      dispatch(setError(err.message))
    }
  }
}

const setNewOrder = (): OrderActionType => {
  return {
    type: SET_INIT_ORDER,
  }
}

export const setDelivery = (isDelivery: boolean, address: Address) => {
  return {
    type: SET_DELIVERY,
    isDelivery: isDelivery,
    address: address,
  }
}

export const setPrepareDate = (prepareDate: string) => {
  return {
    type: SET_PREPARE_TIME,
    date: prepareDate,
  }
}

export const clearOrderError = () => {
  return {
    type: CLEAR_ORDER_ERROR,
  }
}

export const setOrderPayment = (isPayment: boolean, payment: PaymentType): OrderActionType => {
  return {
    type: SET_ORDER_PAYMENT,
    isPayment: isPayment,
    payment: payment,
  }
}

export const addOrderItemToOrder = (orderItem: OrderItem) => {
  return (dispatch: any) => {
    dispatch(addOrderItem(orderItem))
  }
}

export const setOrderItemAmount = (orderItem: OrderItem, amount: number): OrderActionType => {
  return {
    type: CHANGE_ORDER_ITEM_AMOUNT,
    orderItem: orderItem,
    amount: amount,
  }
}

export const changeOrderItem = (orderItem: OrderItem) => {
  return (dispatch: any) => {
    dispatch(changeOrderItemAction(orderItem))
    dispatch(calculateOrder())
    dispatch(showCartDialog())
  }
}

export const deleteOrderItem = (orderItem: OrderItem): OrderActionType => {
  return {
    type: DELETE_FROM_ORDER,
    orderItem: orderItem,
  }
}

export const changeAddress = (address: string): OrderActionType => {
  return {
    type: CHANGE_ADDRESS,
    address: address,
  }
}

const changeOrderItemAction = (orderItem: OrderItem): OrderActionType => {
  return {
    type: CHANGE_ITEM_ORDER,
    orderItem: orderItem,
  }
}

const setOrderBonus = (bonus: number): OrderActionType => {
  return {
    type: SET_ORDER_BONUS,
    bonus: bonus,
  }
}

const setOrderPhone = (phone: string): OrderActionType => {
  return {
    type: SET_ORDER_PHONE,
    phone: phone,
  }
}

const setLoading = (): OrderActionType => {
  return {
    type: SET_ORDER_LOADING,
  }
}
const hideLoading = (): OrderActionType => {
  return {
    type: HIDE_ORDER_LOADING,
  }
}

const setError = (error: string): OrderActionType => {
  return {
    type: SET_ORDER_ERROR,
    error: error,
  }
}

const addOrderItem = (orderItem: OrderItem): OrderActionType => {
  return {
    type: ADD_TO_ORDER,
    orderItem: orderItem,
  }
}

const calculateOrder = (): OrderActionType => {
  return {
    type: CALCULATE_ORDER,
  }
}
