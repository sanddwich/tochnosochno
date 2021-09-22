import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { connect } from 'react-redux'
import Organization from '../../../Interfaces/Organization'
import { RootState } from '../../../Redux'
import ActionButton from '../../../SharedComponents/ActionButton/ActionButton'
import RoundButton from '../../../SharedComponents/RoundButton/RoundButton'
import './Footer.scss'

interface FooterProps {
  organizationId: string
  organizations: Organization[]
}

interface FooterState {}

class Footer extends React.Component<FooterProps, FooterState> {
  getRestrauntPhones() {
    return this.getCurrentOrganization()?.restraunt_phones.split(' ')
  }

  getDeliveryPhones() {
    return this.getCurrentOrganization()?.delivery_phones.split(' ')
  }

  getCurrentOrganization() {
    return this.props.organizations.find((organization) => organization.id === this.props.organizationId)
  }

  getWorkTime() {
    return this.getCurrentOrganization()?.workTime
  }

  getAdditionalInfo() {
    return this.getCurrentOrganization()?.additionalInfo
  }

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
              <div className="footer__worktime">Работаем {this.getWorkTime()}</div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-5">
              <div className="footer__contacts">
                <div className="row mt-3">
                  <div className="col-6 pr-0">
                    <div className="footer__contacts__title">Телефон ресторана</div>
                    {this.getRestrauntPhones()?.map((phone) => {
                      return (
                        <div key={phone} className="footer__contacts__phone">
                          {phone}
                        </div>
                      )
                    })}
                  </div>
                  <div className="col-6 pr-0">
                    <div className="footer__contacts__title">Телефон доставки</div>
                    {this.getDeliveryPhones()?.map((phone) => {
                      return (
                        <div key={phone} className="footer__contacts__phone">
                          {phone}
                        </div>
                      )
                    })}
                  </div>
                </div>
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
  const { organizations } = state.menu

  return {
    organizationId,
    organizations,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Footer)
