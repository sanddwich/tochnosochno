import React from 'react'
import { Container } from 'react-bootstrap'
import Loader from '../Loader/Loader'

import './RoundButton.scss'

interface RoundButtonProps {
  icon: string
  onClick: any
  backgroundColor: string
  width?: string
  height?: string
  loading?: boolean
}

interface RoundButtonState {}

export default class RoundButton extends React.Component<RoundButtonProps, RoundButtonState> {
  render() {
    return (
      <React.Fragment>
        {this.props.loading ? (
          <Loader />
        ) : (
          <div
            onClick={this.props.onClick}
            className="roundButton noselect"
            style={{ backgroundColor: this.props.backgroundColor, width: this.props.width, height: this.props.height }}
          >
            <img src={`/images/icons/${this.props.icon}`} alt="icon" />
          </div>
        )}
      </React.Fragment>
    )
  }
}
