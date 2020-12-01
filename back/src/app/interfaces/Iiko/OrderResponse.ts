import { Order } from '../../entities'
import IikoErrorInfo from './IikoErrorInfo'
import OrderCreationStatus from './OrderCreationStatus'

export default interface OrderResponse {
  id: string
  organizationId: string
  timestamp: number
  creationStatus: OrderCreationStatus
  errorInfo: IikoErrorInfo
  order: Order
}
