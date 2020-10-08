import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import FullAddress from '../../../../../Interfaces/FullAddress'

import './DeliveryAddressEl.scss'

interface DeliveryAddressElProps {
  listItem: FullAddress
  listItemTitle: string
  clickCheckBoxHandlerFull: (listItem: FullAddress) => void
  key: any
}

interface DeliveryAddressElState {}

export default class DeliveryAddressEl extends React.Component<DeliveryAddressElProps, DeliveryAddressElState> {
  componentDidMount() {}

  clickEmit = (htmlForName: string): void => {
    const element: HTMLElement = document.querySelector('[for="' + htmlForName + '"]') as HTMLElement
    if (element !== null) {
      element.click()
    }
  }

  render() {
    let classes: string = this.props.listItem.clicked ? 'DeliveryAddressEl active' : 'DeliveryAddressEl'

    return (
      <Container className={classes}>
        <Row className="form-group listItemBlock">
          <Col xs={9} className="d-flex justify-content-start">
            <label htmlFor={this.props.listItemTitle}>{this.props.listItemTitle}</label>
          </Col>
          <Col xs={3} className="d-flex justify-content-end align-items-center">
            <input
              type="radio"
              className="form-check-input"
              name="addressCafeList"
              id={this.props.listItemTitle}
              defaultChecked={this.props.listItem.clicked}
              onChange={() => this.props.clickCheckBoxHandlerFull(this.props.listItem)}
            />
            <div
              className="fake__checkbox"
              onClick={(): void => {
                this.clickEmit(this.props.listItemTitle)
              }}
            ></div>
          </Col>
        </Row>
      </Container>
    )
  }
}
