import React, { ChangeEvent, Component } from 'react'
import './RoundInput.scss'

interface RoundInputState {}

interface RoundInputProps {
  isError: boolean
  isRepeat: boolean
  placeholder: string
  label: string
  isCode?: boolean
  id: string
  value: string
  type: string
  minLength: number | undefined
  maxLength: number | undefined
  onChangeValue: ((event: ChangeEvent<HTMLInputElement>) => void) | undefined
  validateInput: any
  onRepeatClick?: () => {}
}

export class RoundInput extends Component<RoundInputProps, RoundInputState> {
  componentWillMount() {}

  componentDidMount() {}

  onBlurHandle = () => {
    this.props.validateInput()
  }

  render() {
    return (
      <div className="round-input">
        <div className="round-input__label">{this.props.label}</div>
        <input
          onBlur={this.onBlurHandle}
          minLength={this.props.minLength}
          maxLength={this.props.maxLength}
          type={this.props.type}
          value={this.props.value}
          onChange={this.props.onChangeValue}
          id={this.props.id}
          placeholder={this.props.placeholder}
          className={`round-input__text ${this.props.isError ? 'error' : null}`}
        ></input>
        {this.props.isRepeat ? (
          <div onClick={this.props.onRepeatClick} className="round-input__repeat">
            <img src="images/repeat.svg" alt="Repeat" />
          </div>
        ) : null}
      </div>
    )
  }
}
