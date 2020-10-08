import React, { Component } from 'react'
import ListItem from '../../../../../../Interfaces/ListItem'
import PaymentType from '../../../../../../Interfaces/PaymentType'
import ListItemEl from '../../../CookingTime/ListItemEl/ListItemEl'
import NewOrderDetails from '../NewOrderDetails/NewOrderDetails'

type CashPaymentState = {
  listItemCash: ListItem
  listItemCredit: ListItem
}

type CashPaymentProps = {
  payment: PaymentType
  setOrderPayment: (isPayment: boolean, payment: PaymentType) => {}
}
export class CashPayment extends Component<CashPaymentProps, CashPaymentState> {
  constructor(props: CashPaymentProps) {
    super(props)
    this.state = {
      listItemCredit: {
        title: 'Картой курьеру',
        clicked: this.props.payment === 'credit',
      },
      listItemCash: {
        title: 'Наличными',
        clicked: this.props.payment === 'cash',
      },
    }
  }

  clickCashHandler = () => {
    this.setState({
      listItemCredit: {
        title: 'Картой курьеру',
        clicked: false,
      },
      listItemCash: {
        title: 'Наличными',
        clicked: true,
      },
    })
    this.props.setOrderPayment(false, 'cash')
  }
  clickCreditHandler = () => {
    this.setState({
      listItemCredit: {
        title: 'Картой курьеру',
        clicked: true,
      },
      listItemCash: {
        title: 'Наличными',
        clicked: false,
      },
    })
    this.props.setOrderPayment(false, 'credit')
  }

  render() {
    return (
      <div className="mt-4">
        <div className="pt-3">
          <ListItemEl
            listItem={this.state.listItemCash}
            key={this.state.listItemCash.title}
            clickCheckBoxHandler={this.clickCashHandler}
          />
        </div>
        <div className="pt-3">
          <ListItemEl
            listItem={this.state.listItemCredit}
            key={this.state.listItemCredit.title}
            clickCheckBoxHandler={this.clickCreditHandler}
          />
        </div>

        <NewOrderDetails />
      </div>
    )
  }
}
