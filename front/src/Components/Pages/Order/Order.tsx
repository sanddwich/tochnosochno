import React from 'react'
import { Container } from 'react-bootstrap'

import './Order.scss'

interface OrderProps {}

interface OrderState {}

export default class Order extends React.Component<OrderProps, OrderState> {
  render() {
    return (
      <Container className="Order">
        <h1>Order</h1>
      </Container>
    )
  }
}
