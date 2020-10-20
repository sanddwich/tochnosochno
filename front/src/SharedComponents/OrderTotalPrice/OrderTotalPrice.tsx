import React from 'react'
import { Container } from 'react-bootstrap'

import './OrderTotalPrice.scss'

interface OrderTotalPriceProps {}

interface OrderTotalPriceState {}

export default class OrderTotalPrice extends React.Component<OrderTotalPriceProps, OrderTotalPriceState> {
  constructor(props: OrderTotalPriceProps) {
    super(props)
  }

  render() {
    return (
      <div className="OrderTotalPrice">
        <div className="OrderTotalPrice__label">Общая сумма</div>
        <div className="OrderTotalPrice__amount">2941 р</div>
      </div>
    )
  }
}
