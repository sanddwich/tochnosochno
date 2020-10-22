import React from 'react'
import { connect } from 'react-redux'
import Category from '../../Interfaces/Category'
import Order from '../../Interfaces/Order'
import OrderItem from '../../Interfaces/OrderItem'
import Product from '../../Interfaces/Product'
import { RootState } from '../../Redux'
import order from '../../Redux/reducers/order'
import BlockName from '../BlockName/BlockName'
import LineProductWithNumberInput from '../LineProductWithNumberInput/LineProductWithNumberInput'
import NumberInput from '../NumberInput/NumberInput'
import OrderTotalPrice from '../OrderTotalPrice/OrderTotalPrice'

import './CartOrder.scss'

interface CartOrderProps {
  order: Order
}

interface CartOrderState {}

class CartOrder extends React.Component<CartOrderProps, CartOrderState> {
  constructor(props: CartOrderProps) {
    super(props)
    this.state = {
      cartProducts: [],
    }
  }

  render() {
    return (
      <div className="CartOrder">
        <div className="CartOrder__banner-mob">
          <img className="img-fluid" src="/images/banners/full_banner.jpg" alt="" />
        </div>
        <div className="CartOrder__left">
          <BlockName name="Ваш заказ" />
          <React.Fragment>
            {this.props.order.items && this.props.order.items.length > 0 ? (
              <React.Fragment>
                <div className="CartOrder__products">
                  {this.props.order.items.map((orderItem: OrderItem) => {
                    return <LineProductWithNumberInput key={orderItem.id} product={orderItem.product} />
                  })}
                </div>
                <div className="CartOrder__guests">
                  <NumberInput label="Количество персон" hideLabel={false} />
                </div>

                <OrderTotalPrice />
              </React.Fragment>
            ) : (
              <div>Корзина пуста</div>
            )}
          </React.Fragment>
        </div>

        <div className="CartOrder__banner">
          <img className="img-fluid" src="/images/banners/cart-banner.png" alt="" />
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(CartOrder)
