import React, { Component } from 'react'
import { connect } from 'react-redux'
import { BackButton } from '../../../../../../SharedComponents/BackButton/BackButton'
import { showPayment } from '../../../../../../Redux/actions/app'
import LoginForm from '../../../Cart/LoginForm/LoginForm'
import Cards from 'react-credit-cards'
import 'react-credit-cards/es/styles-compiled.css'
import './CreditCardForm.scss'
import Payment from 'payment'
import { RootState } from '../../../../../../Redux'
import Order from '../../../../../../Interfaces/Order'
import { OrderState } from '../../../../../../Redux/interfaces/interfaces'

type CreditCardFormState = {
  cvc: string
  expiry: string
  expiryCheck: string
  focus: 'number' | 'cvc' | 'expiry' | 'name' | undefined
  name: string
  number: string
  isValidNumber: boolean
  isValidExpiry: boolean
  isValidForm: boolean
  isNumberTouched: boolean
  isExpiryTouched: boolean
}

type CreditCardFormProps = {
  showPayment: () => {}
  order: Order
}
class CreditCardForm extends Component<CreditCardFormProps, CreditCardFormState> {
  constructor(props: any) {
    super(props)
    this.state = {
      cvc: '',
      expiry: '',
      expiryCheck: '',
      focus: 'name',
      name: '',
      number: '',
      isValidExpiry: false,
      isValidNumber: false,
      isValidForm: false,
      isNumberTouched: false,
      isExpiryTouched: false,
    }
  }
  componentDidMount = () => {
    const cardNumber: HTMLInputElement | null = document.querySelector('[name="number"]')
    const expiry: HTMLInputElement | null = document.querySelector('[name="expiry"]')
    const cvc: HTMLInputElement | null = document.querySelector('[name="cvc"]')
    if (cardNumber) {
      Payment.formatCardNumber(cardNumber)
    }
    if (expiry) {
      Payment.formatCardExpiry(expiry)
    }
    if (cvc) {
      Payment.formatCardCVC(cvc)
    }
  }

  handleInputFocus = (e: any) => {
    this.setState({ focus: e.target.name })
  }

  handleNumberChange = (e: any) => {
    const { value } = e.target
    this.setState({ number: value, isNumberTouched: true }, () => {
      this.validateNumber(value)
    })

    // this.validateForm()
  }

  handleNameChange = (e: any) => {
    const { value } = e.target
    this.setState({ name: value }, () => {
      this.validateForm()
    })
  }

  handleExpiryChange = (e: any) => {
    const { value } = e.target
    this.setState({ expiry: value.replace(' / ', ''), expiryCheck: value, isExpiryTouched: true }, () => {
      this.validateExpiry()
    })
  }

  handleCvcChange = (e: any) => {
    const { value } = e.target
    this.setState({ cvc: value }, () => {
      this.validateForm()
    })
  }

  validateNumber = (value?: string) => {
    const val = value ? value : this.state.number

    this.setState(
      {
        isValidNumber: Payment.fns.validateCardNumber(val),
      },
      () => this.validateForm()
    )
  }

  validateExpiry = () => {
    this.setState(
      {
        isValidExpiry: Payment.fns.validateCardExpiry(this.state.expiryCheck),
      },
      () => this.validateForm()
    )
  }

  validateForm = () => {
    if (
      this.state.cvc &&
      this.state.expiry &&
      this.state.number &&
      this.state.name &&
      this.state.isValidNumber &&
      this.state.isValidExpiry
    ) {
      console.log(111)
      this.setState({ isValidForm: true })
    } else {
      this.setState({ isValidForm: false })
    }
  }

  render() {
    return (
      <div className="container p-0 m-0 h-100">
        <LoginForm />
        <BackButton text="Вернуться" onClick={this.props.showPayment}></BackButton>

        <div id="PaymentForm" className="payment-form">
          <div className="payment-form__amount ">
            К оплате: <span className="payment-form__amount__value">{this.props.order.amount}</span>
            <span className="payment-form__amount__currency">руб</span>
          </div>
          <div className="payment-form__card ">
            <Cards
              cvc={this.state.cvc}
              callback={() => this.validateForm}
              expiry={this.state.expiry}
              focused={this.state.focus}
              name={this.state.name}
              number={this.state.number}
              locale={{ valid: 'Срок действия' }}
              placeholders={{ name: 'Введите имя' }}
            />
          </div>
          <div>
            <form autoComplete="on" className="payment-form__form">
              <input
                className={`${!this.state.isValidNumber && this.state.isNumberTouched ? 'error' : null}`}
                type="tel"
                name="number"
                pattern="\d*"
                placeholder="Номер карты"
                onChange={this.handleNumberChange}
                onFocus={this.handleInputFocus}
              />
              {/* <small className="validation__error">22</small> */}
              <input
                type="text"
                name="name"
                placeholder="Введите имя"
                onChange={this.handleNameChange}
                onFocus={this.handleInputFocus}
              />
              <div className="row">
                <div className="col-6">
                  <input
                    type="text"
                    className={`${!this.state.isValidExpiry && this.state.isExpiryTouched ? 'error' : null}`}
                    name="expiry"
                    placeholder="06/22"
                    pattern="\d*"
                    onBlur={this.validateExpiry}
                    onKeyPress={this.handleExpiryChange}
                    onChange={this.handleExpiryChange}
                    onFocus={this.handleInputFocus}
                  />
                </div>
                <div className="col-6">
                  <input
                    type="text"
                    name="cvc"
                    placeholder="СVC"
                    pattern="\d*"
                    onChange={this.handleCvcChange}
                    onFocus={this.handleInputFocus}
                  />
                </div>
              </div>
            </form>
          </div>
          <div className="payment-form__buttons ">
            <div className={`payment-form__buttons__pay ${this.state.isValidForm ? null : 'disabled'}`}>Оплатить</div>

            <div onClick={this.props.showPayment} className="payment-form__buttons__cancel">
              Отменить
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = {
  showPayment,
}

const mapStateToProps = (state: RootState) => {
  const { order } = state.order
  return {
    order: order,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreditCardForm)
