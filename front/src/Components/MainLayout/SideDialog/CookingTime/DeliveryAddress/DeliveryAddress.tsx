import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import './DeliveryAddress.scss'

interface DeliveryAddressProps {
  dateTime: string
  delivery: {
    pickup: boolean
    address: string
  }
}

interface DeliveryAddressState {}

export default class DeliveryAddress extends React.Component<DeliveryAddressProps, DeliveryAddressState> {
  render() {
    return (
      <Container className="DeliveryAddress pt-2 pl-4 pr-4">
        <Row className="pl-3 pr-3 DeliveryAddress__cont">
          {this.props.delivery.pickup ? (
            <Col>
              <Row>
                <Col xs={4}>
                  <span className="DeliveryAddress__title">Самовывоз</span>
                </Col>
                <Col xs={8}>
                  <p className="DeliveryAddress__desc">
                    <strong>{this.props.delivery.address}</strong>
                  </p>
                </Col>
              </Row>
            </Col>
          ) : (
            <Col>
              <Row>
                <Col xs={4}>
                  <span className="DeliveryAddress__title">Доставка</span>
                </Col>
                <Col>
                  <p className="DeliveryAddress__desc">
                    <strong>{this.props.delivery.address}</strong>
                  </p>
                </Col>
              </Row>
            </Col>
          )}
        </Row>
        <Row className="pl-3 pr-3 DeliveryAddress__cont">
          <Col xs={4}>
            <span className="DeliveryAddress__title">Время заказа</span>
          </Col>
          <Col xs={8}>
            <p className="DeliveryAddress__desc">
              {this.props.dateTime === '' ? (
                <strong>от 60 мин. с момента заказа</strong>
              ) : (
                <strong>{this.props.dateTime}</strong>
              )}
            </p>
          </Col>
        </Row>
      </Container>
    )
  }
}
