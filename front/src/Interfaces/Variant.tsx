import Product from './Product'

export default interface Variant {
  id: number
  name?: string
  price: number
  size?: string
  weight?: number
  product: Product
}
