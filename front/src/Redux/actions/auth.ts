import { ThunkAction } from 'redux-thunk'
import { RootState } from '..'
import Address from '../../Interfaces/Address'
import ApiResponse from '../../Interfaces/ApiResponse'
import Customer from '../../Interfaces/Customer'
import { withCookies, Cookies } from 'react-cookie'
import {
  ADD_CUSTOMER_ADDRESS,
  GET_SMS,
  LOGOUT,
  SET_AUTH_ERROR,
  SET_AUTH_LOADING,
  SET_AUTH_NOT_SMS,
  SET_CUSTOMER,
  SET_CUSTOMER_BONUS,
  SET_TOKEN,
} from '../constants/ActionTypes'
import { AuthActionType } from '../interfaces/auth'
import { OrderState } from '../interfaces/interfaces'

const apiServer = 'http://localhost:3001'

export const addCustomerAddress = (address: Address): ThunkAction<void, RootState, null, AuthActionType> => {
  return async (dispatch, getState) => {
    const cookies = new Cookies()
    const csrfToken = cookies.get('csrfToken')
    let { token } = getState().auth
    try {
      dispatch(setLoading())
      const res = await fetch(`${apiServer}/api/address`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'CSRF-Token': csrfToken,
        },
        body: JSON.stringify({ address }),
      })
      if (!res.ok) {
        const resData: Error = await res.json()
        throw new Error(resData.message)
      }

      const resData: Address = await res.json()
      dispatch(setAddress(resData))
    } catch (err) {
      dispatch(setError(err))
    }
  }
}

export const getCustomer = (): ThunkAction<void, RootState, null, AuthActionType> => {
  return async (dispatch, getState) => {
    const cookies = new Cookies()
    const csrfToken = cookies.get('csrfToken')
    let { token } = getState().auth
    if (token) {
      try {
        dispatch(setLoading())
        const res = await fetch(`${apiServer}/api/customer`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            'CSRF-Token': csrfToken,
          },
        })
        if (!res.ok) {
          if (res.status === 401) {
            dispatch(logoutAction())
          }
          const resData: Error = await res.json()
          throw new Error(resData.message)
        }

        const customer: Customer = await res.json()
        dispatch(setCustomer(customer))
      } catch (err) {
        dispatch(setError(err))
      }
    }
  }
}

export const logout = (): ThunkAction<void, RootState, null, AuthActionType> => {
  return async (dispatch, getState) => {
    try {
      const { token } = getState().auth
      dispatch(setLoading())
      const cookies = new Cookies()
      const csrfToken = cookies.get('csrfToken')
      const res = await fetch(`${apiServer}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'CSRF-Token': csrfToken,
        },
      })

      if (!res.ok) {
        const resData: Error = await res.json()
        throw new Error(resData.message)
      }
      const resData: ApiResponse = await res.json()
      dispatch(logoutAction())
      cookies.remove('sessionID')
      cookies.remove('csrfToken')
    } catch (err) {
      dispatch(setError(err))
    }
  }
}

export const getSmsCode = (phone: string): ThunkAction<void, RootState, null, AuthActionType> => {
  return async (dispatch) => {
    try {
      dispatch(setLoading())
      Cookies
      const res = await fetch(`${apiServer}/auth/login`, {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      })
      if (res.status === 429) {
        throw new Error('Слишком много запросов на сервер')
      }
      if (!res.ok) {
        const resData: Error = await res.json()
        throw new Error(resData.message)
      }

      const resData: ApiResponse = await res.json()

      dispatch(fetchSmsCode(phone))
    } catch (err) {
      console.log({ err })
      dispatch(setError(err))
    }
  }
}

export const sendSmsCode = (code: string): ThunkAction<void, RootState, null, AuthActionType> => {
  return async (dispatch, getState) => {
    try {
      const { phone } = getState().auth
      dispatch(setLoading())
      const res = await fetch(`${apiServer}/auth/auth`, {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, phone }),
      })

      if (!res.ok) {
        const resData: Error = await res.json()
        throw new Error(resData.message)
      }
      const response: ApiResponse = await res.json()
      const token = response.token
      const customer = response.customer
      if (token) {
        dispatch(setToken(token))
      }

      if (customer) {
        dispatch(setCustomer(customer))
      } else {
        throw new Error('Ошибка получения данных клиента')
      }
    } catch (err) {
      console.log(err)
      dispatch(setError(err))
    }
  }
}

export const setAuthError = (error: string): AuthActionType => {
  return {
    type: SET_AUTH_ERROR,
    error: error,
  }
}

export const setNotSms = (): AuthActionType => {
  return {
    type: SET_AUTH_NOT_SMS,
  }
}

// export const setCustomerBonus = (bonus: number): AuthActionType => {
//   return {
//     type: SET_CUSTOMER_BONUS,
//     bonus: bonus,
//   }
// }

const setCustomer = (customer: Customer): AuthActionType => {
  return {
    type: SET_CUSTOMER,
    customer: customer,
  }
}

const setToken = (token: string): AuthActionType => {
  return {
    type: SET_TOKEN,
    token: token,
  }
}

const fetchSmsCode = (phone: string): AuthActionType => {
  return {
    type: GET_SMS,
    phone: phone,
  }
}

const setLoading = (): AuthActionType => {
  return {
    type: SET_AUTH_LOADING,
  }
}

const setError = (error: Error): AuthActionType => {
  return {
    type: SET_AUTH_ERROR,
    error: error.message,
  }
}

const logoutAction = (): AuthActionType => {
  return {
    type: LOGOUT,
  }
}
const setAddress = (address: Address): AuthActionType => {
  return {
    type: ADD_CUSTOMER_ADDRESS,
    address: address,
  }
}
