import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import Product from '../../../Interfaces/Product'

import './ComboElement.scss'

interface ComboElementProps {
  product: Product
  changeProductAtCombo: (id: number) => void
}

interface ComboElementState {}

export default class ComboElement extends React.Component<ComboElementProps, ComboElementState> {
  render() {
    return (
      <Container
        className="ComboElement p-0 m-0"
        onClick={() => this.props.changeProductAtCombo(this.props.product.id)}
      >
        <Row className="ComboElement__img p-0 m-0">
          <Col className="p-0 m-0 d-flex align-items-center justify-content-center" xs={3}>
            <img src={`${this.props.product.imageLinks[0]}`} className="img-fluid" alt="" />
          </Col>
          <Col className="ComboElement__infoCont p-0 pt-2 m-0 d-flex align-items-center">
            <Row className="p-0 m-0 d-flex flex-column">
              <Col className="ComboElement__title p-0 m-0">{this.props.product.name}</Col>
              <Col className="ComboElement__descr p-0 m-0">{this.props.product.description}</Col>
              <Col className="ComboElement__choice p-0 m-0 d-flex flex-row">
                <div className="ComboElement__choiceTitle">Изменить выбор</div>
                <div className="ComboElement__choiceArrow">
                  <img src="/images/arrowRight.svg" alt="" />
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    )
  }
}
