import React from 'react'
import { connect } from 'react-redux'
import Order from '../../Interfaces/Order'
import { RootState } from '../../Redux'

import './OrderTotalPrice.scss'

interface OrderTotalPriceProps {
  order: Order
  isDelivery: boolean
  delivery?: number
}

interface OrderTotalPriceState {}

class OrderTotalPrice extends React.Component<OrderTotalPriceProps, OrderTotalPriceState> {
  constructor(props: OrderTotalPriceProps) {
    super(props)
  }

  render() {
    return (
      <div className="OrderTotalPrice">
        <div className="OrderTotalPrice__row">
          <div className="OrderTotalPrice__label">Сумма заказа</div>
          <div className="OrderTotalPrice__amount">{this.props.order.amount} р</div>
        </div>
        {this.props.isDelivery ? (
          <React.Fragment>
            <div className="OrderTotalPrice__row">
              <div className="OrderTotalPrice__label">Доставка</div>
              <div className="OrderTotalPrice__amount">{this.props.delivery || 0} р</div>
            </div>
            <div className="OrderTotalPrice__total">
              <div className="OrderTotalPrice__label">Итого</div>
              <div className="OrderTotalPrice__amount">{this.props.order.amount + (this.props.delivery || 0)} р</div>
            </div>
          </React.Fragment>
        ) : null}
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

export default connect(mapStateToProps, mapDispatchToProps)(OrderTotalPrice)
