import React from 'react'
import { Container } from 'react-bootstrap'
import ActionButton from '../../../SharedComponents/ActionButton/ActionButton'
import BlockName from '../../../SharedComponents/BlockName/BlockName'
import CartOrder from '../../../SharedComponents/CartOrder/CartOrder'
import RecomendedProducts from '../../../SharedComponents/RecomendedProducts/RecomendedProducts'

import './Cart.scss'
import DeliveryByClient from './Components/DeliveryByClient/DeliveryByClient'
import DeliveryByCourier from './Components/DeliveryByCourier/DeliveryByCourier'

interface CartProps {}

interface CartState {
  isDelivery: boolean
}

export default class Cart extends React.Component<CartProps, CartState> {
  constructor(props: CartProps) {
    super(props)

    this.state = {
      isDelivery: true,
    }
  }

  setDeliveryByCourier = () => {
    this.setState({
      isDelivery: true,
    })
  }

  setDeliveryByClient = () => {
    this.setState({
      isDelivery: false,
    })
  }

  render() {
    return (
      <Container className="Cart  mt-5">
        <CartOrder />
        <RecomendedProducts />

        <div className="Cart__delivery">
          <div className="Cart__delivery__select">
            <div className="Cart__delivery__select__label mb-4 mb-sm-3 mb-md-3 mb-lg-0">Продолжить оформление</div>
            <div className="Cart__delivery__select__buttons">
              <ActionButton
                active={!this.state.isDelivery}
                onClick={this.setDeliveryByCourier}
                textColor="white"
                width="160px"
                text="Доставка"
                backgroundColor="#303030"
                icon="car_dark.svg"
                hideTextMobile={false}
              />

              <ActionButton
                active={this.state.isDelivery}
                onClick={this.setDeliveryByClient}
                textColor="white"
                width="160px"
                text="Самовывоз"
                backgroundColor="#303030"
                icon="shop_dark.svg"
                hideTextMobile={false}
              />
            </div>
          </div>

          {this.state.isDelivery ? <DeliveryByCourier /> : <DeliveryByClient />}
        </div>
      </Container>
    )
  }
}
