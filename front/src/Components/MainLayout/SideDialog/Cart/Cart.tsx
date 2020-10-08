import React, { Component } from 'react'

import LoginForm from './LoginForm/LoginForm'
import CartProduct from './CartProduct/CartProduct'
import Order from '../../../../Interfaces/Order'
import { BackButton } from '../../../../SharedComponents/BackButton/BackButton'
import OrderPrice from '../../../../SharedComponents/OrderPrice/OrderPrice'
import { NextFormButton } from '../../../../SharedComponents/NextFormButton/NextFormButton'
import { connect } from 'react-redux'
import { hideSideDialog, showCookingTimeDialog } from '../../../../Redux/actions/app'

import './Cart.scss'

interface CartState {}

interface CartProps {
  loading: boolean
  order: Order
  hideSideDialog: () => {}
  isAuth: boolean
  showCookingTimeDialog: () => {}
}

class Cart extends Component<CartProps, CartState> {
  constructor(props: any) {
    super(props)
  }
  render() {
    return (
      <section className="cart">
        <LoginForm />
        <BackButton text="Вернуться назад" onClick={this.props.hideSideDialog} />
        <div className="cart__details">
          <div className="cart__product-list">
            <CartProduct />
          </div>
        </div>
        <div className="cart__bottom">
          <OrderPrice isProduct={false} />
          <NextFormButton
            loading={this.props.loading}
            onClick={this.props.showCookingTimeDialog}
            disabled={!this.props.isAuth || this.props.order.orderItems?.length === 0}
            text="Перейти к деталям"
          />
        </div>
      </section>
    )
  }
}

const mapDispatchToProps = {
  hideSideDialog,
  showCookingTimeDialog,
}

const mapStateToProps = (state: any) => {
  const { order, auth } = state
  return {
    loading: order.loading,
    order: order.order,
    isAuth: auth.isAuth,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cart)
