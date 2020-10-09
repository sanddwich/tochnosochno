import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import RoundButton from '../../../../SharedComponents/RoundButton/RoundButton'

import './HeaderUp.scss'

interface HeaderUpProps {}

interface HeaderUpState {}

export default class HeaderUp extends React.Component<HeaderUpProps, HeaderUpState> {
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

  render() {
    return (
      <Container className="HeaderUp p-0 d-flex justify-content-between align-items-center">
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
          <NavLink
            to="/"
            exact
          >
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
              <RoundButton backgroundColor="#303030" icon="user_white.svg" onClick={() => this.profileButtonClick()} />
            </Col>
          </Row>
        </div>
      </Container>
    )
  }
}
