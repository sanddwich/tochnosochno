import React, { Component } from 'react'
import { connect } from 'react-redux'
import Order from '../../Interfaces/Order'
import OrderItem from '../../Interfaces/OrderItem'
import './OrderPrice.scss'

interface OrderPriceState {}
interface OrderPriceProps {
  isProduct: boolean
  value?: number
  order: Order
  orderItem: OrderItem
}

class OrderPrice extends Component<OrderPriceProps, OrderPriceState> {
  componentWillMount() {}

  componentDidMount() {}

  render() {
    return (
      <div className="order-price">
        <div className="container p-4">
          <div className="d-flex justify-content-between">
            <div className="order-price__title">Итого</div>

            <div className="order-price__value">
              <div hidden={this.props.isProduct} className="order-price__bonus">
                {this.props.order.bonus ? this.props.order.amount + this.props.order.bonus : null}
              </div>
              {this.props.value || this.props.order.amount}

              <div className="order-price__currency">руб</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = {}

const mapStateToProps = (state: any) => {
  const { order, orderItem } = state
  return {
    order: order.order,
    orderItem: orderItem.orderItem,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderPrice)
