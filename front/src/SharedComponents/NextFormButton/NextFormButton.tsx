import React, { Component } from 'react'
import './NextFormButton.scss'

interface NextFormButtonState {}
interface NextFormButtonProps {
  text: string
  disabled: boolean
  loading: boolean
  onClick: () => void
}

export class NextFormButton extends Component<NextFormButtonProps, NextFormButtonState> {
  render() {
    return (
      <div
        onClick={() => (!this.props.disabled && !this.props.loading ? this.props.onClick() : null)}
        className={`next-form-button ${this.props.disabled || this.props.loading ? 'disabled' : ''}`}
      >
        <div className="next-form-button__text">
          {this.props.loading ? (
            <div className="spinner-border text-light mr-2" role="status">
              <span className="sr-only">Загрузка...</span>
            </div>
          ) : null}

          {this.props.text}
        </div>
      </div>
    )
  }
}
