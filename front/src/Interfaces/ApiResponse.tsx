import Customer from './Customer'

export default interface ApiResponse {
  error: boolean
  message: string
  token?: string
  customer?: Customer
}
