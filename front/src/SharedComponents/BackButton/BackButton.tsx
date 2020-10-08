import React, { Component } from 'react'
import './BackButton.scss'

interface BackButtonState {}

interface BackButtonProps {
  text: string
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

export class BackButton extends Component<BackButtonProps, BackButtonState> {
  componentWillMount() {}

  componentDidMount() {}

  render() {
    return (
      <div onClick={this.props.onClick} className="back-button">
        <img src="images/back-icon.svg" alt="BackButton" />
        <div className="back-button__text">{this.props.text}</div>
      </div>
    )
  }
}
