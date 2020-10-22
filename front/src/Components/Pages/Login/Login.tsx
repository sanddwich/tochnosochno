import React from 'react'
import { Modal } from 'react-bootstrap'
import { connect } from 'react-redux'
import { RootState } from '../../../Redux'
import ActionButton from '../../../SharedComponents/ActionButton/ActionButton'
import BlockName from '../../../SharedComponents/BlockName/BlockName'
import RoundButton from '../../../SharedComponents/RoundButton/RoundButton'
import { hideLoginModal } from '../../../Redux/actions/app'
import { getSmsCode, sendSmsCode } from '../../../Redux/actions/auth'
import InputMask from 'react-input-mask'

import './Login.scss'

interface LoginProps {
  showLogin: boolean
  hideLoginModal: () => void
  getSmsCode: any
  loading: boolean
  isSms: boolean
  sendSmsCode: any
}

interface LoginState {
  phone: string
  phoneError: boolean
  phoneValid: boolean
  codeError: boolean
  smsCode: string
}

class Login extends React.Component<LoginProps, LoginState> {
  constructor(props: LoginProps) {
    super(props)
    this.state = {
      phone: '',
      phoneError: false,
      phoneValid: false,
      codeError: false,
      smsCode: '',
    }
  }

  setPhone = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ phone: event.target.value })
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
      this.setState({ codeError: false })
      this.props.sendSmsCode(code)
    }
  }

  smsSendHandler = () => {
    const phone = this.state.phone.replace(/\D/g, '')
    console.log(phone)
    if (phone.length < 11) {
      this.setState({ phoneError: true })
    } else {
      this.setState({ phoneError: false })
      this.props.getSmsCode(phone)
    }
  }

  render() {
    return (
      <React.Fragment>
        {this.props.showLogin ? (
          <div className="Login">
            <div className="Login__content">
              <div className="Login__content__close">
                <RoundButton icon="icon_close.svg" backgroundColor="#F2F2F2" onClick={this.props.hideLoginModal} />
              </div>
              <div className="Login__content__body">
                <div className="Login__content__body__form">
                  <div style={{ width: '250px', lineHeight: '14px' }}>
                    <BlockName fontSize="24px" name="Войти в личный кабинет" />
                  </div>
                  <form>
                    <div className="Login__form__group">
                      <label htmlFor="phone">Телефон</label>
                      <InputMask
                        mask="+7 (999) 999-99-99"
                        value={this.state.phone}
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
                            type="text"
                            placeholder="+7 (999) 123-45-67"
                          />
                        )}
                      </InputMask>

                      {this.state.phoneError ? <div className="inputError"> Введите корректный телефон</div> : null}
                    </div>
                    {this.props.isSms ? (
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
                              style={{ width: '62px' }}
                              {...inputProps}
                              id="code"
                              className={`${this.state.codeError ? 'error' : ''} `}
                              type="text"
                            />
                          )}
                        </InputMask>

                        {this.state.codeError ? <div className="inputError"> Введите корректный код</div> : null}
                      </div>
                    ) : null}
                    {this.props.isSms ? (
                      <ActionButton
                        disabled={this.props.loading}
                        loading={this.props.loading}
                        onClick={() => this.codeSendHandler()}
                        textColor="white"
                        width="280px"
                        text="Войти в личный кабинет"
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
}

const mapStateToProps = (state: RootState) => {
  const { showLogin } = state.app
  const { loading, isSms } = state.auth
  return {
    showLogin,
    loading,
    isSms,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
