import React from 'react'
import { Container } from 'react-bootstrap'

import './Cart.scss'

interface CartProps {}

interface CartState {}

export default class Cart extends React.Component<CartProps, CartState> {
  render() {
    return (
      <Container className="Cart m-0 p-0 mt-4">
        <h1>Cart</h1>
      </Container>
    )
  }
}
