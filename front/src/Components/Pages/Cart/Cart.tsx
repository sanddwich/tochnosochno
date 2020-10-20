import React from 'react'
import { Container } from 'react-bootstrap'
import BlockName from '../../../SharedComponents/BlockName/BlockName'
import CartOrder from '../../../SharedComponents/CartOrder/CartOrder'
import RecomendedProducts from '../../../SharedComponents/RecomendedProducts/RecomendedProducts'

import './Cart.scss'

interface CartProps {}

interface CartState {
  isDelivery: boolean
}

export default class Cart extends React.Component<CartProps, CartState> {
  constructor(props: CartProps) {
    super(props)

    this.state = {
      isDelivery: false,
    }
  }

  render() {
    return (
      <Container className="Cart  mt-5">
        <CartOrder />
        <RecomendedProducts />
      </Container>
    )
  }
}
