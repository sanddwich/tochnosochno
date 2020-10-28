import React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import Category from '../../Interfaces/Category'
import Order from '../../Interfaces/Order'
import OrderItem from '../../Interfaces/OrderItem'
import Product from '../../Interfaces/Product'
import { RootState } from '../../Redux'
import order from '../../Redux/reducers/order'
import ActionButton from '../ActionButton/ActionButton'
import BlockName from '../BlockName/BlockName'
import LineProductWithNumberInput from '../LineProductWithNumberInput/LineProductWithNumberInput'
import NumberInput from '../NumberInput/NumberInput'
import OrderTotalPrice from '../OrderTotalPrice/OrderTotalPrice'
import { setGuestCount } from '../../Redux/actions/order'

import './CartOrder.scss'

interface CartOrderProps {
  order: Order
  setGuestCount: (count: number) => void
}

interface CartOrderState {
  cartProducts: OrderItem[]
  cartCombos: OrderItem[]
}

class CartOrder extends React.Component<CartOrderProps, CartOrderState> {
  constructor(props: CartOrderProps) {
    super(props)
    this.state = {
      cartProducts: this.setStateCartProducts() || [],
      cartCombos: this.setStateCartCombos() || [],
    }
  }

  setStateCartProducts = (): OrderItem[] => {
    let cartProducts: any = this.props.order.items?.filter(item => {
      if (typeof item.comboId === 'undefined') {
        return item
      }
    })
    return cartProducts
  }

  setStateCartCombos = (): OrderItem[] => {
    let cartCombo: any = this.props.order.items?.filter(item => {
      if (typeof item.comboId !== 'undefined') {
        return item.product
      }
    })
    return cartCombo
  }

  componentDidMount() {}

  render() {
    console.log(this.state.cartProducts)
    console.log(this.state.cartCombos)
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
                    return <LineProductWithNumberInput key={orderItem.id} orderItem={orderItem} />
                  })}
                </div>

                <div className="CartOrder__guests">
                  <NumberInput
                    minValue={1}
                    value={this.props.order.guests.count}
                    onChange={(count: number) => this.props.setGuestCount(count)}
                    label="Количество персон"
                    hideLabel={false}
                  />
                </div>

                <OrderTotalPrice />
              </React.Fragment>
            ) : (
              <div className="CartOrder__empty">
                <div className="CartOrder__empty__text">
                  Сейчас тут ничего нет :( И мы ждем вашего заказа :) Для этого перейдите в меню и добавьте сочную еду в
                  корзину.
                </div>
                <NavLink to="/">
                  <ActionButton
                    onClick={() => null}
                    textColor="white"
                    width="260px"
                    text="Перейти в меню"
                    backgroundColor="#303030"
                    icon="dish-dark.svg"
                    hideTextMobile={false}
                  />
                </NavLink>
              </div>
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

const mapDispatchToProps = {
  setGuestCount,
}

const mapStateToProps = (state: RootState) => {
  const { order } = state.order
  return {
    order,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CartOrder)
