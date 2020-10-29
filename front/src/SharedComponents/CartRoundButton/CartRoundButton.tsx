import React from 'react'
import { Container } from 'react-bootstrap'
import { connect } from 'react-redux'
import Order from '../../Interfaces/Order'
import OrderItem from '../../Interfaces/OrderItem'
import { RootState } from '../../Redux'

import './CartRoundButton.scss'

interface CartRoundButtonProps {
  order: Order
  icon: string
  onClick: any
  backgroundColor: string
  width?: string
  height?: string
}

interface CartRoundButtonState {}

class CartRoundButton extends React.Component<CartRoundButtonProps, CartRoundButtonState> {
  itemsCount = (): number => {
    let count = 0
    if (this.props.order.items) {
      this.props.order.items.map((orderItem: OrderItem) => {
        count = count + orderItem.amount
      })
    }
    return count
  }

  render() {
    return (
      <div
        onClick={this.props.onClick}
        id="cartRoundButton"
        className="CartRoundButton  noselect"
        style={{ backgroundColor: this.props.backgroundColor, width: this.props.width, height: this.props.height }}
      >
        <div>
          <div hidden={!this.props.order.items} className="CartRoundButton__itemCount">
            {this.itemsCount()}
          </div>
        </div>

        <div className="CartRoundButton__icon">
          <img src={`/images/icons/${this.props.icon}`} alt="icon" />
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = {}

const mapStateToProps = (state: RootState) => {
  const { order } = state.order
  return {
    order,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CartRoundButton)
