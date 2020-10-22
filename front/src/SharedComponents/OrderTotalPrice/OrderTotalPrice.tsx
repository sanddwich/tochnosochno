import React from 'react'
import { connect } from 'react-redux'
import Order from '../../Interfaces/Order'
import { RootState } from '../../Redux'

import './OrderTotalPrice.scss'

interface OrderTotalPriceProps {
  order: Order
}

interface OrderTotalPriceState {}

class OrderTotalPrice extends React.Component<OrderTotalPriceProps, OrderTotalPriceState> {
  constructor(props: OrderTotalPriceProps) {
    super(props)
  }

  render() {
    return (
      <div className="OrderTotalPrice">
        <div className="OrderTotalPrice__label">Общая сумма</div>
        <div className="OrderTotalPrice__amount">{this.props.order.amount} р</div>
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
