import { act } from 'react-dom/test-utils'
import FavoriteProduct from '../../Interfaces/FavoriteProduct'
import {
  ADD_CUSTOMER_ADDRESS,
  ADD_PRODUCT_TO_FAVOURITES,
  DELETE_PRODUCT_FROM_FAVOURITES,
  GET_SMS,
  HIDE_AUTH_LOADING,
  LOGOUT,
  SEND_CODE,
  SET_AUTH,
  SET_AUTH_ERROR,
  SET_AUTH_LOADING,
  SET_AUTH_NOT_SMS,
  SET_AUTH_PHONE,
  SET_CUSTOMER,
  SET_CUSTOMER_BIRTHDAY,
  SET_CUSTOMER_BONUS,
  SET_CUSTOMER_NAME,
  SET_TOKEN,
  SIGN_IN,
} from '../constants/ActionTypes'
import { AuthActionType } from '../interfaces/auth'
import { AuthState } from '../interfaces/interfaces'
import { v4 as uuidv4 } from 'uuid'

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
        code: '',
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
        code: '',
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
        code: '',
      }

    case LOGOUT:
      return {
        ...state,
        isAuth: false,
        token: '',
        code: '',
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
        code: '',
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

    case HIDE_AUTH_LOADING:
      return {
        ...state,
        loading: false,
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

    case SET_CUSTOMER_NAME:
      return {
        ...state,
        loading: false,
        error: '',
        customer: {
          ...state.customer,
          name: action.name,
        },
      }

    case SET_CUSTOMER_BIRTHDAY:
      return {
        ...state,
        loading: false,
        error: '',
        customer: {
          ...state.customer,
          birthday: action.birthday,
        },
      }

    case ADD_PRODUCT_TO_FAVOURITES:
      return {
        ...state,

        customer: {
          ...state.customer,
          favoriteProducts: [...state.customer?.favoriteProducts, { id: uuidv4(), product: action.product }],
        },
      }

    case DELETE_PRODUCT_FROM_FAVOURITES:
      return {
        ...state,

        customer: {
          ...state.customer,
          favoriteProducts: state.customer?.favoriteProducts.filter((favoriteProduct: FavoriteProduct) => {
            return favoriteProduct.product.id !== action.product.id
          }),
        },
      }

    default:
      return state
  }
}

export default auth
