import React from 'react'

import './ActionButton.scss'

interface ActionButtonProps {
  icon: string
  onClick: any
  text: string
  backgroundColor: string
  width: string
  textColor: string
  hideTextMobile?: boolean
}

interface ActionButtonState {}

export default class ActionButton extends React.Component<ActionButtonProps, ActionButtonState> {
  render() {
    return (
      <div
        onClick={this.props.onClick}
        className={`actionButton noselect ${this.props.hideTextMobile ? 'mobile' : ''}`}
        style={{ backgroundColor: this.props.backgroundColor, width: this.props.width, color: this.props.textColor }}
      >
        <div className={`actionButton__text`}>{this.props.text}</div>
        <div className="actionButton__icon">
          <img src={`/images/icons/${this.props.icon}`} alt="icon" />
        </div>
      </div>
    )
  }
}
