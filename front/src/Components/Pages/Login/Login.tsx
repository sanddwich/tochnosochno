import React from 'react'

import './Login.scss'

interface LoginProps {}

interface LoginState {
  isDelivery: boolean
}

export default class Login extends React.Component<LoginProps, LoginState> {
  constructor(props: LoginProps) {
    super(props)
  }

  render() {
    return <div className="Login"></div>
  }
}
