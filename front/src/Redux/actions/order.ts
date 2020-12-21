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
  DELETE_DELIVERY_SERVICE_PRODUCT,
  DELETE_FROM_ORDER,
  HIDE_ORDER_LOADING,
  HIDE_PAYMENT_SELECTION,
  INC_ORDER_ITEM_AMOUNT,
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
import { AuthState } from '../interfaces/interfaces'
import { OrderActionType } from '../interfaces/order'

import { showProductDialog, showCartDialog, showCreditCardForm, showSuccessModal, showLoginModal } from './app'
import { getCustomer } from './auth'
import { cartAnimation, productAnimation } from '../../utils/animation'

import { API_URL } from '../../utils/config'
const apiServer = API_URL

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
      const auth: AuthState = getState().auth
      const phone = auth.customer?.phone
      dispatch(setLoading())
      dispatch(setOrderPhone(phone || ''))
      const { order } = getState().order
      const { token } = getState().auth

      const cookies = new Cookies()
      const csrfToken = cookies.get('csrfToken')

      const res = await fetch(`${apiServer}/api/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'CSRF-Token': csrfToken,
        },
        body: JSON.stringify({ order }),
      })

      if (res.status === 401) {
        dispatch(showLoginModal())
      }
      if (!res.ok) {
        const resData: ApiResponse = await res.json()
        throw new Error(resData.message)
      }
      if (res.status === 201) {
        dispatch(setNewOrder())
        dispatch(getCustomer())
        dispatch(showSuccessModal())
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

export const getCityVariants = (city: string): ThunkAction<void, RootState, null, any> => {
  return async (dispatch, getState) => {
    try {
      const { token } = getState().auth
      const cookies = new Cookies()
      const csrfToken = cookies.get('csrfToken')
      dispatch(setLoading())
      const res = await fetch(`${apiServer}/api/city`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'CSRF-Token': csrfToken,
        },
        body: JSON.stringify({ city }),
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

export const getAllCities = (): ThunkAction<void, RootState, null, any> => {
  return async (dispatch, getState) => {
    try {
      const { token } = getState().auth
      const cookies = new Cookies()
      const csrfToken = cookies.get('csrfToken')
      dispatch(setLoading())
      const res = await fetch(`${apiServer}/api/cities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'CSRF-Token': csrfToken,
        },
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

export const getGeoLocation = (coordinates: number[]): ThunkAction<void, RootState, null, any> => {
  return async (dispatch, getState) => {
    try {
      dispatch(setLoading())
      const res = await fetch(`${apiServer}/api/geo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ coordinates }),
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

export const getStreetsByCity = (street: string, cityId: string): ThunkAction<void, RootState, null, any> => {
  return async (dispatch, getState) => {
    try {
      const { token } = getState().auth
      const cookies = new Cookies()
      const csrfToken = cookies.get('csrfToken')
      dispatch(setLoading())
      const res = await fetch(`${apiServer}/api/streetsbycity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'CSRF-Token': csrfToken,
        },
        body: JSON.stringify({ cityId, street }),
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

export const getDeliveryRestrictions = (
  streetId: string,
  deliverySum: number,
  house: string,
  isCourierDelivery: boolean,
  latitude: number,
  longitude: number,
  classifierId: string,
  deliveryDate: string
): ThunkAction<void, RootState, null, any> => {
  return async (dispatch, getState) => {
    try {
      const { token } = getState().auth

      const cookies = new Cookies()
      const csrfToken = cookies.get('csrfToken')

      dispatch(setLoading())
      const res = await fetch(`${apiServer}/api/delivery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'CSRF-Token': csrfToken,
        },
        body: JSON.stringify({
          streetId,
          deliverySum,
          house,
          isCourierDelivery,
          latitude,
          longitude,
          classifierId,
          deliveryDate,
        }),
      })

      if (!res.ok) {
        const resData: ApiResponse = await res.json()
        throw new Error(resData.message)
      }
      if (res.status === 200) {
        dispatch(hideLoading())
      }
      const resData = await res.json()
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

export const setTerminal = (terminalId: string) => {
  return {
    type: SET_TERMINAL,
    terminalId,
  }
}

export const setComment = (comment: string) => {
  return {
    type: SET_COMMENT,
    comment,
  }
}

export const setOrderPolitic = (smsCheck: boolean, ruleCheck: boolean, personCheck: boolean) => {
  return {
    type: SET_ORDER_POLITIC,
    smsCheck,
    ruleCheck,
    personCheck,
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
  cartAnimation()
  return (dispatch: any) => {
    dispatch(addOrderItem(orderItem))

    dispatch(calculateOrder())
  }
}

export const setOrderItemAmount = (orderItem: OrderItem, amount: number): OrderActionType => {
  cartAnimation()
  return {
    type: CHANGE_ORDER_ITEM_AMOUNT,
    orderItem: orderItem,
    amount: amount,
  }
}

export const changeOrderItem = (orderItem: OrderItem) => {
  cartAnimation()
  return (dispatch: any) => {
    dispatch(deleteDeliveryProduct())
    dispatch(changeOrderItemAction(orderItem))
    dispatch(calculateOrder())
    dispatch(showCartDialog())
  }
}

export const deleteOrderItem = (orderItem: OrderItem): OrderActionType => {
  cartAnimation()
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

export const setGuestCount = (count: number): OrderActionType => {
  return {
    type: SET_GUEST_COUNT,
    count: count,
  }
}

export const showPaymentSelection = (): OrderActionType => {
  return {
    type: SHOW_PAYMENT_SELECTION,
  }
}

export const hidePaymentSelection = (): OrderActionType => {
  return {
    type: HIDE_PAYMENT_SELECTION,
  }
}

export const deleteDeliveryProduct = () => {
  return (dispatch: any) => {
    dispatch(clearDeliveryProduct())
    dispatch(calculateOrder())
    dispatch(hidePaymentSelection())
  }
}

const clearDeliveryProduct = (): OrderActionType => {
  return {
    type: DELETE_DELIVERY_SERVICE_PRODUCT,
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

export const calculateOrder = (): OrderActionType => {
  return {
    type: CALCULATE_ORDER,
  }
}
