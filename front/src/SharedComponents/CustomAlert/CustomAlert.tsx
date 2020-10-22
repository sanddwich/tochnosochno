import React from 'react'

import './CustomAlert.scss'
import 'react-datepicker/dist/react-datepicker.css'
import { Alert } from 'react-bootstrap'

type CustomAlertVariant = 'danger' | 'info'

interface CustomAlertProps {
  show: boolean
  variant: CustomAlertVariant
  message: string
}

interface CustomAlertState {
  show: boolean
}

export default class CustomAlert extends React.Component<CustomAlertProps, CustomAlertState> {
  constructor(props: CustomAlertProps) {
    super(props)
    this.state = {
      show: this.props.show,
    }
  }

  setShow = (show: boolean) => {
    this.setState({ show })
  }

  render() {
    return (
      <React.Fragment>
        {this.state.show ? (
          <div className="CustomAlert">
            <Alert variant={this.props.variant} onClose={() => this.setShow(false)} dismissible>
              <p>{this.props.message}</p>
            </Alert>
          </div>
        ) : null}
      </React.Fragment>
    )
  }
}
