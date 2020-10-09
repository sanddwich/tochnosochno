import React from 'react'
import { Container } from 'react-bootstrap'

import './RoundButton.scss'

interface RoundButtonProps {}

interface RoundButtonState {}

export default class RoundButton extends React.Component<RoundButtonProps, RoundButtonState> {
  render() {
    return (
      <Container className="RoundButton p-0 m-0">
        <h1>RoundButton</h1>
      </Container>
    )
  }
}
