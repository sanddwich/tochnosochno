import React, { Component } from 'react'
import { BackButton } from '../../../../SharedComponents/BackButton/BackButton'
import LoginForm from '../Cart/LoginForm/LoginForm'
import { hideSideDialog, showCookingTimeDialog, showCreditCardForm } from '../../../../Redux/actions/app'
import { setOrderPayment, processOrder, applyBonusOrder } from '../../../../Redux/actions/order'
import { connect } from 'react-redux'
import CircleSideButton from '../../../../SharedComponents/CircleSideButton/CircleSideButton'

import './Payment.scss'
import PaymentFormType from '../../../../Interfaces/PaymentFormType'
import { OnlinePayment } from './Components/OnlinePayment/OnlinePayment'
import { CashPayment } from './Components/CashPayment/CashPayment'
import OrderPrice from '../../../../SharedComponents/OrderPrice/OrderPrice'
import { NextFormButton } from '../../../../SharedComponents/NextFormButton/NextFormButton'
import Order from '../../../../Interfaces/Order'
import PaymentType from '../../../../Interfaces/PaymentType'
import Customer from '../../../../Interfaces/Customer'

type PaymentState = {
  form: PaymentFormType
}

type PaymentProps = {
  customer: Customer
  loading: boolean
  order: Order
  processOrder: any
  applyBonusOrder: any
  showCreditCardForm: () => {}
  hideSideDialog: () => {}
  showCookingTimeDialog: () => {}
  setOrderPayment: (isPayment: boolean, payment: PaymentType) => {}
}
class Payment extends Component<PaymentProps, PaymentState> {
  constructor(props: PaymentProps) {
    super(props)
    this.state = {
      form: 'online',
    }
  }
  shouldComponentUpdate(nextProps: PaymentProps) {
    if (nextProps.order.items?.length === 0) {
      this.props.hideSideDialog()
    }
    return true
  }

  clickPaymentButton = () => {
    this.setState({ form: 'online' })
    this.props.setOrderPayment(false, 'online')
  }
  clickCashButton = () => {
    this.setState({ form: 'cash' })
    this.props.applyBonusOrder(true)
  }

  clickProcessPayment = () => {}

  render() {
    return (
      <section className="payment">
        <LoginForm />
        <BackButton text={'Вернуться'} onClick={this.props.showCookingTimeDialog} />
        <div className="container-fluid mt-3 ">
          <div className="container">
            <div className="payment__buttons">
              <div className="payment__online">
                <CircleSideButton
                  color={this.state.form === 'cash' ? '#767676' : '#5EAD03'}
                  text="Онлайн"
                  rightCircle={false}
                  buttonName="online"
                  buttonGroup="payment"
                  clickButtonHandler={this.clickPaymentButton}
                  clicked={false}
                />
              </div>
              <div className="payment__cash">
                <CircleSideButton
                  color={this.state.form === 'online' ? '#767676' : '#5EAD03'}
                  text="Наличными"
                  rightCircle={true}
                  buttonName="cash"
                  buttonGroup="payment"
                  clickButtonHandler={this.clickCashButton}
                  clicked={false}
                />
              </div>
            </div>

            {this.state.form === 'online' ? (
              <OnlinePayment bonus={this.props.customer.bonus} />
            ) : (
              <CashPayment payment={this.props.order.payment} setOrderPayment={this.props.setOrderPayment} />
            )}
          </div>
        </div>
        <div className="payment__bottom">
          <OrderPrice isProduct={false} />
          <NextFormButton
            loading={this.props.loading}
            // onClick={this.state.form === 'online' ? this.props.showCreditCardForm : this.props.processOrder}
            onClick={this.props.processOrder}
            disabled={
              this.state.form === 'cash' && (this.props.order.payment === 'online' || !this.props.order.payment)
            }
            text={this.state.form === 'online' ? 'Оплатить заказ' : 'Завершить заказ'}
          />
        </div>
      </section>
    )
  }
}

const mapDispatchToProps = {
  hideSideDialog,
  showCookingTimeDialog,
  setOrderPayment,
  processOrder,
  applyBonusOrder,
  showCreditCardForm,
}

const mapStateToProps = (state: any) => {
  const { order, auth } = state
  return {
    loading: order.loading,
    order: order.order,
    customer: auth.customer,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Payment)
