import React from 'react'

import './ActionButton.scss'

interface ActionButtonProps {
  icon: string
  onClick: any
  text: string
  backgroundColor: string
  width: string
}

interface ActionButtonState {}

export default class ActionButton extends React.Component<ActionButtonProps, ActionButtonState> {
  render() {
    return (
      <div
        onClick={this.props.onClick}
        className="actionButton noselect"
        style={{ backgroundColor: this.props.backgroundColor, width: this.props.width }}
      >
        <div className="actionButton__text">{this.props.text}</div>
        <div className="actionButton__icon">
          <img src={`images/icons/${this.props.icon}`} alt="icon" />
        </div>
      </div>
    )
  }
}