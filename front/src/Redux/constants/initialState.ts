import Order from '../../Interfaces/Order'
import { AppState, AuthState, OrderState } from '../interfaces/interfaces'

export const initialAuthState: AuthState = {
  isSms: false,
  isAuth: false,
  token: '',
  loading: false,
  error: '',
  smsCodeTime: new Date(),
  phone: '',
  code: '',
  isProcessOrder: false,
}

const initialDate = new Date().toLocaleDateString('ru-RU') + ' ' + new Date().toLocaleTimeString('ru-RU')
const initialOrder = new Order(navigator.appVersion, initialDate, [])

export const initialOrderState: OrderState = {
  order: initialOrder,
  loading: false,
  error: '',
  ruleCheck: true,
  smsCheck: true,
  personCheck: true,
  isShowPaymentSelection: false,
}

export const initialAppState: AppState = {
  isChangePoduct: false,
  loading: false,
  error: false,
  showSideDialog: false,
  formType: 'product',
  showProductModal: false,
  showLogin: false,
  showComboModal: false,
  isShowSuccessModal: false,
  keyUpdate: Math.random(),
  isShowTestModal: false,
  organizationId: 'c753337b-ccd2-4c3b-a605-0c8c23c20057',
}
