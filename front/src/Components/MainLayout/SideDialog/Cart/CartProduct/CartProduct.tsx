import React, { Component } from 'react'
import { RoundIconButton } from '../../../../../SharedComponents/RoundIconButton/RoundIconButton'
import { RoundNumberInput } from '../../../../../SharedComponents/RoundNumberInput/RoundNumberInput'

import './CartProduct.scss'
import OrderItem from '../../../../../Interfaces/OrderItem'
import { connect } from 'react-redux'
import { deleteOrderItem, setOrderItemAmount } from '../../../../../Redux/actions/order'
import { showProductDialog } from '../../../../../Redux/actions/app'
import { setOrderItem } from '../../../../../Redux/actions/orderItem'

interface CartProductState {}

interface CartProductProps {
  showProductDialog: (isChangeProduct: boolean) => {}
  orderItems: OrderItem[]
  deleteOrderItem: (orderItem: OrderItem) => {}
  setOrderItem: (orderItem: OrderItem) => {}
  setOrderItemAmount: (orderItem: OrderItem, amount: number) => {}
}

class CartProduct extends Component<CartProductProps, CartProductState> {
  showChangeProductDialog = (orderItem: OrderItem) => {
    this.props.setOrderItem(orderItem)
    this.props.showProductDialog(true)
  }

  render() {
    return (
      <React.Fragment>
        {this.props.orderItems.map((orderItem, index) => {
          let totalModifierPrice = 0
          if (orderItem.orderItemModifiers) {
            orderItem.orderItemModifiers.map((orderItemModifier) => {
              totalModifierPrice =
                totalModifierPrice + orderItemModifier.amount * orderItemModifier.productModifier.modifier.price
            })
          }
          const productNameWords = orderItem.product.name.split(' ')
          const productNameFirst = productNameWords[0]
          productNameWords.shift()
          const productNameLast = productNameWords.join(' ')

          return (
            <div key={index} className="cart-product">
              <div className="cart-product__name">
                <h3>
                  <span className="lined-text text-white">{productNameFirst}</span>
                  <div className="product-name">
                    <span className="lined-text text-white"> {productNameLast}</span>
                  </div>
                </h3>
                <div className="cart-product__icons">
                  <RoundIconButton
                    onClick={() => this.showChangeProductDialog(orderItem)}
                    imageSrc="images/edit.svg"
                    altText="Edit"
                  />

                  <RoundIconButton
                    onClick={() => this.props.deleteOrderItem(orderItem)}
                    imageSrc="images/trash.svg"
                    altText="Trash"
                  />
                </div>
              </div>
              <div className="cart-product__modifiers">
                {orderItem.orderItemModifiers.map((modifier, index) => {
                  if (modifier.amount > 0) {
                    return (
                      <div key={index} className="cart-product__modifiers__item">
                        {modifier.amount} {modifier.productModifier.modifier.name}
                      </div>
                    )
                  }
                })}
              </div>

              <div className="cart-product__value">
                <RoundNumberInput
                  changeOrderItemAmount={(value: number) => {
                    this.props.setOrderItemAmount(orderItem, value)
                  }}
                  value={orderItem.amount}
                />

                <div className="cart-product__sum">
                  {(orderItem.productVariant.price + totalModifierPrice) * orderItem.amount}
                </div>
                <div className="cart-product__currency">руб</div>
              </div>
            </div>
          )
        })}
      </React.Fragment>
    )
  }
}

const mapDispatchToProps = {
  deleteOrderItem,
  setOrderItemAmount,
  showProductDialog,
  setOrderItem,
}

const mapStateToProps = (state: any) => {
  const { order } = state
  return {
    orderItems: order.order.items,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CartProduct)
