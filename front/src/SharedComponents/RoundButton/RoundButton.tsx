import React from 'react'
import { Container } from 'react-bootstrap'

import './RoundButton.scss'

interface RoundButtonProps {
  icon: string
  onClick: any
  backgroundColor: string
}

interface RoundButtonState {}

export default class RoundButton extends React.Component<RoundButtonProps, RoundButtonState> {
  render() {
    return (
      <div
        onClick={this.props.onClick}
        className="roundButton noselect"
        style={{ backgroundColor: this.props.backgroundColor }}
      >
        <img src={`images/icons/${this.props.icon}`} alt="icon" />
      </div>
    )
  }
}
