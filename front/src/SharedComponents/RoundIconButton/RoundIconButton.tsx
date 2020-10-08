import React, { Component } from 'react'
import './RoundIconButton.scss'

interface RoundIconButtonState {}
interface RoundIconButtonProps {
  imageSrc: string
  altText: string
  onClick?: any
}

export class RoundIconButton extends Component<RoundIconButtonProps, RoundIconButtonState> {
  componentWillMount() {}

  componentDidMount() {}

  render() {
    return (
      <div onClick={this.props.onClick} className="round-icon-button">
        <img className="round-icon-button__icon" src={this.props.imageSrc} alt={this.props.altText} />
      </div>
    )
  }
}
