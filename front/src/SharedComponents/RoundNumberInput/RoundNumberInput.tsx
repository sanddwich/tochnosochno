import React, { Component } from 'react'
import { RoundIconButton } from '../RoundIconButton/RoundIconButton'

import './RoundNumberInput.scss'

interface RoundNumberInputState {
  value: number
}
interface RoundNumberInputProps {
  value: number
  changeOrderItemAmount: (value: number) => void
}

export class RoundNumberInput extends Component<RoundNumberInputProps, RoundNumberInputState> {
  constructor(props: any) {
    super(props)
    this.state = {
      value: this.props.value,
    }
  }

  incrementValue = () => {
    const value = this.props.value + 1

    this.props.changeOrderItemAmount(value)
  }
  decrementValue = () => {
    const value = this.props.value - 1 || 1

    this.props.changeOrderItemAmount(value)
  }

  componentWillUnmount() {}

  componentWillMount() {}

  componentDidMount() {}

  componentDidUpdate() {}

  render() {
    return (
      <div className="round-number-input">
        <RoundIconButton onClick={this.decrementValue} imageSrc="images/minus.svg" altText="Minus" />
        <input onChange={() => {}} value={this.props.value} className="round-number-input__number"></input>
        <div className="round-number-input__wrapper">
          <RoundIconButton onClick={this.incrementValue} imageSrc="images/plus.svg" altText="Plus" />
        </div>
      </div>
    )
  }
}
