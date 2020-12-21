import React from 'react'
import { Container } from 'react-bootstrap'
import { BooleanLiteral } from 'typescript'

import './RadioButton.scss'
import 'react-datepicker/dist/react-datepicker.css'

interface RadioButtonProps {
  label: string
  selected: boolean
  onClick: (event: React.ChangeEvent<HTMLInputElement>) => void
  name: string
  id: string
}

interface RadioButtonState {}

export default class RadioButton extends React.Component<RadioButtonProps, RadioButtonState> {
  constructor(props: RadioButtonProps) {
    super(props)
  }

  render() {
    return (
      <div>
        <label htmlFor={this.props.id} className="RadioButton">
          {this.props.label}
          <input
            onChange={(event) => this.props.onClick(event)}
            type="radio"
            // defaultChecked={this.props.selected}
            name={this.props.name}
            id={this.props.id}
            checked={this.props.selected}
          />
          <span className="RadioButton__checkmark"></span>
        </label>
      </div>
    )
  }
}
