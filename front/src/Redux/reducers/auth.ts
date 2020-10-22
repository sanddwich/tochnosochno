import { act } from 'react-dom/test-utils'
import {
  ADD_CUSTOMER_ADDRESS,
  GET_SMS,
  LOGOUT,
  SEND_CODE,
  SET_AUTH,
  SET_AUTH_ERROR,
  SET_AUTH_LOADING,
  SET_AUTH_NOT_SMS,
  SET_AUTH_PHONE,
  SET_CUSTOMER,
  SET_CUSTOMER_BONUS,
  SET_TOKEN,
  SIGN_IN,
} from '../constants/ActionTypes'
import { AuthActionType } from '../interfaces/auth'
import { AuthState } from '../interfaces/interfaces'

const initialState: AuthState = {
  isSms: false,
  isAuth: false,
  token: '',
  loading: false,
  error: '',
  smsCodeTime: new Date(),
  phone: '',
  code: '',
}
const auth = (state: AuthState = initialState, action: AuthActionType) => {
  switch (action.type) {
    case GET_SMS:
      return {
        ...state,
        isSms: true,
        phone: action.phone,
        smsCodeTime: new Date(),
        loading: false,
      }

    case SEND_CODE:
      return {
        ...state,
        code: action.code,
        loading: false,
        error: '',
      }
    case SET_CUSTOMER:
      return {
        ...state,
        customer: action.customer,
        isAuth: true,
        loading: false,
        error: '',
      }

    case SET_TOKEN:
      return {
        ...state,
        token: action.token,
        loading: false,
        error: '',
        isSms: false,
        phone: '',
        code: '',
      }

    case SIGN_IN:
      return {
        ...state,
        isAuth: true,
        isSms: false,
      }

    case LOGOUT:
      return {
        ...state,
        isAuth: false,
        token: '',
        customer: undefined,
        loading: false,
        isSms: false,
      }

    case SET_AUTH_LOADING:
      return {
        ...state,
        error: '',
        loading: true,
      }
    case SET_AUTH_ERROR:
      return {
        ...state,
        error: action.error,
        loading: false,
      }
    case SET_AUTH_NOT_SMS:
      return {
        ...state,
        isSms: false,
        error: '',
      }
    case SET_CUSTOMER_BONUS:
      return {
        ...state,
        customer: {
          ...state.customer,
          bonus: action.bonus,
        },
      }

    case SET_AUTH_PHONE:
      return {
        ...state,
        phone: action.phone,
      }

    case ADD_CUSTOMER_ADDRESS:
      return {
        ...state,
        loading: false,
        error: '',
        customer: {
          ...state.customer,
          address: state.customer?.addresses.push(action.address),
        },
      }

    default:
      return state
  }
}

export default auth
