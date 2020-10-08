import React, { Component } from 'react'
import { RoundInput } from '../../../../../SharedComponents/RoundInput/RoundInput'
import { RoundButton } from '../../../../../SharedComponents/RoundButton/RoundButton'
import './LoginForm.scss'
import Customer from '../../../../../Interfaces/Customer'
import { connect } from 'react-redux'
import { sendSmsCode, getSmsCode, logout, setAuthError, setNotSms } from '../../../../../Redux/actions/auth'
import { showHistoryDialog } from '../../../../../Redux/actions/app'
import { AuthActionType } from '../../../../../Redux/interfaces/auth'

type LoginFormState = {
  code: string
  regexp: RegExp
  validateError: boolean
  isSmsCode: boolean
  loading: boolean
  phone: string
  token: string
  customer?: Customer | undefined
  loggedOut: boolean
}

type LoginFormProps = {
  customer: Customer
  isSms: boolean
  isAuth: boolean
  token: string
  error: string
  loading: boolean
  getSmsCode: (phone: string) => {}
  sendSmsCode: (code: string) => {}
  logout: () => {}
  showHistoryDialog: () => {}
  setAuthError: (error: string) => {}
  setNotSms: () => {}
}
class LoginForm extends Component<LoginFormProps, LoginFormState> {
  constructor(props: any) {
    super(props)
    this.state = {
      customer: this.props.customer,
      code: '',
      loading: true,
      isSmsCode: this.props.isSms,
      phone: '8',
      regexp: /^[0-9\b]+$/,
      validateError: true,
      token: this.props.token,
      loggedOut: false,
    }
    this.validateCode = this.validateCode.bind(this)
    this.validatePhone = this.validatePhone.bind(this)
  }

  onBlurPhoneHandle = () => {
    if (this.state.validateError) {
      this.props.setAuthError('Введите корректный номер телефона')
    } else {
      this.props.setAuthError('')
    }
  }
  onBlurCodeHandle = () => {
    if (this.state.validateError) {
      this.props.setAuthError('Код должен состоять из 6 цифр')
    } else {
      this.props.setAuthError('')
    }
  }

  validatePhone(phone: string) {
    let phonePattern = new RegExp('8([0-9]){10}')
    if (phonePattern.test(phone)) {
      this.setState({ validateError: false })
      this.props.setAuthError('')
    } else {
      this.setState({ validateError: true })
    }
  }

  validateCode(code: string) {
    let codePattern = new RegExp('([0-9]){6}')
    if (codePattern.test(code)) {
      this.setState({ validateError: false })
      this.props.setAuthError('')
    } else {
      this.setState({ validateError: true })
    }
  }
  handlePhoneChangeValue = (event: React.SyntheticEvent) => {
    let phone = (event.target as HTMLInputElement).value
    if (phone === '') {
      phone = '8'
    }
    if (this.state.regexp.test(phone)) {
      this.setState({ phone: phone })
    }
    this.validatePhone(phone)
  }

  handleCodeChangeValue = (event: React.SyntheticEvent) => {
    let code = (event.target as HTMLInputElement).value

    if (code === '' || this.state.regexp.test(code)) {
      this.setState({ code: code })
    }
    this.validateCode(code)
  }

  render() {
    {
      if (!this.props.isAuth && !this.props.isSms) {
        return (
          <form
            className="login-form"
            onSubmit={(event) => {
              event.preventDefault()
            }}
          >
            <div className="login-form__error text-center">
              <small className="login-form__error__text" hidden={!this.props.error}>
                {this.props.error}
              </small>
            </div>
            <RoundInput
              isError={!!this.props.error}
              validateInput={this.onBlurPhoneHandle}
              isRepeat={false}
              minLength={11}
              maxLength={11}
              value={this.state.phone}
              onChangeValue={this.handlePhoneChangeValue}
              id="phoneInput"
              label="Номер"
              type="tel"
              placeholder="+7              "
            />

            <RoundButton
              loading={this.props.loading}
              disabled={this.state.validateError || this.props.loading}
              onClick={() => this.props.getSmsCode(this.state.phone)}
              text="Получить код по sms"
            />
          </form>
        )
      } else if (!this.props.isAuth && this.props.isSms) {
        return (
          <form
            className="login-form"
            onSubmit={(event) => {
              event.preventDefault()
            }}
          >
            <div className="login-form__error text-center">
              <small className="login-form__error__text" hidden={!this.props.error}>
                {this.props.error}
              </small>
            </div>
            <RoundInput
              onRepeatClick={this.props.setNotSms}
              isError={!!this.props.error}
              validateInput={this.onBlurCodeHandle}
              isRepeat={true}
              minLength={6}
              maxLength={6}
              type="text"
              value={this.state.code}
              onChangeValue={this.handleCodeChangeValue}
              id="codeInput"
              label="Код"
              placeholder="X-X-X-X-X-X"
            />
            <RoundButton
              loading={this.props.loading}
              onClick={() => this.props.sendSmsCode(this.state.code)}
              disabled={this.state.validateError || this.props.loading}
              text="Подтвердить"
            />
          </form>
        )
      } else if (this.props.isAuth) {
        return (
          <form className="login-form loggedIn">
            <div className="container-fluid p-0 m-0">
              <div className="container pl-5 pr-5">
                <div className="d-flex justify-content-between">
                  <div className="login-form__phone">{this.props.customer.phone}</div>
                  {this.props.loading ? (
                    <div className="spinner-border text-light" role="status">
                      <span className="sr-only">Загрузка...</span>
                    </div>
                  ) : null}

                  <div className="login-form__buttons ">
                    <a className="login-form__btn" onClick={this.props.showHistoryDialog}>
                      <img className="mr-3" src="images/history-line-sm.svg" alt="History" />
                    </a>
                    <a className="login-form__btn" onClick={this.props.logout}>
                      <img src="images/logout.svg" alt="Logout" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )
      }
      //  else {
      //   return <Loader></Loader>
      // }
    }
  }
}

const mapDispatchToProps = {
  getSmsCode,
  sendSmsCode,
  logout,
  showHistoryDialog,
  setAuthError,
  setNotSms,
}

const mapStateToProps = (state: any) => {
  const { auth } = state
  const { loading, error, customer, isSms, token, isAuth } = auth
  return {
    loading,
    error,
    customer,
    isSms,
    token,
    isAuth,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm)
