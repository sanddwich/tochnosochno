import React from 'react'
import { Container } from 'react-bootstrap'

import './Cart.scss'

interface CartProps {}

interface CartState {}

export default class Cart extends React.Component<CartProps, CartState> {
  render() {
    return (
      <Container className="Cart">
        <h1>Cart</h1>
      </Container>
    )
  }
}
