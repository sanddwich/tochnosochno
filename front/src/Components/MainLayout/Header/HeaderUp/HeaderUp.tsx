import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { RootState } from '../../../../Redux'
import ProductModal from '../../../../SharedComponents/ProductModal/ProductModal'
import ComboCardModal from '../../../../SharedComponents/ComboCardModal/ComboCardModal'
import RoundButton from '../../../../SharedComponents/RoundButton/RoundButton'
import * as Scroll from 'react-scroll'
import { showLoginModal } from '../../../../Redux/actions/app'
import { animateScroll } from 'react-scroll'

import './HeaderUp.scss'
import CartRoundButton from '../../../../SharedComponents/CartRoundButton/CartRoundButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSortUp } from '@fortawesome/free-solid-svg-icons'

interface HeaderUpProps {
  isAuth: boolean
  showLogin: boolean
  showLoginModal: () => void
  showComboModal: boolean
}

interface HeaderUpState {
  toggleMenu: boolean
}

class HeaderUp extends React.Component<HeaderUpProps, HeaderUpState> {
  constructor(props: HeaderUpProps) {
    super(props)
    this.state = {
      toggleMenu: true,
    }
  }

  componentDidMount() {
    document.addEventListener('scroll', () => {
      const elem = document.querySelector('#ToTopArrow') as HTMLElement
      if (window.pageYOffset > 300) {
        elem.style.display = 'block'
      } else {
        elem.style.display = 'none'
      }
    })
  }

  noAction = (): void => {}

  burgerButtonClick = (): void => {
    const toggleMenu = this.state.toggleMenu
    const element = (document.querySelector('.HeaderUp__toggleMenu') as HTMLElement) as HTMLElement
    toggleMenu ? (element.style.display = 'block') : (element.style.display = 'none')

    this.setState({ toggleMenu: !this.state.toggleMenu })
  }

