import React from 'react'
import { Container } from 'react-bootstrap'
import { YMaps, Map, Placemark } from 'react-yandex-maps'
import BlockName from '../../../SharedComponents/BlockName/BlockName'

import './Contacts.scss'

interface ContactsProps {}

interface ContactsState {}

export default class Contacts extends React.Component<ContactsProps, ContactsState> {
  render() {
    return (
      <div className="contacts container mt-5">
        <div className="row">
          <div className="col-md-5">
            <BlockName name="Рестораны" />
            <div className="contacts__address">
              <img src="images/icons/map-pin.svg" alt="" />
              <div className="contacts__address__text">Кирова 27</div>
            </div>
            <div className="contacts__address">
              <img src="images/icons/map-pin.svg" alt="" />
              <div className="contacts__address__text">Жилая 12</div>
            </div>
          </div>
          <div className="col-md-7 contacts__delivery">
            <BlockName name="Доставка" />

            <div className="row contacts__delivery__row">
              <div className="col-sm-6 pt-3">Работаем с 8:00 до 00:00</div>
              <div className="col-sm-6 pt-3">
                Минимальный заказ от <span className="bold">500</span> руб
              </div>
            </div>
            <div className="row contacts__delivery__row">
              <div className="col-sm-6 pt-3">
                Время доставки 60 минут*
                <div className="footnote">*или бесплатная пицца</div>
              </div>

              <div className="col-sm-6 pt-3">Доставка от 0 до 300 руб</div>
            </div>
          </div>
        </div>
        <div className="contacts__map mt-4">
          <YMaps>
            <Map
              className="contacts__map__yandex"
              defaultState={{
                center: [46.347801, 48.037095],
                zoom: 17,
                geometry: { type: 'Point', coordinates: [46.400285, 48.09156] },
              }}
            >
              <Placemark geometry={[46.347801, 48.037095]} />
              <Placemark geometry={[46.405095, 48.090833]} />
            </Map>
          </YMaps>
        </div>
      </div>
    )
  }
}
