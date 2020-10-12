import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import RoundButton from '../../../../SharedComponents/RoundButton/RoundButton'

import './HeaderUp.scss'

interface HeaderUpProps {}

interface HeaderUpState {
  toggleMenu: boolean
}

export default class HeaderUp extends React.Component<HeaderUpProps, HeaderUpState> {
  constructor(props: HeaderUpProps) {
    super(props)
    this.state = {
      toggleMenu: true,
    }
  }

  instaButtonClick = (): void => {
    console.log('instaButtonClick')
  }

  vkButtonClick = (): void => {
    console.log('vkButtonClick')
  }

  cartButtonClick = (): void => {
    console.log('cartButtonClick')
  }

  profileButtonClick = (): void => {
    console.log('profileButtonClick')
  }

  noAction = (): void => {
    console.log('noAction')
  }

  burgerButtonClick = (): void => {  
    const toggleMenu = this.state.toggleMenu
    const element = document.querySelector('.HeaderUp__toggleMenu') as HTMLElement
    toggleMenu ? element.style.display = 'block' : element.style.display = 'none'
    this.setState({toggleMenu: !this.state.toggleMenu})
  }

  render() {
    return (
      <React.Fragment>
        <Container className="HeaderUp p-0 d-none d-lg-flex justify-content-between align-items-center">
          <div className="HeaderUp__menuItem">Акции</div>
          <div className="HeaderUp__menuItem">Соц.сети:</div>
          <div className="HeaderUp__menuItem">
            <Row className="m-0 p-0">
              <Col className="m-0 p-0">
                <RoundButton backgroundColor="#303030" icon="insta_white.svg" onClick={() => this.instaButtonClick()} />
              </Col>
              <Col className="">
                <RoundButton backgroundColor="#303030" icon="vk_white.svg" onClick={() => this.vkButtonClick()} />
              </Col>
            </Row>
          </div>
          <div className="HeaderUp__menuItem">Контакты</div>
          <div className="HeaderUp__menuItem">
            <NavLink to="/" exact>
              <div className="HeaderUp__menuLogo">
                <img src="images/logo_white.svg" alt="" />
              </div>
            </NavLink>
          </div>
          <div className="HeaderUp__menuItem d-flex justify-content-between">
            <Row className="HeaderUp__container p-0 m-0 d-flex align-items-center">
              <div className="HeaderUp__containerImg">
                <RoundButton backgroundColor="#303030" icon="nyamnyan_white.svg" onClick={() => this.noAction()} />
              </div>
              <div className="HeaderUp__containerDescr pl-2">
                <div className="HeaderUp__containerDescrPhone">46-46-07</div>
                <div className="HeaderUp__containerDescrTitle">номер ресторана</div>
              </div>
            </Row>
          </div>
          <div className="HeaderUp__menuItem d-flex justify-content-between">
            <Row className="HeaderUp__container p-0 m-0 d-flex align-items-center">
              <div className="HeaderUp__containerImg">
                <RoundButton backgroundColor="#303030" icon="car_white.svg" onClick={() => this.noAction()} />
              </div>
              <div className="HeaderUp__containerDescr pl-2">
                <div className="HeaderUp__containerDescrPhone">46-46-02</div>
                <div className="HeaderUp__containerDescrTitle">служба доставки</div>
              </div>
            </Row>
          </div>
          <div className="HeaderUp__menuItem">
            <Row className="m-0 p-0">
              <Col className="m-0 p-0">
                <RoundButton backgroundColor="#303030" icon="cart_white.svg" onClick={() => this.cartButtonClick()} />
              </Col>
              <Col className="">
                <RoundButton
                  backgroundColor="#303030"
                  icon="user_white.svg"
                  onClick={() => this.profileButtonClick()}
                />
              </Col>
            </Row>
          </div>
        </Container>

        <Container fluid className="HeaderUp__mobile pl-4 pr-4 m-0 d-flex d-lg-none justify-content-between">
          <div className="menuItem h-100 d-flex align-items-center" onClick={() => this.burgerButtonClick()}>
            <img src="images/burger.svg" />
          </div>
          <div className="menuItem h-100 d-flex align-items-center">
            <img src="images/logo_mob.svg" />
          </div>
          <div className="menuItem h-100 d-flex align-items-center">
            <RoundButton backgroundColor="#303030" icon="cart_white.svg" onClick={() => this.cartButtonClick()} />
          </div>
        </Container>

        <Container fluid className="HeaderUp__toggleMenu p-0 m-0">
          <Container fluid className="HeaderUp__mobile pl-4 pr-4 m-0 d-flex d-lg-none justify-content-between">
            <div className="menuItem h-100 d-flex align-items-center" onClick={() => this.burgerButtonClick()}>
              <img src="images/burger.svg" />
            </div>
            <div className="menuItem h-100 d-flex align-items-center">
              <img src="images/logo_mob.svg" />
            </div>
            <div className="menuItem h-100 d-flex align-items-center">
              <RoundButton backgroundColor="#303030" icon="cart_white.svg" onClick={() => this.cartButtonClick()} />
            </div>
          </Container>

          <Container fluid className="HeaderUp__toggleMenuCont">
            <Row className="pl-3 pr-3 mt-3">
              <Col xs={8} className="HeaderUp__toggleMenuItem p-0 m-0">
                <h1>Акции</h1>
              </Col>
            </Row>
            <Row className="pl-3 pr-3 mt-3">
              <Col xs={8} className="HeaderUp__toggleMenuItem p-0 m-0">
                <h1>Контакты</h1>
              </Col>
            </Row>

            <a href="tel:88512464602">
              <Row className="pl-3 pr-3">
                <Container fluid className="HeaderUp__toggleMenuItem2 p-0 m-0 mt-5 d-flex justify-content-between">
                  <div className="HeaderUp__toggleMenuItemTitle">Телефон доставки</div>
                  <div className="HeaderUp__toggleMenuItemPhone">46-46-02</div>
                </Container>
              </Row>
            </a>
            <a href="tel:88512464607">
              <Row className="pl-3 pr-3">
                <Container fluid className="HeaderUp__toggleMenuItem2 p-0 m-0 mt-3 d-flex justify-content-between">
                  <div className="HeaderUp__toggleMenuItemTitle">Телефон ресторана</div>
                  <div className="HeaderUp__toggleMenuItemPhone">46-46-07</div>
                </Container>
              </Row>
            </a>

            <Row className="HeaderUp__toggleMenuItemTitle2 pl-3 pr-3">Социальные сети</Row>

            <Row className="pl-3 pr-3 mb-5 d-flex">
              <div className="mr-4">
                <RoundButton
                  icon="instagram.svg"
                  backgroundColor="white"
                  onClick={() => window.open('http://instagram.com')}
                />
              </div>
              <div>
                <RoundButton icon="vk.svg" backgroundColor="white" onClick={() => window.open('http://vk.com')} />
              </div>
            </Row>

            <Row className="pl-3 pr-3 d-flex justify-content-center">
              <div className="HeaderUp__toggleMenuButton d-flex">
                <div className="HeaderUp__toggleMenuButtonText">Войти в личный кабинет</div>
                <div className="HeaderUp__toggleMenuButtonIcon"><img src="images/icons/profile.svg" alt=""/></div>
              </div>
            </Row>
          </Container>
        </Container>
      </React.Fragment>
    )
  }
}
