import React from 'react'
import './MainContent.scss'
import { Container, Row, Col } from 'react-bootstrap'

interface MainContentProps {}
interface MainContentState {}

export default class MainContent extends React.Component<MainContentProps, MainContentState> {
  render() {
    return (
      <Container fluid className="MainContent">
        <Row>
          <Col xs={12} sm={6}>
            <h1>Мы используем только натуральные продукты и свежие овощи</h1>
            <div className="menuEl__bottomLine" style={{ width: 123 }}></div>
          </Col>
          <Col xs={12} sm={6}></Col>
        </Row>
        <Row style={{ marginTop: 40 }}>
          <Col xs={12} sm={6}>
            <p>
              Мы готовим только отборное мясо в настоящей русской печи на дровах, используем только свежие овощи и
              натуральные соусы в наших бургерах!
            </p>
            <p>Реши с каким мясом будет твой бургер сегодня, а о качестве можно не беспокоиться</p>
          </Col>
          <Col xs={12} sm={6}>
            <Container className="imgpool">
              <Row>
                <Col className="tripleimg">
                  <div className="cimg">
                    <img src="images/grilled-steak.svg" alt="" />
                  </div>
                  <p>Рваное мясо</p>
                </Col>
                <Col className="tripleimg">
                  <div className="cimg">
                    <img src="images/furnace.svg" alt="" />
                  </div>
                  <p>Готовится в печи</p>
                </Col>
                <Col className="tripleimg">
                  <div className="cimg">
                    <img src="images/carrot.svg" alt="" />
                  </div>
                  <p>Свежие овощи</p>
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    )
  }
}
