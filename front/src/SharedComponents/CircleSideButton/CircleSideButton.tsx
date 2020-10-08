import React from 'react'
import { Container } from 'react-bootstrap'
import './CircleSideButton.scss'

interface CircleSideButtonState {
  styles: {
    borderRadius: string
  }
}

interface CircleSideButtonProps {
  color: string
  rightCircle: boolean
  text: string
  clicked: boolean
  buttonName: string
  buttonGroup: string
  clickButtonHandler: (buttonName: string, buttonGroup: string) => void
}

export default class CircleSideButton extends React.Component<CircleSideButtonProps, CircleSideButtonState> {
  constructor(props: CircleSideButtonProps) {
    super(props)
    this.state = {
      styles: {
        borderRadius: this.props.rightCircle ? '0 30px 30px 0' : '30px 0 0 30px',
      },
    }
  }

  render() {
    return (
      <Container
        className="CircleSideButton d-flex justify-content-center"
        style={{
          backgroundColor: this.props.color,
          borderRadius: this.state.styles.borderRadius,
        }}
        onClick={() => this.props.clickButtonHandler(this.props.buttonName, this.props.buttonGroup)}
      >
        {this.props.text}
      </Container>
    )
  }
}
