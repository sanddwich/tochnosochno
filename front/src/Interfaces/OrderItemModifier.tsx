import Modifier from './Modifier'

export default class OrderItemModifier {
  id?: number
  amount: number
  productModifier: Modifier
  orderItem?: string

  constructor(amount: number, productModifier: Modifier) {
    this.amount = amount
    this.productModifier = productModifier
  }
}
