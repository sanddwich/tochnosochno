import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { connect } from 'react-redux'
import { RootState } from '../../../Redux'
import ActionButton from '../../../SharedComponents/ActionButton/ActionButton'
import RoundButton from '../../../SharedComponents/RoundButton/RoundButton'
import './Footer.scss'

interface FooterProps {
  organizationId: string
}

interface FooterState {}

class Footer extends React.Component<FooterProps, FooterState> {
  render() {
    return (
      <footer className="footer">
        <div className="container ">
          <div className="row">
            <div className="col-md-7 d-flex">
              <div className="row ">
                <div className="col-5">
                  <img src="/images/logo.svg" alt="Logo" />
                </div>
                <div className="col-1"></div>

                <div className="col-6 footer__social">
                  <div className="row ">
                    <div className="col-md-9 align-middle">Социальные сети</div>
                    <div className="col-xl-3 d-flex">
                      <div className="ml-1">
                        <RoundButton
                          icon="instagram.svg"
                          backgroundColor="white"
                          onClick={() => window.open('http://instagram.com')}
                        />
                      </div>
                      <div className="ml-3">
                        <RoundButton
                          icon="vk.svg"
                          backgroundColor="white"
                          onClick={() => window.open('http://vk.com')}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-5 ">
              <div className="footer__worktime">Работаем КРУГЛОСУТОЧНО</div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-5">
              <div className="footer__contacts">
                {this.props.organizationId === 'c753337b-ccd2-4c3b-a605-0c8c23c20057' ? (
                  <div className="row mt-3">
                    <div className="col-6 pr-0">
                      <div className="footer__contacts__title">Телефон ресторана</div>
                      <div className="footer__contacts__phone"> 46-46-00</div>
                    </div>
                    <div className="col-6 pr-0">
                      <div className="footer__contacts__title">Телефон доставки</div>
                      <div className="footer__contacts__phone"> 46-46-02</div>
                      <div className="footer__contacts__phone"> 46-46-07</div>
                    </div>
                  </div>
                ) : (
                  <div className="row mt-3">
                    <div className="col-6 pr-0">
                      <div className="footer__contacts__title">Телефон ресторана</div>
                      <div className="footer__contacts__phone"> 78-00-78</div>
                    </div>
                    <div className="col-6 pr-0">
                      <div className="footer__contacts__title">Телефон доставки</div>
                      <div className="footer__contacts__phone"> 78-00-78</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="col-md-4">
              <div className="footer__policy">
                <a className="hvr-underline" href="">
                  <div>Политика конфиденциальности</div>
                </a>
                <a className="hvr-underline" href="">
                  <div>Правила продажи товаров на сайте</div>
                </a>
              </div>
            </div>

            <div className="col-md-3 pr-0">
              <div className="footer__copyright">
                Сайт разработан
                <a className="hvr-underline" href="https://deedesign.ru">
                  <span className="bold"> deedesign</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    )
  }
}

const mapDispatchToProps = {}

const mapStateToProps = (state: RootState) => {
  const { organizationId } = state.app

  return {
    organizationId,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Footer)
