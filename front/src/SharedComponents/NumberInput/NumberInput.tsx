import React from 'react'

import './NumberInput.scss'

interface NumberInputProps {}

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
      <div className="numberInput noselect">
        <div className="numberInput__label">Количество</div>
        <div onClick={this.decrement} className="numberInput__dec">
          -
        </div>
        <div className="numberInput__number">{this.state.value}</div>
        <div onClick={this.increment} className="numberInput__inc">
          +
        </div>
      </div>
    )
  }
}
