import React from 'react'
import RoundButton from '../../../SharedComponents/RoundButton/RoundButton'
import './Footer.scss'

interface FooterProps {}

interface FooterState {}

export default class Footer extends React.Component<FooterProps, FooterState> {
  render() {
    return (
      <footer className="footer">
        <div className="container p-5">
          <div className="row">
            <div className="col-md-6 d-flex">
              <div className="row">
                <img src="images/logo.svg" alt="Logo" />
                <div className="footer__social">
                  Социальные сети
                  <RoundButton
                    icon="instagram.svg"
                    backgroundColor="white"
                    onClick={() => window.open('http://instagram.com')}
                  />
                  <RoundButton icon="vk.svg" backgroundColor="white" onClick={() => window.open('http://vk.com')} />
                </div>
                <div className="footer__contacts">
                  <div className="row">
                    <div className="col-6 m-0 p-0">
                      <div className="footer__contats__title">Телефон ресторана</div>
                      <div className="footer__contats__phone"> 46-46-07</div>
                    </div>
                    <div className="col-6 m-0 p-0">
                      <div className="footer__contats__title">Телефон доставки</div>
                      <div className="footer__contats__phone"> 46-46-02</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row"></div>
            </div>

            <div className="col-md-3"></div>

            <div className="col-md-3"></div>
          </div>
        </div>
      </footer>
    )
  }
}
