import React from 'react'
import { connect } from 'react-redux'
import Order from '../../Interfaces/Order'
import OrderItem from '../../Interfaces/OrderItem'
import Product from '../../Interfaces/Product'
import { RootState } from '../../Redux'
import { addOrderItemToOrder, deleteOrderItem } from '../../Redux/actions/order'
import { hideComboModal } from '../../Redux/actions/app'
import ActionButton from '../ActionButton/ActionButton'
import { cartAnimation } from '../../utils/animation'

interface UpdateComboButtonProps {
  order: Order
  pickDate: number
  comboId: string
  products: Product[]
  addOrderItemToOrder: (orderItem: OrderItem) => void
  hideComboModal: () => void
  deleteOrderItem: (orderItem: OrderItem) => void
}

interface UpdateComboButtonState {
  orderItem: OrderItem | null
}

class UpdateComboButton extends React.Component<UpdateComboButtonProps, UpdateComboButtonState> {
  constructor(props: UpdateComboButtonProps) {
    super(props)
    this.state = {
      orderItem: null,
    }
  }

  componentDidMount() {
    // console.log(this.props)
  }

  updateComboButton = (products: Product[]): void => {
    // console.log('updateComboButton')
    // console.log(this.props)
    const pickDate = new Date().valueOf()

    if (this.props.order.items) {
      this.props.order.items.map((item) => {
        // console.log(item)
        if (item.comboId === this.props.comboId && item.pickDate === this.props.pickDate) {
          console.log('deleted')
          this.props.deleteOrderItem(item)
        }
      })

      // products.map((product) => {
      //   const orderItem: OrderItem = {
      //     product: product,
      //     amount: 1,
      //     orderItemModifiers: [],
      //     value: product.sizePrices[0].price.currentPrice,
      //     comboId: this.props.comboId,
      //     pickDate: pickDate,
      //   }

      //   this.props.addOrderItemToOrder(orderItem)
      // })

      // this.props.hideComboModal()
    }
  }

  render() {
    return (
      <React.Fragment>
        <ActionButton
          backgroundColor="#303030"
          icon="cart_dark.svg"
          text="Обновить"
          width="180px"
          textColor="#ffffff"
          // onClick={() => console.log('UpdateComboButton')}
          onClick={() => this.updateComboButton(this.props.products)}
        />
      </React.Fragment>
    )
  }
}

const mapDispatchToProps = {
  addOrderItemToOrder,
  deleteOrderItem,
  hideComboModal,
}

const mapStateToProps = (state: RootState) => {
  const { order } = state.order

  return {
    order,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateComboButton)
