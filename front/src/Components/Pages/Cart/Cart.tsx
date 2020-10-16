import React from 'react'
import { Container } from 'react-bootstrap'
import BlockName from '../../../SharedComponents/BlockName/BlockName'

import './Cart.scss'

interface CartProps {}

interface CartState {}

export default class Cart extends React.Component<CartProps, CartState> {
  render() {
    return (
      <Container fluid className="Cart m-0 p-0 mt-4">
        <BlockName name="Корзина" />
      </Container>
    )
  }
}
