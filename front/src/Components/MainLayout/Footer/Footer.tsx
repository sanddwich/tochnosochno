import React, { Component } from 'react'
import './Footer.scss'

type FooterState = {}

export class Footer extends Component<{}, FooterState> {
  componentWillMount() {}

  componentDidMount() {}

  render() {
    return (
      <div className="footer">
        <div className="container">
          <div className="d-lg-flex justify-content-between">
            <p className="footer__policy">Политика конфиденциальности</p>
            <div className="container w-50">
              <div className="d-lg-flex justify-content-around">
                <p className="footer__instagram">
                  <a href="https://www.instagram.com/myaso__myaso/">
                    <img src="images/instagram-line-white.svg" alt="Instagram" />
                  </a>
                </p>
                <p className="footer__phone">
                  <a href="tel:123-456-7890">8(851) 277-99-98</a>
                </p>
              </div>
            </div>
            <p className="footer__deedesign">
              <a href="https://deedesign.ru">Сайт разработан - deedesign.ru</a>
            </p>
          </div>
        </div>
      </div>
    )
  }
}
