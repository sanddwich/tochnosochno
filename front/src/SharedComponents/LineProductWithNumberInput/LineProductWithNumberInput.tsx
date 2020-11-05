import React from 'react'
import OrderItem from '../../Interfaces/OrderItem'
import Product from '../../Interfaces/Product'
import ActionButton from '../ActionButton/ActionButton'
import NumberInput from '../NumberInput/NumberInput'
import RoundButton from '../RoundButton/RoundButton'
import { deleteOrderItem, setOrderItemAmount } from '../../Redux/actions/order'
import { showProductModal } from '../../Redux/actions/app'
import { cartAnimation } from '../../utils/animation'
import './LineProductWithNumberInput.scss'
import { connect } from 'react-redux'
import { RootState } from '../../Redux'
import Order from '../../Interfaces/Order'

interface LineProductWithNumberInputProps {
  orderItem: OrderItem
  deleteOrderItem: (orderItem: OrderItem) => void
  setOrderItemAmount: (orderItem: OrderItem, amount: number) => void
  showProductModal: (product: Product) => void
  order: Order
}

interface LineProductWithNumberInputState {}

class LineProductWithNumberInput extends React.Component<
  LineProductWithNumberInputProps,
  LineProductWithNumberInputState
> {
  setOrderItemAmount = (amount: number) => {
    const orderItem = this.getOrderItem()
    if (orderItem) {
      this.props.setOrderItemAmount(orderItem, amount)
      if (amount === 0) {
        this.props.deleteOrderItem(orderItem)
      }
      cartAnimation()
    }
  }

  getOrderItem = (): OrderItem | undefined => {
    let item: OrderItem | undefined
    if (this.props.order.items) {
      this.props.order.items.map((orderItem: OrderItem) => {
        if (orderItem.product.id === this.props.orderItem.product.id) {
          item = orderItem
        }
      })
    }
    return item
  }

  setNumberInputValue = (amount: number) => {}

  render() {
    const orderItem = this.getOrderItem()
    let value = 0
    if (orderItem) {
      value = orderItem.amount
    }
    return (
      <div className="LineProductWithNumberInput">
        <div className="LineProductWithNumberInput__product ">
          <div className="LineProductWithNumberInput__product__image  ">
            <img
              src={`${
                this.props.orderItem.product.imageLinks.length > 0
                  ? this.props.orderItem.product.imageLinks[0]
                  : '/images/products/no-photo.png'
              }`}
              alt=""
            />
          </div>

          <div
            onClick={() => this.props.showProductModal(this.props.orderItem.product)}
            className="LineProductWithNumberInput__product__name "
          >
            {this.props.orderItem.product.name}
          </div>

          <div className="LineProductWithNumberInput__product__price">
            <div className="LineProductWithNumberInput__product__newPrice ">
              <span className="bold">{this.props.orderItem.product.sizePrices[0].price.currentPrice}</span>руб
            </div>

            {/* <div className="LineProductWithNumberInput__product__oldPrice "> 200р</div> */}
          </div>
        </div>
        <NumberInput
          minValue={0}
          value={value}
          onChange={(amount: number) => {
            this.setOrderItemAmount(amount)
          }}
          label="Количество"
          hideLabel={true}
        />

        <div className="LineProductWithNumberInput__delete ml-1 ml-xl-4">
          <RoundButton
            width="60px"
            height="60px"
            backgroundColor="#F2F2F2"
            icon="trash.svg"
            onClick={() => this.props.deleteOrderItem(this.props.orderItem)}
          />
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = {
  deleteOrderItem,
  setOrderItemAmount,
  showProductModal,
}

const mapStateToProps = (state: RootState) => {
  const { order } = state.order

  return {
    order,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LineProductWithNumberInput)
