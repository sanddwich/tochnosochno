import React from 'react'
import { connect } from 'react-redux'
import Order from '../../Interfaces/Order'
import OrderItem from '../../Interfaces/OrderItem'
import Product from '../../Interfaces/Product'
import { RootState } from '../../Redux'
import { addOrderItemToOrder, setOrderItemAmount, deleteOrderItem } from '../../Redux/actions/order'
import ActionButton from '../ActionButton/ActionButton'
import NumberInput from '../NumberInput/NumberInput'
import { cartAnimation } from '../../utils/animation'

interface AddProductButtonProps {
  order: Order
  product: Product
  addOrderItemToOrder: (orderItem: OrderItem) => void
  setOrderItemAmount: (orderItem: OrderItem, amount: number) => void
  deleteOrderItem: (orderItem: OrderItem) => void
  hideTextMobile: boolean
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
    this.isProductInOrder()
  }

  setOrderItemAmount = (amount: number) => {
    if (this.state.orderItem) {
      this.props.setOrderItemAmount(this.state.orderItem, amount)
      if (amount === 0) {
        this.props.deleteOrderItem(this.state.orderItem)
        this.setState({ orderItem: null })
      }
    }
    cartAnimation()
  }

  isProductInOrder = () => {
    if (this.props.order.items) {
      this.props.order.items.map((orderItem: OrderItem) => {
        if (orderItem.product.id === this.props.product.id) {
          this.setState({ orderItem })
        }
      })
    }
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
    cartAnimation()
  }

  render() {
    return (
      <React.Fragment>
        {this.state.orderItem ? (
          <NumberInput
            minValue={0}
            value={this.state.orderItem.amount}
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
