import React from 'react'

import './PaymentSection.scss'
import 'react-datepicker/dist/react-datepicker.css'
import CheckBox from '../CheckBox/CheckBox'
import RadioButton from '../RadioButton/RadioButton'

interface PaymentSectionProps {}

interface PaymentSectionState {
  paymentType: string
}

export default class PaymentSection extends React.Component<PaymentSectionProps, PaymentSectionState> {
  constructor(props: PaymentSectionProps) {
    super(props)
  }

  render() {
    return (
      <div className="PaymentSection">
        <RadioButton
          selected={false}
          label="Оплатить онлайн"
          name="payment"
          id="onlineRadio"
          onClick={() => console.log('onlineRadio')}
        />
        <RadioButton
          selected={true}
          label="Картой курьеру"
          name="payment"
          id="creditRadio"
          onClick={() => console.log('creditRadio')}
        />
        <RadioButton
          selected={false}
          label="Наличными курьеру"
          name="payment"
          id="cashRadio"
          onClick={() => console.log('cashRadio')}
        />
      </div>
    )
  }
}
