import Variant from './Variant'
import OrderItemModifier from './OrderItemModifier'
import Product from './Product'

export default interface OrderItem {
  id?: number
  amount: number
  productVariant: Variant
  product: Product
  orderItemModifiers: OrderItemModifier[]
  value: number
  order?: number
}
