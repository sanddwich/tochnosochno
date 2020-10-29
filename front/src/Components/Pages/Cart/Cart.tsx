import React from 'react'
import { Container } from 'react-bootstrap'
import { connect } from 'react-redux'
import Order from '../../../Interfaces/Order'
import { RootState } from '../../../Redux'
import ActionButton from '../../../SharedComponents/ActionButton/ActionButton'
import BlockName from '../../../SharedComponents/BlockName/BlockName'
import CartOrder from '../../../SharedComponents/CartOrder/CartOrder'
import RecomendedProducts from '../../../SharedComponents/RecomendedProducts/RecomendedProducts'
import { setDelivery } from '../../../Redux/actions/order'
import './Cart.scss'
import DeliveryByClient from './Components/DeliveryByClient/DeliveryByClient'
import DeliveryByCourier from './Components/DeliveryByCourier/DeliveryByCourier'
import Address from '../../../Interfaces/Address'

interface CartProps {
  order: Order
  setDelivery: (isDelivery: boolean, address: Address) => void
}

interface CartState {
  isDelivery: boolean
}

class Cart extends React.Component<CartProps, CartState> {
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
    this.props.setDelivery(false, { street: { name: '' }, house: '' })
  }

  render() {
    return (
      <Container className="Cart  mt-5">
        <CartOrder />
        {this.props.order.items && this.props.order.items.length > 0 ? (
          <React.Fragment>
            <RecomendedProducts product={this.props.order.items[0].product} />
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
              {/* 
          <div style={{ display: this.state.isDelivery ? 'block' : 'none' }}>
            <DeliveryByCourier />
          </div>

          <div style={{ display: this.state.isDelivery ? 'none' : 'block' }}>
            <DeliveryByClient />
          </div> */}

              {this.state.isDelivery ? <DeliveryByCourier /> : <DeliveryByClient />}
            </div>{' '}
          </React.Fragment>
        ) : null}
      </Container>
    )
  }
}

const mapDispatchToProps = {
  setDelivery,
}

const mapStateToProps = (state: RootState) => {
  const { order } = state.order
  return {
    order,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cart)
