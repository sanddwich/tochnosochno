import React from 'react'
import { Container } from 'react-bootstrap'
import { YMaps, Map, Placemark } from 'react-yandex-maps'
import ActionButton from '../../../../../SharedComponents/ActionButton/ActionButton'
import CookingTime from '../../../../../SharedComponents/CookingTime/CookingTime'
import Loader from '../../../../../SharedComponents/Loader/Loader'
import OrderTotalPrice from '../../../../../SharedComponents/OrderTotalPrice/OrderTotalPrice'
import PaymentSection from '../../../../../SharedComponents/PaymentSection/PaymentSection'
import PoliticSection from '../../../../../SharedComponents/PoliticSection/PoliticSection'

import './DeliveryByClient.scss'

interface DeliveryByClientProps {}

interface DeliveryByClientState {
  loading: boolean
}

export default class DeliveryByClient extends React.Component<DeliveryByClientProps, DeliveryByClientState> {
  constructor(props: DeliveryByClientProps) {
    super(props)
    this.state = {
      loading: true,
    }
  }

  setLoading = (loading: boolean) => {
    this.setState({ loading })
  }

  render() {
    console.log(this.state.loading)
    return (
      <Container className="DeliveryByClient  mt-5">
        <div hidden={this.state.loading}>
          <div className="DeliveryByClient__address mt-4">
            <div className="DeliveryByClient__address__label">Адрес самовывоза</div>

            <div className="DeliveryByClient__address__street">
              <img src="/images/icons/map-pin.svg" alt="MapPin" />
              Кирова 27
            </div>
          </div>

          <div className="DeliveryByClient__map mt-4">
            <YMaps>
              <Map
                onLoad={() => this.setLoading(false)}
                onError={() => this.setLoading(false)}
                className="DeliveryByClient__map__yandex"
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
          <form className="DeliveryByClient__form">
            <div className="DeliveryByClient__form__row">
              <div className="DeliveryByClient__form__group">
                <label htmlFor="name">Ваше имя*</label>
                <input className="DeliveryByClient__form__name" id="name" type="text" placeholder="Николай.." />
              </div>
              <div className="DeliveryByClient__form__group">
                <label htmlFor="phone">Телефон*</label>
                <input id="phone" type="text" placeholder="+7 (999) 123-45-67" />
              </div>
            </div>
            <div className="DeliveryByClient__form__row">
              <div className="DeliveryByClient__form__group">
                <label htmlFor="email">E-mail</label>
                <input id="email" type="text" placeholder="tochno-sochno@mail.ru" />
              </div>
            </div>
            <CookingTime />
            <OrderTotalPrice />

            <PoliticSection />
            <PaymentSection isDelivery={false} />
            <ActionButton
              onClick={() => console.log('process Order')}
              textColor="white"
              width="280px"
              text="Завершить заказ"
              backgroundColor="#303030"
              icon="cart_dark.svg"
            />
          </form>
        </div>

        <div hidden={!this.state.loading} className="DeliveryByClient__loader">
          <Loader />
        </div>
      </Container>
    )
  }
}
