import React, { Component } from 'react'
import Bonus from '../Bonus/Bonus'
import NewOrderDetails from '../NewOrderDetails/NewOrderDetails'

type OnlinePaymentState = {}

type OnlinePaymentProps = {
  bonus: number
}
export class OnlinePayment extends Component<OnlinePaymentProps, OnlinePaymentState> {
  constructor(props: OnlinePaymentProps) {
    super(props)
  }

  render() {
    return (
      <div>
        <Bonus showCheck={true} value={this.props.bonus} />
        <NewOrderDetails />
      </div>
    )
  }
}
