import React from 'react'
import { connect } from 'react-redux'
import Order from '../../Interfaces/Order'
import OrderItem from '../../Interfaces/OrderItem'
import Product from '../../Interfaces/Product'
import { RootState } from '../../Redux'
import { addOrderItemToOrder, setOrderItemAmount, deleteOrderItem } from '../../Redux/actions/order'
import { hideComboModal } from '../../Redux/actions/app'
import ActionButton from '../ActionButton/ActionButton'
import NumberInput from '../NumberInput/NumberInput'
import { cartAnimation } from '../../utils/animation'
import Category from '../../Interfaces/Category'

interface AddComboButtonProps {
  comboId: string
  order: Order
  products: Product[]
  addOrderItemToOrder: (orderItem: OrderItem) => void
  setOrderItemAmount: (orderItem: OrderItem, amount: number) => void
  deleteOrderItem: (orderItem: OrderItem) => void
  hideComboModal: () => void
}

interface AddComboButtonState {
  orderItem: OrderItem | null
}

class AddComboButton extends React.Component<AddComboButtonProps, AddComboButtonState> {
  constructor(props: AddComboButtonProps) {
    super(props)
    this.state = {
      orderItem: null,
    }
  }

  componentDidMount() {}

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

  addToCartButton = (products: Product[]): void => {
    const pickDate = new Date().valueOf()
    products.map((product) => {
      const orderItem: OrderItem = {
        product: product,
        amount: 1,
        orderItemModifiers: [],
        value: (product.sizePrices && product.sizePrices[0].price.currentPrice) || product.price,
        comboId: this.props.comboId,
        pickDate: pickDate,
      }

      this.props.addOrderItemToOrder(orderItem)
    })

    this.props.hideComboModal()
    cartAnimation()
  }

  render() {
    return (
      <React.Fragment>
        <ActionButton
          backgroundColor="#303030"
          icon="cart_dark.svg"
          text="В корзину"
          width="180px"
          textColor="#ffffff"
          // onClick={() => console.log('AddComboButton')}
          onClick={() => this.addToCartButton(this.props.products)}
        />
      </React.Fragment>
    )
  }
}

const mapDispatchToProps = {
  addOrderItemToOrder,
  setOrderItemAmount,
  deleteOrderItem,
  hideComboModal,
}

const mapStateToProps = (state: RootState) => {
  const { order } = state.order

  return {
    order,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddComboButton)
