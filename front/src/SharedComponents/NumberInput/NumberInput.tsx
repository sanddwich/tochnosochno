import React from 'react'

import './NumberInput.scss'

interface NumberInputProps {
  label: string
  hideLabel: boolean
}

interface NumberInputState {
  value: number
}

export default class NumberInput extends React.Component<NumberInputProps, NumberInputState> {
  constructor(props: NumberInputProps) {
    super(props)
    this.state = {
      value: 1,
    }
  }

  increment = () => {
    this.setState({
      value: this.state.value + 1,
    })
  }

  decrement = () => {
    this.setState({
      value: this.state.value - 1,
    })
  }

  render() {
    return (
      <div className={`numberInput noselect ${this.props.hideLabel ? '' : 'fullWidth'}`}>
        <div className={`numberInput__label ${this.props.hideLabel ? 'hidden' : ''}`}>{this.props.label}</div>
        <div className="numberInput__input">
          <div onClick={this.decrement} className="numberInput__dec">
            -
          </div>
          <div className="numberInput__number">{this.state.value}</div>
          <div onClick={this.increment} className="numberInput__inc">
            +
          </div>
        </div>
      </div>
    )
  }
}
