import React from 'react'
import { connect } from 'react-redux'
import Order from '../../Interfaces/Order'
import OrderItem from '../../Interfaces/OrderItem'
import Product from '../../Interfaces/Product'
import { RootState } from '../../Redux'
import { addOrderItemToOrder, setOrderItemAmount, deleteOrderItem } from '../../Redux/actions/order'
import ActionButton from '../ActionButton/ActionButton'
import NumberInput from '../NumberInput/NumberInput'

interface AddProductButtonProps {
  order: Order
  product: Product
  addOrderItemToOrder: (orderItem: OrderItem) => void
  setOrderItemAmount: (orderItem: OrderItem, amount: number) => void
  deleteOrderItem: (orderItem: OrderItem) => void
  hideTextMobile: boolean
  hideInputMobile?: boolean
}

interface AddProductButtonState {
  orderItem: OrderItem | null
}

class AddProductButton extends React.Component<AddProductButtonProps, AddProductButtonState> {
  constructor(props: AddProductButtonProps) {
    super(props)
    this.state = {
      orderItem: null,
    }
  }

  componentDidMount() {
    // this.isProductInOrder()
  }

  setOrderItemAmount = (amount: number) => {
    const orderItem = this.getOrderItem()
    if (orderItem) {
      this.props.setOrderItemAmount(orderItem, amount)
      if (amount === 0) {
        this.props.deleteOrderItem(orderItem)
      }
      // cartAnimation()
      // productAnimation(orderItem.product.id)
    }
  }

  getOrderItem = (): OrderItem | undefined => {
    let item: OrderItem | undefined
    if (this.props.order.items) {
      this.props.order.items.map((orderItem: OrderItem) => {
        if (orderItem.product.id === this.props.product.id) {
          item = orderItem
        }
      })
    }
    return item
  }

  addToCartButton = (product: Product): void => {
    const orderItem = {
      product: product,
      amount: 1,
      orderItemModifiers: [],
      value: product.sizePrices[0].price.currentPrice,
    }
    this.props.addOrderItemToOrder(orderItem)
    this.setState({ orderItem })
    // cartAnimation()
  }

  render() {
    const orderItem = this.getOrderItem()
    let value = 0
    if (orderItem) {
      value = orderItem.amount
    }
    return (
      <React.Fragment>
        {orderItem ? (
          <NumberInput
            mobileHide={this.props.hideInputMobile}
            minValue={0}
            value={value}
            label=""
            hideLabel={true}
            onChange={(amount: number) => this.setOrderItemAmount(amount)}
          />
        ) : (
          <ActionButton
            hideTextMobile={this.props.hideTextMobile}
            backgroundColor="#303030"
            icon="cart_dark.svg"
            text="В корзину"
            width="180px"
            textColor="#ffffff"
            onClick={() => this.addToCartButton(this.props.product)}
          />
        )}
      </React.Fragment>
    )
  }
}

const mapDispatchToProps = {
  addOrderItemToOrder,
  setOrderItemAmount,
  deleteOrderItem,
}

const mapStateToProps = (state: RootState) => {
  const { order } = state.order

  return {
    order,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddProductButton)
