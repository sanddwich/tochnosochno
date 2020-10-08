import React, { Component } from 'react'
import { YMaps, Map, Placemark } from 'react-yandex-maps'
import './MapPage.scss'

type MapPageState = {}

export class MapPage extends Component<{}, MapPageState> {
  componentWillMount() {}

  componentDidMount() {}

  render() {
    return (
      <div className="contacts">
        <div className="row m-0">
          <div className="col-lg-4 p-0">
            <div className="contacts__text">
              <h3>
                <span className="lined-text">Мы находимся</span>
              </h3>
              <ul className="contacts__address-list">
                <li className="contacts__address">
                  <img src="images/map-pin-line.svg" alt="MapPin" />
                  ул. Савушкина, 6к2
                </li>
                <li className="contacts__address">
                  <img src="images/map-pin-line.svg" alt="MapPin" />
                  ул. Фиолетова, 31
                </li>
                <li className="contacts__address">
                  <img src="images/map-pin-line.svg" alt="MapPin" />
                  ул. Софьи Перовской, 79
                </li>
                <li className="contacts__address">
                  <img src="images/map-pin-line.svg" alt="MapPin" />
                  ул. Богдана Хмельницкого, 9
                </li>
              </ul>
              <h3>
                <span className="lined-text">Служба доставки</span>
              </h3>
              <ul className="contacts__address-list">
                <li className="contacts__address">
                  <img src="images/phone-line.svg" alt="MapPin" />8 (851) 277-99-98
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-8 contacts__map">
            <YMaps>
              <Map className="contacts__map" defaultState={{ center: [46.340439, 48.050658], zoom: 14 }}>
                <Placemark geometry={[46.350439, 48.028658]} />
                <Placemark geometry={[46.34672, 48.07]} />
                <Placemark geometry={[46.333927, 48.015232]} />
                <Placemark geometry={[46.375727, 48.049519]} />
              </Map>
            </YMaps>
          </div>
        </div>
      </div>
    )
  }
}
