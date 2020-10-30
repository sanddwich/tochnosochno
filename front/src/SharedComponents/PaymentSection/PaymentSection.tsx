import React from 'react'

import './PaymentSection.scss'
import 'react-datepicker/dist/react-datepicker.css'
import CheckBox from '../CheckBox/CheckBox'
import RadioButton from '../RadioButton/RadioButton'
import PaymentType from '../../Interfaces/PaymentType'
import { connect } from 'react-redux'
import { setOrderPayment } from '../../Redux/actions/order'
import Order from '../../Interfaces/Order'

interface PaymentSectionProps {
  isDelivery: boolean
  setOrderPayment: (isPayment: boolean, payment: PaymentType) => {}
  order: Order
}

interface PaymentSectionState {
  paymentType: string
}

class PaymentSection extends React.Component<PaymentSectionProps, PaymentSectionState> {
  constructor(props: PaymentSectionProps) {
    super(props)
  }

  setPayment = (isPayment: boolean, paymentType: PaymentType) => {
    this.props.setOrderPayment(isPayment, paymentType)
  }

  render() {
    return (
      <React.Fragment>
        {this.props.isDelivery ? (
          <div className="PaymentSection">
            {/* <RadioButton
              selected={this.props.order.payment === 'online'}
              label="Оплатить онлайн"
              name="payment"
              id="onlineRadio"
              onClick={() => this.setPayment(false, 'online')}
            /> */}

            <RadioButton
              selected={this.props.order.payment === 'credit'}
              label="Картой курьеру"
              name="payment"
              id="creditRadio"
              onClick={() => this.setPayment(false, 'credit')}
            />
            <RadioButton
              selected={this.props.order.payment === 'cash'}
              label="Наличными курьеру"
              name="payment"
              id="cashRadio"
              onClick={() => this.setPayment(false, 'cash')}
            />
          </div>
        ) : (
          <div className="PaymentSection">
            {/* <RadioButton
              selected={this.props.order.payment === 'online'}
              label="Оплатить онлайн"
              name="payment"
              id="onlineRadio"
              onClick={() => this.setPayment(false, 'online')}
            /> */}

            <RadioButton
              selected={this.props.order.payment === 'cash'}
              label="Оплатить при получении"
              name="payment"
              id="cashRadio"
              onClick={() => this.setPayment(false, 'cash')}
            />
          </div>
        )}
      </React.Fragment>
    )
  }
}

const mapDispatchToProps = {
  setOrderPayment,
}

const mapStateToProps = (state: any) => {
  const { order } = state.order
  return {
    order,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentSection)
