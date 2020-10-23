import Order from './Order'
import Address from './Address'
import FavoriteProduct from './FavoriteProduct'

export default interface Customer {
  id: number
  phone: string
  email: string
  name: string
  orders: Order[]
  addresses: Address[]
  bonus: number
  birthday: string
  favoriteProducts: FavoriteProduct[]
}
