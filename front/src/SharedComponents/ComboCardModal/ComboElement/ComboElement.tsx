import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'

import './ComboElement.scss'

interface ComboElementProps {}

interface ComboElementState {}

export default class ComboElement extends React.Component<ComboElementProps, ComboElementState> {
  render() {
    return (
      <Container className="ComboElement p-0 m-0">
        <Row className="ComboElement__img p-0 m-0">
          <Col className="p-0 m-0 d-flex align-items-center justify-content-center" xs={3}>
            <img src="/images/products/peperoni.png" className="img-fluid" alt="" />
          </Col>
          <Col className="ComboElement__infoCont p-0 pt-2 m-0 d-flex align-items-center">
            <Row className="p-0 m-0 d-flex flex-column">
              <Col className="ComboElement__title p-0 m-0">Пеперонни</Col>
              <Col className="ComboElement__descr p-0 m-0">
                Соус песто, сливочный соус, цыплёнок, кубики брынзы, томаты черри, моцарелла
              </Col>
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
