import React from 'react'
import { Container } from 'react-bootstrap'
import { BooleanLiteral } from 'typescript'

import './CheckBox.scss'
import 'react-datepicker/dist/react-datepicker.css'

interface CheckBoxProps {
  label: string
  selected: boolean
  onClick: (event: React.ChangeEvent<HTMLInputElement>, selected: boolean) => void
  id: string
  name: string
}

interface CheckBoxState {
  checked: boolean
}

export default class CheckBox extends React.Component<CheckBoxProps, CheckBoxState> {
  constructor(props: CheckBoxProps) {
    super(props)
    this.state = {
      checked: this.props.selected,
    }
  }

  onChangeHandle = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ checked: !this.state.checked }, () => this.props.onClick(event, this.state.checked))
  }

  render() {
    return (
      <div
        // onClick={(event: React.ChangeEvent<HTMLInputElement>) => this.props.onClick(event, this.props.selected)}
        className="CheckBox"
      >
        <input
          onChange={(event) => {
            event.persist()
            this.onChangeHandle(event)
          }}
          type="checkbox"
          className="CheckBox__input"
          id={this.props.id}
          name={this.props.name}
          // value="checked"
          checked={this.state.checked}
        />
        <label className="CheckBox__label" htmlFor={this.props.id}>
          {this.props.label}
        </label>
        <span className="CheckBox__checkmark"></span>
      </div>
    )
  }
}
