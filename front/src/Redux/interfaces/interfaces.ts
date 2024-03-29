import Category from '../../Interfaces/Category'
import ComboItemOrder from '../../Interfaces/ComboItemOrder'
import Customer from '../../Interfaces/Customer'
import FormType from '../../Interfaces/FormType'
import Order from '../../Interfaces/Order'
import OrderItem from '../../Interfaces/OrderItem'
import Organization from '../../Interfaces/Organization'
import Product from '../../Interfaces/Product'
import Terminal from '../../Interfaces/Terminal'

export interface MenuState {
  menu: Category[]
  terminals: Terminal[]
  loading: boolean
  error: string
  date: Date
  productsLoading: boolean
  organizations: Organization[]
}

export interface OrderState {
  order: Order
  loading: false
  error: string
  ruleCheck: boolean
  personCheck: boolean
  smsCheck: boolean
  isShowPaymentSelection: boolean
}

export interface OrderItemState {
  orderItem: OrderItem
  product: Product
}

export interface AuthState {
  customer?: Customer
  token: string
  isSms: boolean
  isAuth: boolean
  loading: boolean
  error: string
  smsCodeTime: Date
  phone: string
  code: string
  isProcessOrder: boolean
}

export interface AppState {
  loading: boolean
  error: boolean
  showSideDialog: boolean
  formType: FormType
  isChangePoduct: boolean
  orderHistory?: Order
  showProductModal: boolean
  productModalProduct?: Product
  comboModalElement?: Category
  comboItemOrder?: ComboItemOrder
  showLogin: boolean
  showComboModal: boolean
  isShowSuccessModal: boolean
  isShowTestModal: boolean
  keyUpdate: number
  organizationId: string
}
