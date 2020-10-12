import React from 'react'
import RoundButton from '../../../SharedComponents/RoundButton/RoundButton'
import './Footer.scss'

interface FooterProps {}

interface FooterState {}

export default class Footer extends React.Component<FooterProps, FooterState> {
  render() {
    return (
      <footer className="footer">
        <div className="container ">
          <div className="row">
            <div className="col-md-7 d-flex">
              <div className="row ">
                <div className="col-5">
                  <img src="images/logo.svg" alt="Logo" />
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
              <div className="footer__worktime">Часы работы ресторана с 10:00 - 00:00</div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-5">
              <div className="footer__contacts">
                <div className="row mt-3">
                  <div className="col-6 pr-0">
                    <div className="footer__contacts__title">Телефон ресторана</div>
                    <div className="footer__contacts__phone"> 46-46-07</div>
                  </div>
                  <div className="col-6 pr-0">
                    <div className="footer__contacts__title">Телефон доставки</div>
                    <div className="footer__contacts__phone"> 46-46-02</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="footer__policy">
                <a href="">
                  <div>Политика конфиденциальности</div>
                </a>
                <a href="">
                  <div>Правила продажи товаров на сайте</div>
                </a>
              </div>
            </div>

            <div className="col-md-3 pr-0">
              <div className="footer__copyright">
                Сайт разработан
                <a href="https://deedesign.ru">
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
