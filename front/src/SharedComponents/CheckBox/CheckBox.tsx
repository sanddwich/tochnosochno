import React from 'react'
import { Container } from 'react-bootstrap'
import { BooleanLiteral } from 'typescript'

import './CheckBox.scss'
import 'react-datepicker/dist/react-datepicker.css'

interface CheckBoxProps {
  label: string
  selected: boolean
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, selected: boolean) => void
  id: string
  name: string
}

interface CheckBoxState {}

export default class CheckBox extends React.Component<CheckBoxProps, CheckBoxState> {
  constructor(props: CheckBoxProps) {
    super(props)
  }

  render() {
    return (
      <div
        onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
          this.props.onClick(event, this.props.selected)
        }
        className="CheckBox"
      >
        <input type="checkbox" className="CheckBox__input" id={this.props.id} name={this.props.name} value="checked" />
        <label className="CheckBox__label" htmlFor={this.props.id}>
          {this.props.label}
        </label>
        <span className="CheckBox__checkmark"></span>
      </div>
    )
  }
}
