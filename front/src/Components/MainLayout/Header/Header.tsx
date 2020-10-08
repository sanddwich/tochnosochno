import React, { Component } from 'react' // let's also import Component
import './Header.scss'

import { Container, Row, Col } from 'react-bootstrap'
import { faBullseye } from '@fortawesome/free-solid-svg-icons'

// the clock's state has one field: The current time, based upon the
// JavaScript class Date
type HeaderState = {
  isBurger: boolean
}

type HeaderProps = {}

export class Header extends Component<HeaderProps, HeaderState> {
  constructor(props: HeaderProps) {
    super(props)
    this.state = {
      isBurger: false,
    }
  }

  toggleBurger = () => {
    this.setState({
      isBurger: !this.state.isBurger,
    })
  }

  componentWillMount() {}

  componentDidMount() {}

  render() {
    return (
      <header>
        <Container fluid className="Header">
          <Row className="h-100">
            <Col xs={6} sm={2} md={2} className="d-flex justify-content-start align-items-center">
              <img src="images/logo.jpeg" alt="" />
            </Col>
            <Col lg={3} className="d-none d-lg-flex justify-content-start align-items-center">
              <hr />
            </Col>
            <Col
              sm={5}
              md={4}
              lg={3}
              className="d-none d-sm-flex justify-content-center align-items-center"
              style={{ fontSize: '16px' }}
            >
              Работаем с <span style={{ fontSize: '18px', fontWeight: 'bold', margin: '5px' }}>9:00</span>
              <span style={{ color: '#B5B5B5' }}>по</span>
              <span style={{ fontSize: '18px', fontWeight: 'bold', margin: '5px' }}>20:00</span>
            </Col>
            <Col
              sm={1}
              className="d-none d-sm-flex justify-content-center align-items-center"
              style={{ fontSize: '16px' }}
            >
              <a href="https://www.instagram.com/myaso__myaso/">
                <img src="images/instagram-line.svg" alt="" />
              </a>
            </Col>
            <Col
              sm={4}
              md={3}
              lg={2}
              className="d-none d-sm-flex justify-content-end align-items-center"
              style={{ fontSize: '16px' }}
            >
              <a href="tel:88512779998">8 (8512) 77-99-98</a>
            </Col>

            <Col xs={6} onClick={this.toggleBurger} className="d-flex d-sm-none justify-content-end align-items-center">
              <img src="images/burger.svg" alt="" />
            </Col>
          </Row>
        </Container>

        <Container hidden={!this.state.isBurger} fluid className="header__burger m-0 p-0">
          <Container className="header__burger__header">
            <div className="container">
              <div className="d-flex justify-content-between row ">
                <div className="header__burger__logo">
                  <img src="images/logo.jpeg" alt="logo" />
                </div>

                <div className="header__burger__close" onClick={this.toggleBurger}>
                  <img src="images/exit.svg" alt="exit" />
                </div>
              </div>
            </div>
          </Container>

          <div className="header__burger__rows">
            <div className="header__burger__row lined">
              Работаем с <span className="strong-text">9:00</span> по <span className="strong-text">20:00</span>
            </div>
            <div className="header__burger__row lined">Номер службы доставки</div>
            <div className="header__burger__row ">
              <a href="tel:88512779998">
                <span className="strong-text">8 (851) 277-99-98</span>
              </a>
            </div>
            <div className="header__burger__row lined">Социальные сети</div>
            <div className="header__burger__row ">
              <a href="https://www.instagram.com/myaso__myaso/">
                <img src="images/instagram-line.svg" alt="" />
              </a>
            </div>
          </div>
        </Container>
      </header>
    )
  }
}
