import Address from '../../Interfaces/Address'
import Customer from '../../Interfaces/Customer'
import Product from '../../Interfaces/Product'
import {
  ADD_CUSTOMER_ADDRESS,
  ADD_PRODUCT_TO_FAVOURITES,
  DELETE_PRODUCT_FROM_FAVOURITES,
  GET_AUTH,
  GET_SMS,
  GET_TOKEN,
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
  SET_PROCESS_ORDER_AUTH,
  SET_SMS,
  SET_TOKEN,
  SIGN_IN,
} from '../constants/ActionTypes'

interface GetTokenAction {
  type: typeof GET_TOKEN
}
interface GetSmsAction {
  type: typeof GET_SMS
  phone: string
}

interface LogoutAction {
  type: typeof LOGOUT
}

interface GetIsAuthAction {
  type: typeof GET_AUTH
}

interface SetCustomerAction {
  type: typeof SET_CUSTOMER
  customer: Customer
}

interface SetTokenAction {
  type: typeof SET_TOKEN
  token: string
}
interface SetIsSmsAction {
  type: typeof SET_SMS
  isSms: boolean
}
interface SetIsAuthAction {
  type: typeof SET_AUTH
  isAuth: boolean
}

interface SendCodeAuthAction {
  type: typeof SEND_CODE
  code: string
}

interface SignInAction {
  type: typeof SIGN_IN
  token: string
}

interface SetAuthLoadingAction {
  type: typeof SET_AUTH_LOADING
}

interface HideAuthLoadingAction {
  type: typeof HIDE_AUTH_LOADING
}

interface SetAuthErrorAction {
  type: typeof SET_AUTH_ERROR
  error: string
}

interface SetNotSmsAction {
  type: typeof SET_AUTH_NOT_SMS
}

interface AddCustomerAddress {
  type: typeof ADD_CUSTOMER_ADDRESS
  address: Address
}

interface SetCustomerBonusAction {
  type: typeof SET_CUSTOMER_BONUS
  bonus: number
}

interface SetPhoneAction {
  type: typeof SET_AUTH_PHONE
  phone: string
}

interface SetCustomerName {
  type: typeof SET_CUSTOMER_NAME
  name: string
}

interface SetCustomerBithday {
  type: typeof SET_CUSTOMER_BIRTHDAY
  birthday: string
}
interface AddProductToFavorites {
  type: typeof ADD_PRODUCT_TO_FAVOURITES
  product: Product
}
interface DeleteProductFromFavorites {
  type: typeof DELETE_PRODUCT_FROM_FAVOURITES
  product: Product
}

interface SetProcessOrderAuth {
  type: typeof SET_PROCESS_ORDER_AUTH
  isProcessOrder: boolean
}

export type AuthActionType =
  | GetIsAuthAction
  | GetSmsAction
  | GetTokenAction
  | SetIsAuthAction
  | SetTokenAction
  | SetIsAuthAction
  | SetIsSmsAction
  | SignInAction
  | SetAuthLoadingAction
  | HideAuthLoadingAction
  | SetAuthErrorAction
  | SendCodeAuthAction
  | LogoutAction
  | SetCustomerAction
  | SetNotSmsAction
  | AddCustomerAddress
  | SetCustomerBonusAction
  | SetPhoneAction
  | SetCustomerBithday
  | SetCustomerName
  | AddProductToFavorites
  | DeleteProductFromFavorites
  | SetProcessOrderAuth
