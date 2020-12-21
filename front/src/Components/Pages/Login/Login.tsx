import React from 'react'
import { Modal } from 'react-bootstrap'
import { connect } from 'react-redux'
import { RootState } from '../../../Redux'
import ActionButton from '../../../SharedComponents/ActionButton/ActionButton'
import BlockName from '../../../SharedComponents/BlockName/BlockName'
import RoundButton from '../../../SharedComponents/RoundButton/RoundButton'
import { hideLoginModal } from '../../../Redux/actions/app'
import { getSmsCode, sendSmsCode, setPhone, setNotSms, setProcessOrderOnAuth } from '../../../Redux/actions/auth'
import InputMask from 'react-input-mask'
import Countdown from 'react-countdown'

import './Login.scss'
import CustomAlert from '../../../SharedComponents/CustomAlert/CustomAlert'

interface LoginProps {
  showLogin: boolean
  hideLoginModal: () => void
  setProcessOrderOnAuth: (isProcessOrder: boolean) => void
  setNotSms: () => void
  setPhone: (phone: string) => void
  getSmsCode: any
  loading: boolean
  isSms: boolean
  sendSmsCode: any
  phone: string
  error: string
  isAuth: boolean
  isProcessOrder: boolean
  smsCodeTime: string
}

interface LoginState {
  phoneError: boolean
  phoneValid: boolean
  codeError: boolean
  smsCode: string
}

class Login extends React.Component<LoginProps, LoginState> {
  constructor(props: LoginProps) {
    super(props)
    this.state = {
      phoneError: false,
      phoneValid: false,
      codeError: false,
      smsCode: '',
    }
  }

  setPhone = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.setPhone(event.target.value)
    const phone = event.target.value.replace(/\D/g, '')
    if (phone.length === 11) {
      this.setState({ phoneValid: true, phoneError: false })
    } else if (phone.length < 11) {
      this.setState({ phoneValid: false })
    }
  }

  setCode = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      smsCode: event.target.value,
    })
  }

  codeSendHandler = () => {
    const code = this.state.smsCode.replace(/\D/g, '')
    if (code.length < 4) {
      this.setState({ codeError: true })
    } else {
      this.setState({ codeError: false, smsCode: '' })
      this.props.sendSmsCode(code)
    }
  }

  smsSendHandler = () => {
    const phone = this.props.phone.replace(/\D/g, '')
    if (phone.length < 11) {
      this.setState({ phoneError: true })
    } else {
      this.setState({ phoneError: false })
      this.props.getSmsCode(phone)
    }
  }

  repeatSmsTimer = () => {
    const smsDate = new Date(this.props.smsCodeTime)
    const now = new Date()
    let diff = Math.floor((now.getTime() - smsDate.getTime()) / 1000)
    return diff
  }

  timerRenderer = (props: any) => {
    if (props.completed) {
      // Render a completed state
      return (
        <div onClick={this.props.setNotSms} className="Login__repeatCode">
          Отправить код повторно
        </div>
      )
    } else {
      // Render a countdown
      return <span className="Login__timer">Отправить код повторно через {props.seconds} сек</span>
    }
  }

  render() {
    return (
      <React.Fragment>
        {this.props.showLogin && !this.props.isAuth ? (
          <div className="Login">
            <div className="Login__content">
              <div className="Login__content__close">
                <RoundButton
                  icon="icon_close.svg"
                  backgroundColor="#F2F2F2"
                  onClick={() => {
                    this.props.setProcessOrderOnAuth(false)
                    this.props.hideLoginModal()
                  }}
                />
              </div>
              <div className="Login__content__body">
                <div className="Login__content__body__form">
                  <div style={{ width: '250px', lineHeight: '14px' }}>
                    <BlockName fontSize="24px" name="Войти в личный кабинет" />
                  </div>
                  {this.props.error ? <div className="Login__error">{this.props.error}</div> : null}

                  <form>
                    <div className="Login__form__group">
                      <label htmlFor="phone">Телефон</label>
                      <InputMask
                        mask="8 (999) 999-99-99"
                        value={this.props.phone}
                        onChange={(event) => this.setPhone(event)}
                        maskChar=" "
                      >
                        {(inputProps: any) => (
                          <input
                            {...inputProps}
                            id="phone"
                            className={`${this.state.phoneError && !this.state.phoneValid ? 'error' : ''} ${
                              this.state.phoneValid ? 'correct' : ''
                            }`}
                            type="tel"
                            placeholder="8 (999) 123-45-67"
                          />
                        )}
                      </InputMask>

                      {this.state.phoneError ? <div className="inputError"> Введите корректный телефон</div> : null}
                    </div>
                    {this.props.isSms ? (
                      <div className="Login__content__codeBlock">
                        <div className="Login__form__group">
                          <label htmlFor="code">Код</label>
                          <InputMask
                            maskChar=" "
                            mask="999999"
                            value={this.state.smsCode}
                            onChange={(event) => this.setCode(event)}
                          >
                            {(inputProps: any) => (
                              <input
                                style={{ width: '72px' }}
                                {...inputProps}
                                id="code"
                                className={`${this.state.codeError ? 'error' : ''} `}
                                type="tel"
                              />
                            )}
                          </InputMask>

                          {this.state.codeError ? <div className="inputError"> Введите корректный код</div> : null}
                        </div>

                        <Countdown
                          renderer={this.timerRenderer}
                          zeroPadTime={2}
                          date={new Date(this.props.smsCodeTime).getTime() + 59000}
                        ></Countdown>
                      </div>
                    ) : null}

                    {this.props.isSms ? (
                      <ActionButton
                        disabled={this.props.loading}
                        loading={this.props.loading}
                        onClick={() => this.codeSendHandler()}
                        textColor="white"
                        width="280px"
                        text={`${this.props.isProcessOrder ? 'Завершить заказ' : 'Войти в личный кабинет'}`}
                        backgroundColor="#303030"
                        icon="user_dark.svg"
                      />
                    ) : (
                      <ActionButton
                        disabled={this.props.loading}
                        loading={this.props.loading}
                        onClick={() => this.smsSendHandler()}
                        textColor="white"
                        width="280px"
                        text="Отправить код по смс"
                        backgroundColor="#303030"
                        icon="mail-send.svg"
                      />
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </React.Fragment>
    )
  }
}

const mapDispatchToProps = {
  hideLoginModal,
  getSmsCode,
  sendSmsCode,
  setPhone,
  setNotSms,
  setProcessOrderOnAuth,
}

const mapStateToProps = (state: RootState) => {
  const { showLogin } = state.app
  const { loading, isSms, phone, error, isAuth, smsCodeTime, isProcessOrder } = state.auth
  return {
    showLogin,
    loading,
    isSms,
    phone,
    error,
    isAuth,
    smsCodeTime,
    isProcessOrder,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
