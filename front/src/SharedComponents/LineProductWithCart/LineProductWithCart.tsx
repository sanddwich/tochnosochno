import React from 'react'
import Product from '../../Interfaces/Product'
import ActionButton from '../ActionButton/ActionButton'

import './LineProductWithCart.scss'

interface LineProductWithCartProps {
  product: Product
}

interface LineProductWithCartState {}

export default class LineProductWithCart extends React.Component<LineProductWithCartProps, LineProductWithCartState> {
  render() {
    return (
      <div className="lineProductWithCart">
        <div className="lineProductWithCart__product">
          <div className="lineProductWithCart__product__image">
            <img src={`${this.props.product.image}`} alt="" />
          </div>

          <div className="lineProductWithCart__product__image">{this.props.product.name}</div>
        </div>

        <ActionButton
          onClick={() => console.log('add to cart')}
          textColor="white"
          width="180px"
          text="В корзину"
          backgroundColor="#303030"
          icon="cart_dark.svg"
        />
      </div>
    )
  }
}
