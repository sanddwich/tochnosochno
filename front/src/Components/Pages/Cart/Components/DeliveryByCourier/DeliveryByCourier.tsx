import React from 'react'
import { Container } from 'react-bootstrap'
import ActionButton from '../../../../../SharedComponents/ActionButton/ActionButton'
import CookingTime from '../../../../../SharedComponents/CookingTime/CookingTime'
import OrderTotalPrice from '../../../../../SharedComponents/OrderTotalPrice/OrderTotalPrice'
import PaymentSection from '../../../../../SharedComponents/PaymentSection/PaymentSection'
import PoliticSection from '../../../../../SharedComponents/PoliticSection/PoliticSection'
import RadioButton from '../../../../../SharedComponents/RadioButton/RadioButton'

import './DeliveryByCourier.scss'

interface DeliveryByCourierProps {}

interface DeliveryByCourierState {
  isDelivery: boolean
}

export default class DeliveryByCourier extends React.Component<DeliveryByCourierProps, DeliveryByCourierState> {
  constructor(props: DeliveryByCourierProps) {
    super(props)
  }

  render() {
    return (
      <Container className="DeliveryByCourier p-0  mt-5">
        <form className="DeliveryByCourier__form">
          <div className="DeliveryByCourier__form__row">
            <div className="DeliveryByCourier__form__group">
              <label htmlFor="street">Улица*</label>
              <input className="DeliveryByCourier__form__street" id="street" type="text" placeholder="Укажите улицу" />
            </div>
            <div className="DeliveryByCourier__form__group">
              <label htmlFor="house">Дом*</label>
              <input id="house" type="text" placeholder="16/1" />
            </div>
          </div>
          <div className="DeliveryByCourier__form__row">
            <div className="DeliveryByCourier__form__group">
              <label htmlFor="name">Ваше имя*</label>
              <input id="name" type="text" placeholder="Николай.." />
            </div>
            <div className="DeliveryByCourier__form__group">
              <label htmlFor="phone">Телефон*</label>
              <input id="phone" type="text" placeholder="+7 (999) 123-45-67" />
            </div>
          </div>
          <div className="DeliveryByCourier__form__row">
            <div className="DeliveryByCourier__form__group">
              <label htmlFor="entrance">Подъезд*</label>
              <input className="DeliveryByCourier__form__number" id="entrance" type="text" placeholder="1" />
            </div>
            <div className="DeliveryByCourier__form__group">
              <label htmlFor="floor">Этаж*</label>
              <input className="DeliveryByCourier__form__number" id="floor" type="text" placeholder="3" />
            </div>
            <div className="DeliveryByCourier__form__group">
              <label htmlFor="flat">Квартира*</label>
              <input className="DeliveryByCourier__form__number" id="flat" type="text" placeholder="74" />
            </div>
            <div className="DeliveryByCourier__form__group">
              <label htmlFor="email">E-mail</label>
              <input id="email" type="text" placeholder="tochno-sochno@mail.ru" />
            </div>
            <CookingTime />

            <div className="DeliveryByCourier__form__group w-100">
              <label htmlFor="comment">Комментарий к заказу</label>
              <textarea
                className="w-100"
                id="comment"
                placeholder="Пожалуйста, укажите здесь любую информацию, которая поможет курьеру быстрее доставить вам заказа"
              />
            </div>
            <div className="w-100">
              <OrderTotalPrice />
            </div>

            <PoliticSection />
            <PaymentSection />
            <ActionButton
              onClick={() => console.log('process Order')}
              textColor="white"
              width="280px"
              text="Завершить заказ"
              backgroundColor="#303030"
              icon="cart_dark.svg"
              hideTextMobile={true}
            />
          </div>
        </form>
      </Container>
    )
  }
}
