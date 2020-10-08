import React, { Component } from 'react'
import ProductInterface from '../../../../Interfaces/Product'
import OrderPrice from '../../../../SharedComponents/OrderPrice/OrderPrice'
import { RoundNumberInput } from '../../../../SharedComponents/RoundNumberInput/RoundNumberInput'
import { Swiper, SwiperSlide } from 'swiper/react'
import './Product.scss'
import ModifierCard from './ModifierCard/ModifierCard'
import SizeComboBox from './SizeComboBox/SizeComboBox'
import OrderItem from '../../../../Interfaces/OrderItem'
import Modifier from '../../../../Interfaces/Modifier'
import OrderItemModifier from '../../../../Interfaces/OrderItemModifier'
import { connect } from 'react-redux'
import { hideSideDialog, showCartDialog } from '../../../../Redux/actions/app'
import { changeOrderItemAmount, changeOrderItemModifiers } from '../../../../Redux/actions/orderItem'
import { addOrderItemToOrder, changeOrderItem } from '../../../../Redux/actions/order'
import orderItem from '../../../../Redux/reducers/orderItem'

type ProductState = {
  orderItem: OrderItem
  product: ProductInterface
}

type ProductProps = {
  changeOrderItem: (orderItem: OrderItem) => {}
  showCartDialog: () => {}
  addOrderItemToOrder: any
  hideSideDialog: () => {}
  orderItem: OrderItem
  changeOrderItemAmount: () => {}
  changeOrderItemModifiers: any
  isChangeProduct: boolean
}

class Product extends Component<ProductProps, ProductState> {
  constructor(props: any) {
    super(props)
    this.state = {
      product: this.props.orderItem.product,
      orderItem: this.props.orderItem,
    }
  }

  changeModifiers = (productModifier: Modifier, amount: number) => {
    const newModifier: OrderItemModifier = {
      amount,
      productModifier,
    }
    let isNewProductModifier = true
    const orderItem = this.props.orderItem
    orderItem.orderItemModifiers.map((modifier) => {
      if (modifier.productModifier.id === newModifier.productModifier.id) {
        modifier.amount = newModifier.amount
        isNewProductModifier = false
      }
    })
    if (isNewProductModifier) orderItem.orderItemModifiers.push(newModifier)
    const filteredOrderItemModifiers = orderItem.orderItemModifiers.filter((modifier) => {
      return modifier.amount != 0
    })
    orderItem.orderItemModifiers = filteredOrderItemModifiers

    this.props.changeOrderItemModifiers(orderItem.orderItemModifiers)
  }

  addToOrder = () => {
    this.props.addOrderItemToOrder(this.props.orderItem)
    this.props.hideSideDialog()
    this.props.showCartDialog()
  }

  render() {
    return (
      <div className="container-fluid m-0 p-0  product-dialog h-100">
        <div className="product-dialog__image">
          <img className="img-fluid" src={`images/products/${this.props.orderItem.product.image}`}></img>
        </div>
        <div className="wrapper">
          <div
            className="container h-auto pl-sm-5 pr-sm-5 pt-4 pb-2
          "
          >
            <div className="d-flex justify-content-between product-dialog__details">
              <div className="product-dialog__name">{this.props.orderItem.product.name}</div>
              <div className="product-dialog__weight">{this.props.orderItem.product.weight} гр</div>
            </div>
          </div>

          <div className="container h-auto pl-sm-5 pr-sm-0  pt-1 pb-2">
            <div className="product-dialog__modifiers">
              <Swiper slidesPerView={'auto'} spaceBetween={20} style={{ marginTop: 20 }}>
                {this.props.orderItem.product.modifiers.map((modifier, index) => {
                  let amount = 0
                  let mod
                  this.props.orderItem.orderItemModifiers.map((itemModifier) => {
                    if (itemModifier.productModifier.id === modifier.id) {
                      amount = itemModifier.amount
                      mod = itemModifier
                    }
                  })
                  return (
                    <SwiperSlide key={index}>
                      <ModifierCard
                        orderItemProductModifier={mod}
                        amount={amount}
                        changeModifiers={this.changeModifiers}
                        modifier={modifier}
                      />
                    </SwiperSlide>
                  )
                })}
              </Swiper>

              {this.props.orderItem.product.modifiers.map((modifier) => {
                return
              })}
            </div>
          </div>
          {this.props.orderItem.product.variants ? (
            <div className="container h-auto pl-sm-5 pr-sm-2 pt-1 pb-2">
              <div className="product-dialog__sizes">
                <span className="product-dialog__sizes__text">Размер</span>
                <SizeComboBox variants={this.props.orderItem.product.variants} />
              </div>
            </div>
          ) : (
            <div></div>
          )}

          <div className="container h-auto pl-sm-5 pr-sm-5  pt-3 pb-2">
            <div className="product-dialog__amount">
              <span className="product-dialog__amount__text">Количество</span>
              <RoundNumberInput
                changeOrderItemAmount={this.props.changeOrderItemAmount}
                value={this.props.orderItem.amount}
              />
            </div>
          </div>
        </div>

        <OrderPrice isProduct={true} value={this.props.orderItem.value * this.props.orderItem.amount} />

        <div className="container h-100  p-0  m-0">
          <div className="product-dialog__buttons ">
            {this.props.isChangeProduct ? (
              <div
                onClick={() => {
                  this.props.changeOrderItem(this.props.orderItem)
                }}
                className="product-dialog__buttons__add"
              >
                Изменить
              </div>
            ) : (
              <div onClick={() => this.addToOrder()} className="product-dialog__buttons__add">
                Добавить
              </div>
            )}
            <div onClick={this.props.hideSideDialog} className="product-dialog__buttons__cancel">
              Отменить
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = {
  hideSideDialog,
  changeOrderItemAmount,
  changeOrderItemModifiers,
  addOrderItemToOrder,
  showCartDialog,
  changeOrderItem,
}

const mapStateToProps = (state: any) => {
  const { app, orderItem } = state
  return {
    loading: app.loading,
    error: app.error,
    orderItem: orderItem.orderItem,
    isChangeProduct: app.isChangeProduct,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Product)
