import { Customer, OrderItem } from '../entities'
import Combo from './Combo'
import DeliveryPoint from './DeliveryPoint'
import IIkoOrderItem from './IIkoOrderItem'
import OrderServiceType from './OrderServiceType'

export default class IIkoOrder {
  completeBefore: string
  items: IIkoOrderItem[]
  phone: string
  customer: Customer
  orderServiceType?: OrderServiceType
  deliveryPoint?: DeliveryPoint
  comment?: string
  sourceKey?: string
  combos?: Combo[]
}
