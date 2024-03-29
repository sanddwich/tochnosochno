import React from 'react'

import './NumberInput.scss'

interface NumberInputProps {
  label: string
  hideLabel: boolean
  onChange: any
  value: number
  minValue: number
  mobileHide?: boolean
}

interface NumberInputState {
  value: number
}

export default class NumberInput extends React.Component<NumberInputProps, NumberInputState> {
  constructor(props: NumberInputProps) {
    super(props)
    this.state = {
      value: this.props.value || 1,
    }
  }

  increment = () => {
    this.setState(
      {
        value: this.state.value + 1,
      },
      () => {
        this.props.onChange(this.props.value + 1)
      }
    )
  }

  decrement = () => {
    let value = this.props.value - 1
    if (value < this.props.minValue) value = this.props.minValue
    this.setState(
      {
        value: value,
      },
      () => {
        this.props.onChange(value)
      }
    )
  }

  render() {
    return (
      <div
        className={`numberInput  noselect ${this.props.hideLabel ? '' : 'fullWidth'} ${
          this.props.mobileHide ? 'mobileHide' : ''
        }`}
      >
        <div className={`numberInput__label ${this.props.hideLabel ? 'hidden' : ''}`}>{this.props.label}</div>
        <div className="numberInput__input">
          <div onClick={this.decrement} className="numberInput__dec">
            -
          </div>
          <div className="numberInput__number">{this.props.value}</div>
          <div onClick={this.increment} className="numberInput__inc">
            +
          </div>
        </div>
      </div>
    )
  }
}
