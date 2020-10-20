import React from 'react'
import { Container } from 'react-bootstrap'

import './RadioButton.scss'

interface RadioButtonProps {
  label: string
}

interface RadioButtonState {}

export default class RadioButton extends React.Component<RadioButtonProps, RadioButtonState> {
  constructor(props: RadioButtonProps) {
    super(props)
  }

  render() {
    return (
      <div>
        <label className="RadioButton">
          {this.props.label}
          <input type="radio" checked={true} name="radio" />
          <span className="RadioButton__checkmark"></span>
        </label>
      </div>
    )
  }
}
