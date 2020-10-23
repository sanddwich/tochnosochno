import React from 'react'
import OrderItem from '../../Interfaces/OrderItem'
import Product from '../../Interfaces/Product'
import ActionButton from '../ActionButton/ActionButton'
import NumberInput from '../NumberInput/NumberInput'
import RoundButton from '../RoundButton/RoundButton'
import { deleteOrderItem, setOrderItemAmount } from '../../Redux/actions/order'

import './LineProductWithNumberInput.scss'
import { connect } from 'react-redux'

interface LineProductWithNumberInputProps {
  orderItem: OrderItem
  deleteOrderItem: (orderItem: OrderItem) => void
  setOrderItemAmount: (orderItem: OrderItem, amount: number) => void
}

interface LineProductWithNumberInputState {}

class LineProductWithNumberInput extends React.Component<
  LineProductWithNumberInputProps,
  LineProductWithNumberInputState
> {
  setOrderItemAmount = (amount: number) => {
    this.props.setOrderItemAmount(this.props.orderItem, amount)
    if (amount === 0) {
      this.props.deleteOrderItem(this.props.orderItem)
    }
  }

  render() {
    return (
      <div className="LineProductWithNumberInput">
        <div className="LineProductWithNumberInput__product ">
          <div className="LineProductWithNumberInput__product__image  ">
            <img src={`${this.props.orderItem.product.imageLinks[0]}`} alt="" />
          </div>

          <div className="LineProductWithNumberInput__product__name ">{this.props.orderItem.product.name}</div>

          <div className="LineProductWithNumberInput__product__price">
            <div className="LineProductWithNumberInput__product__newPrice ">
              <span className="bold">{this.props.orderItem.product.sizePrices[0].price.currentPrice}</span>руб
            </div>

            <div className="LineProductWithNumberInput__product__oldPrice "> 200р</div>
          </div>
        </div>
        <NumberInput
          minValue={0}
          value={this.props.orderItem.amount}
          onChange={(amount: number) => {
            this.setOrderItemAmount(amount)
          }}
          label="Количество"
          hideLabel={true}
        />

        <div className="LineProductWithNumberInput__delete">
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
}

export default connect(null, mapDispatchToProps)(LineProductWithNumberInput)
