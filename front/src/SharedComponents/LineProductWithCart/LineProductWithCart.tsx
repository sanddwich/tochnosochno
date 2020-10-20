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
      <div className="lineProductWithCart d-flex justify-content-between ">
        <div className="lineProductWithCart__product">
          <div className="d-flex justify-content-between ">
            <div className="lineProductWithCart__product__image  ">
              <img src={`${this.props.product.imageLinks[0]}`} alt="" />
            </div>

            <div className="lineProductWithCart__product__name ">{this.props.product.name}</div>

            <div className="lineProductWithCart__product__price">
              <div className="lineProductWithCart__product__newPrice col-sm-6 m-0 p-0">
                <span className="bold">980</span>руб
              </div>
              <div className="lineProductWithCart__product__oldPrice col-sm-6 m-0 p-0"> 1170р</div>
            </div>
          </div>
        </div>

        <ActionButton
          onClick={() => console.log('add to cart')}
          textColor="white"
          width="180px"
          text="В корзину"
          backgroundColor="#303030"
          icon="cart_dark.svg"
          hideTextMobile={true}
        />
      </div>
    )
  }
}
