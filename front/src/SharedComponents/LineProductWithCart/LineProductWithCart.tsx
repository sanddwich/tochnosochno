import React from 'react'
import Product from '../../Interfaces/Product'
import ActionButton from '../ActionButton/ActionButton'
import { showProductModal } from '../../Redux/actions/app'

import './LineProductWithCart.scss'
import { connect } from 'react-redux'

interface LineProductWithCartProps {
  product: Product
  showProductModal: (product: Product) => void
}

interface LineProductWithCartState {}

class LineProductWithCart extends React.Component<LineProductWithCartProps, LineProductWithCartState> {
  render() {
    return (
      <div className="lineProductWithCart d-flex justify-content-between ">
        <div className="lineProductWithCart__product">
          <div className="d-flex justify-content-between ">
            <div
              className="lineProductWithCart__product__image"
              onClick={() => this.props.showProductModal(this.props.product)}
              style={{ cursor: 'pointer' }}
            >
              <img
                src={
                  typeof this.props.product.imageLinks[0] !== 'undefined'
                    ? `${this.props.product.imageLinks[0]}`
                    : '/images/products/no-photo.png'
                }
              />
            </div>

            <div
              className="lineProductWithCart__product__name"
              onClick={() => this.props.showProductModal(this.props.product)}
              style={{ cursor: 'pointer' }}
            >
              {this.props.product.name}
            </div>

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

const mapDispatchToProps = {
  showProductModal,
}

export default connect(null, mapDispatchToProps)(LineProductWithCart)