  render() {
    return (
      <React.Fragment>
        <div id="ToTopArrow">
          <div id="ToTopArrow__cont" onClick={() => animateScroll.scrollToTop()}>
            <FontAwesomeIcon icon={faSortUp} size="2x" />
          </div>
        </div>

        {/* <ComboCardModal key={this.props.comboModalElement.id} /> */}
        <ComboCardModal key={this.props.showComboModal.toString()} />
        <ProductModal />

        <Container className="HeaderUp p-0 d-none d-lg-flex justify-content-between align-items-center">
          <NavLink className="hvr-underline" to="/actions" onClick={() => Scroll.animateScroll.scrollToTop()}>
            <div className="HeaderUp__menuItem">Акции</div>
          </NavLink>
          <div className="HeaderUp__menuItem">Соц.сети:</div>
          <div className="HeaderUp__menuItem">
            <Row className="m-0 p-0">
              <Col className="m-0 p-0">
                <RoundButton
                  backgroundColor="#303030"
                  icon="insta_white.svg"
                  onClick={() => window.open('http://instagram.com')}
                />
              </Col>
              <Col className="">
                <RoundButton
                  backgroundColor="#303030"
                  icon="vk_white.svg"
                  onClick={() => window.open('http://vk.com')}
                  // onClick={this.props.showComboModal}
                />
              </Col>
            </Row>
          </div>

          <NavLink className="hvr-underline" to="/contacts">
            <div className="HeaderUp__menuItem">Контакты</div>
          </NavLink>

          <div className="HeaderUp__menuItem">
            <NavLink to="/" exact>
              <div className="HeaderUp__menuLogo">
                <img src="/images/logo_white.svg" alt="" />
              </div>
            </NavLink>
          </div>
          <div className="HeaderUp__menuItem d-flex justify-content-between">
            <Row className="HeaderUp__container p-0 m-0 d-flex align-items-center">
              <div className="HeaderUp__containerImg">
                <a href="tel:88512464607">
                  <RoundButton backgroundColor="#303030" icon="nyamnyan_white.svg" onClick={() => this.noAction()} />
                </a>
              </div>
              <div className="HeaderUp__containerDescr pl-2">
                <a href="tel:88512464607">
                  <div className="HeaderUp__containerDescrPhone">46-46-07</div>
                  <div className="HeaderUp__containerDescrTitle">номер ресторана</div>
                </a>
              </div>
            </Row>
          </div>
          <div className="HeaderUp__menuItem d-flex justify-content-between">
            <Row className="HeaderUp__container p-0 m-0 d-flex align-items-center">
              <a href="tel:88512464602">
                <div className="HeaderUp__containerImg">
                  <RoundButton backgroundColor="#303030" icon="car_white.svg" onClick={() => this.noAction()} />
                </div>
              </a>
              <div className="HeaderUp__containerDescr pl-2">
                <a href="tel:88512464602">
                  <div className="HeaderUp__containerDescrPhone">46-46-02</div>
                  <div className="HeaderUp__containerDescrTitle">служба доставки</div>
                </a>
              </div>
            </Row>
          </div>
          <div className="HeaderUp__menuItem">
            <Row className="m-0 p-0">
              <Col className="m-0 p-0">
                <NavLink to="/cart">
                  <CartRoundButton
                    backgroundColor="#303030"
                    icon="cart_white.svg"
                    onClick={() => Scroll.animateScroll.scrollToTop()}
                  />
                </NavLink>
              </Col>
              <Col className="">
                {this.props.isAuth ? (
                  <NavLink to="/profile">
                    <RoundButton backgroundColor="#303030" icon="user_white.svg" onClick={() => this.noAction()} />
                  </NavLink>
                ) : (
                  <RoundButton backgroundColor="#303030" icon="user_white.svg" onClick={this.props.showLoginModal} />
                )}
              </Col>
            </Row>
          </div>
        </Container>

        <Container fluid className="HeaderUp__mobile pl-4 pr-4 m-0 d-flex d-lg-none justify-content-between">
          <div className="menuItem h-100 d-flex align-items-center" onClick={() => this.burgerButtonClick()}>
            <img id="burgerButton" src="/images/burger.svg" />
          </div>

          <NavLink to="/">
            <div className="menuItem h-100 d-flex align-items-center">
              <img src="/images/logo_mob.svg" />
            </div>
          </NavLink>

          <div className="menuItem h-100 d-flex align-items-center">
            <div style={{ marginRight: '5px' }}>
              <NavLink to="/cart">
                <CartRoundButton
                  backgroundColor="#303030"
                  icon="cart_white.svg"
                  onClick={() => {
                    Scroll.animateScroll.scrollToTop()
                  }}
                />
              </NavLink>
            </div>
            <div>
              {this.props.isAuth ? (
                <NavLink to="/profile">
                  <RoundButton backgroundColor="#303030" icon="user_white.svg" onClick={() => this.noAction()} />
                </NavLink>
              ) : (
                <RoundButton
                  backgroundColor="#303030"
                  icon="user_white.svg"
                  onClick={() => {
                    this.props.showLoginModal()
                  }}
                />
              )}
            </div>
          </div>
        </Container>

        <Container fluid className="HeaderUp__toggleMenu p-0 m-0">
          <Container fluid className="HeaderUp__mobile pl-4 pr-4 m-0 d-flex d-lg-none justify-content-between">
            <div className="menuItem h-100 d-flex align-items-center" onClick={() => this.burgerButtonClick()}>
              <img id="burgerButton" src="/images/burger_close.svg" />
            </div>

            <div className="menuItem h-100 d-flex align-items-center">
              <NavLink
                to="/"
                onClick={() => {
                  this.burgerButtonClick()
                }}
              >
                <img src="/images/logo_mob.svg" />
              </NavLink>
            </div>
            <div className="menuItem h-100 d-flex align-items-center">
              <div style={{ marginRight: '5px' }}>
                <NavLink to="/cart">
                  <CartRoundButton
                    backgroundColor="#303030"
                    icon="cart_white.svg"
                    onClick={() => {
                      this.burgerButtonClick()
                      Scroll.animateScroll.scrollToTop()
                    }}
                  />
                </NavLink>
              </div>
              <div>
                {this.props.isAuth ? (
                  <NavLink to="/profile">
                    <RoundButton
                      backgroundColor="#303030"
                      icon="user_white.svg"
                      onClick={() => this.burgerButtonClick()}
                    />
                  </NavLink>
                ) : (
                  <RoundButton
                    backgroundColor="#303030"
                    icon="user_white.svg"
                    onClick={() => {
                      this.burgerButtonClick()
                      this.props.showLoginModal()
                    }}
                  />
                )}
              </div>
            </div>
          </Container>

          <Container fluid className="HeaderUp__toggleMenuCont">
            <NavLink to="/actions" onClick={() => this.burgerButtonClick()}>
              <Row className="pl-3 pr-3 mt-3">
                <Col xs={8} className="HeaderUp__toggleMenuItem p-0 m-0">
                  <h1>Акции</h1>
                </Col>
              </Row>
            </NavLink>
            <NavLink to="/contacts" onClick={() => this.burgerButtonClick()}>
              <Row className="pl-3 pr-3 mt-3">
                <Col xs={8} className="HeaderUp__toggleMenuItem p-0 m-0">
                  <h1>Контакты</h1>
                </Col>
              </Row>
            </NavLink>

            <a href="tel:88512464602" onClick={() => this.burgerButtonClick()}>
              <Row className="pl-3 pr-3">
                <Container fluid className="HeaderUp__toggleMenuItem2 p-0 m-0 mt-5 d-flex justify-content-between">
                  <div className="HeaderUp__toggleMenuItemTitle">Телефон доставки</div>
                  <div className="HeaderUp__toggleMenuItemPhone">46-46-02</div>
                </Container>
              </Row>
            </a>
            <a href="tel:88512464607" onClick={() => this.burgerButtonClick()}>
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
                  onClick={() => {
                    this.burgerButtonClick()
                    window.open('http://instagram.com')
                  }}
                />
              </div>
              <div>
                <RoundButton
                  icon="vk.svg"
                  backgroundColor="white"
                  onClick={() => {
                    this.burgerButtonClick()
                    window.open('http://vk.com')
                  }}
                />
              </div>
            </Row>

            <Row className="pl-3 pr-3 d-flex justify-content-center">
              {this.props.isAuth ? (
                <NavLink to="/profile" onClick={() => this.burgerButtonClick()}>
                  <div className="HeaderUp__toggleMenuButton d-flex">
                    <div className="HeaderUp__toggleMenuButtonText">Войти в личный кабинет</div>
                    <div className="HeaderUp__toggleMenuButtonIcon">
                      <img src="/images/icons/profile.svg" alt="" />
                    </div>
                  </div>
                </NavLink>
              ) : (
                <div
                  className="HeaderUp__toggleMenuButton d-flex"
                  onClick={() => {
                    this.burgerButtonClick()
                    this.props.showLoginModal()
                  }}
                >
                  <div className="HeaderUp__toggleMenuButtonText">Войти в личный кабинет</div>
                  <div className="HeaderUp__toggleMenuButtonIcon">
                    <img src="/images/icons/profile.svg" alt="" />
                  </div>
                </div>
              )}
            </Row>
          </Container>
        </Container>
      </React.Fragment>
    )
  }
}

const mapDispatchToProps = {
  showLoginModal,
}

const mapStateToProps = (state: RootState) => {
  const { showLogin, showComboModal } = state.app
  const { isAuth } = state.auth
  return {
    isAuth,
    showLogin,
    showComboModal,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderUp)
