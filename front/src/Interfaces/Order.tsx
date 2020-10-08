import Address from './Address'
import OrderItem from './OrderItem'
import OrderItemModifier from './OrderItemModifier'
import PaymentType from './PaymentType'

export default class Order {
  id?: number
  name?: string
  status: string
  amount: number
  device: string
  date: string
  prepareDate?: string
  bonus?: number
  isDelivery?: boolean
  comment?: string
  orderItems: OrderItem[] | undefined
  address?: Address
  isPayment?: boolean
  payment?: PaymentType

  constructor(status: string, device: string, date: string, orderItems?: OrderItem[]) {
    this.amount = 0
    this.orderItems = []
    this.status = status
    this.device = device
    this.orderItems = orderItems
    this.date = date
    this.id = Date.now()
  }

  _calculateTotalPrice = () => {
    let totalProducts = 0
    let totalModifiers = 0
    console.log(this)
    if (this.orderItems) {
      this.orderItems.map((orderItem) => {
        totalProducts = totalProducts + orderItem.amount * orderItem.productVariant.price
        orderItem.orderItemModifiers.map((orderItemModifier) => {
          totalModifiers =
            totalModifiers +
            orderItemModifier.amount * orderItemModifier.productModifier.modifier.price * orderItem.amount
        })
      })

      this.amount = totalModifiers + totalProducts
    }
  }

  private _addOrderItem = (orderItem: OrderItem) => {
    if (this.orderItems) {
      this.orderItems.push(orderItem)
    } else {
      const orderItems = []
      orderItems.push(orderItem)
      this.orderItems = orderItems
    }

    this._calculateTotalPrice()
  }

  private _deleteOrderItem = (orderItem: OrderItem, index: number) => {
    console.log(this.orderItems)
    this.orderItems = this.orderItems?.filter((item, idx) => idx != index)
    this._calculateTotalPrice()
  }

  private _addOrderItemModifier = (orderItemModifier: OrderItemModifier, orderItem: OrderItem) => {
    if (this.orderItems) {
      this.orderItems.map((item) => {
        if (item === orderItem) {
          item.orderItemModifiers.push(orderItemModifier)
        }
      })
    }
    this._calculateTotalPrice()
  }

  private _deleteOrderItemModifier = (orderItemModifier: OrderItemModifier, orderItem: OrderItem) => {
    if (this.orderItems) {
      this.orderItems.map((item) => {
        if (item === orderItem) {
          item.orderItemModifiers = item.orderItemModifiers.filter((item) => orderItemModifier != item)
        }
      })
    }
    this._calculateTotalPrice()
  }

  private _changeOrderItemAmount = (orderItem: OrderItem, amount: number) => {
    if (this.orderItems) {
      this.orderItems.map((item) => {
        if (item === orderItem) {
          item.amount = amount
        }
      })
      this._calculateTotalPrice()
    }
  }

  private _changeOrderItemModifierAmount = (
    orderItem: OrderItem,
    amount: number,
    orderItemModifier: OrderItemModifier
  ) => {
    if (this.orderItems) {
      this.orderItems.map((item) => {
        if (item === orderItem) {
          item.orderItemModifiers.map((item) => {
            if (item === orderItemModifier) {
              item.amount = amount
            }
          })
        }
      })
      this._calculateTotalPrice()
    }
  }
}
