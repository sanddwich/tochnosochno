import React from 'react'
import Product from '../../Interfaces/Product'
import ActionButton from '../ActionButton/ActionButton'
import { showProductModal } from '../../Redux/actions/app'
import { addOrderItemToOrder } from '../../Redux/actions/order'

import './LineProductWithCart.scss'
import { connect } from 'react-redux'
import OrderItem from '../../Interfaces/OrderItem'
import AddProductButton from '../AddProductButton/AddProductButton'

interface LineProductWithCartProps {
  product: Product
  showProductModal: (product: Product) => void
  addOrderItemToOrder: (orderItem: OrderItem) => void
}

interface LineProductWithCartState {}

class LineProductWithCart extends React.Component<LineProductWithCartProps, LineProductWithCartState> {
  addToCartButton = (product: Product): void => {
    this.props.addOrderItemToOrder({
      product: product,
      amount: 1,
      orderItemModifiers: [],
      value: product.sizePrices[0].price.currentPrice,
    })
  }

  render() {
    return (
      <div className="lineProductWithCart d-flex justify-content-between ">
        <div className="lineProductWithCart__product">
          <div className="d-flex justify-content-between ">
            <div
              className="lineProductWithCart__product__image d-flex justify-content-center align-items-center"
              onClick={() => this.props.showProductModal(this.props.product)}
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
              className="lineProductWithCart__product__name  d-flex  align-items-center"
              onClick={() => this.props.showProductModal(this.props.product)}
              style={{ cursor: 'pointer' }}
            >
              {this.props.product.name}
            </div>

            <div className="lineProductWithCart__product__price d-flex flex-column justify-content-center align-items-center">
              <div className="lineProductWithCart__product__newPrice col-sm-6 m-0 p-0">
                <span className="bold">{this.props.product.sizePrices[0].price.currentPrice}</span>руб
              </div>
              {/* <div className="lineProductWithCart__product__oldPrice col-sm-6 m-0 p-0"> 300р</div> */}
            </div>
          </div>
        </div>

        <div className="lineProductWithCart__product__cartIcon d-flex justify-content-center align-items-center">
          <AddProductButton hideTextMobile={true} product={this.props.product} />
          {/* <ActionButton
            onClick={() => this.addToCartButton(this.props.product)}
            textColor="white"
            width="180px"
            text="В корзину"
            backgroundColor="#303030"
            icon="cart_dark.svg"
            hideTextMobile={true}
          /> */}
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = {
  showProductModal,
  addOrderItemToOrder,
}

export default connect(null, mapDispatchToProps)(LineProductWithCart)
