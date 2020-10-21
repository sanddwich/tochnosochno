import React from 'react'
import { Modal } from 'react-bootstrap'
import { connect } from 'react-redux'
import { RootState } from '../../../Redux'
import ActionButton from '../../../SharedComponents/ActionButton/ActionButton'
import BlockName from '../../../SharedComponents/BlockName/BlockName'
import RoundButton from '../../../SharedComponents/RoundButton/RoundButton'
import { hideLoginModal } from '../../../Redux/actions/app'

import './Login.scss'

interface LoginProps {
  showLogin: boolean
  hideLoginModal: () => void
}

interface LoginState {}

class Login extends React.Component<LoginProps, LoginState> {
  constructor(props: LoginProps) {
    super(props)
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

                  <div className="Login__form__group">
                    <label htmlFor="phone">Телефон</label>
                    <input id="phone" type="text" placeholder="+7 (999) 123-45-67" />
                  </div>

                  <ActionButton
                    onClick={() => console.log('sendSMS')}
                    textColor="white"
                    width="280px"
                    text="Отправить код по смс"
                    backgroundColor="#303030"
                    icon="mail-send.svg"
                  />
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
}

const mapStateToProps = (state: RootState) => {
  const { showLogin } = state.app
  return {
    showLogin,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
