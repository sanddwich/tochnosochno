import React, { Component } from 'react'
import './RoundButton.scss'

type RoundButtonState = {}

type RoundButtonProps = {
  text: string
  onClick?: any
  disabled?: boolean
  loading: boolean
}
export class RoundButton extends Component<RoundButtonProps, RoundButtonState> {
  componentWillMount() {}

  componentDidMount() {}

  render() {
    return (
      <button type="button" disabled={this.props.disabled} onClick={this.props.onClick} className="round-button">
        {this.props.loading ? (
          <span className="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true"></span>
        ) : (
          ''
        )}
        {this.props.text}
      </button>
    )
  }
}
