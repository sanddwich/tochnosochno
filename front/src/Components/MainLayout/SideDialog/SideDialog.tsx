import React, { Component } from 'react'
import Cart from './Cart/Cart'
import OrderDetails from './OrderDetails/OrderDetails'
import Payment from './Payment/Payment'
import CookingTime from './CookingTime/CookingTime'
import History from './History/History'

import './SideDialog.scss'
import FormType from '../../../Interfaces/FormType'
import OrderItem from '../../../Interfaces/OrderItem'
import Product from './Product/Product'
import { connect } from 'react-redux'
import { hideSideDialog } from '../../../Redux/actions/app'
import CreditCardForm from './Payment/Components/CreditCardForm/CreditCardForm'
import Customer from '../../../Interfaces/Customer'

type SideDialogState = {}

type SideDialogProps = {
  customer: Customer
  error: string
  loading: boolean
  formType: FormType
  showSideDialog: boolean
  orderItem: OrderItem
  hideSideDialog: () => {}
}

class SideDialog extends Component<SideDialogProps, SideDialogState> {
  constructor(props: any) {
    super(props)
    this.state = {}
  }

  showForm = () => {
    switch (this.props.formType) {
      case 'orderDetails':
        if (this.props.customer) {
          return <OrderDetails />
        } else {
          this.props.hideSideDialog()
        }
      case 'payment':
        if (this.props.customer) {
          return <Payment />
        } else {
          this.props.hideSideDialog()
        }

      case 'history':
        if (this.props.customer) {
          return <History />
        } else {
          this.props.hideSideDialog()
        }
      case 'product':
        return <Product />
      case 'cart':
        return <Cart />
      case 'cookingTime':
        if (this.props.customer) {
          return <CookingTime />
        } else {
          this.props.hideSideDialog()
        }
      case 'creditCard':
        if (this.props.customer) {
          return <CreditCardForm />
        } else {
          this.props.hideSideDialog()
        }
    }
  }

  render() {
    return (
      <div hidden={!this.props.showSideDialog} className="slide-dialog__overlay">
        <div className="slide-dialog">
          <React.Fragment>{this.showForm()}</React.Fragment>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = {
  hideSideDialog,
}

const mapStateToProps = (state: any) => {
  const { app, orderItem, auth } = state
  return {
    customer: auth.customer,
    loading: app.loading,
    error: app.error,
    showSideDialog: app.showSideDialog,
    formType: app.formType,
    orderItem: orderItem.orderItem,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideDialog)
