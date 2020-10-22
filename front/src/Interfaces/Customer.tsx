import Order from './Order'
import Address from './Address'

export default interface Customer {
  id: number
  phone: string
  email: string
  name: string
  orders: Order[]
  addresses: Address[]
  bonus: number
  birthday: string
}
