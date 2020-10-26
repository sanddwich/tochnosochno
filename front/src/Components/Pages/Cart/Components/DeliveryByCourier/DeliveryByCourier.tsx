import React from 'react'
import { Container } from 'react-bootstrap'
import { connect } from 'react-redux'
import Street from '../../../../../Interfaces/Street'
import ActionButton from '../../../../../SharedComponents/ActionButton/ActionButton'
import CookingTime from '../../../../../SharedComponents/CookingTime/CookingTime'
import OrderTotalPrice from '../../../../../SharedComponents/OrderTotalPrice/OrderTotalPrice'
import PaymentSection from '../../../../../SharedComponents/PaymentSection/PaymentSection'
import PoliticSection from '../../../../../SharedComponents/PoliticSection/PoliticSection'
import RadioButton from '../../../../../SharedComponents/RadioButton/RadioButton'

import { getStreetVariants } from '../../../../../Redux/actions/order'

import './DeliveryByCourier.scss'

interface DeliveryByCourierProps {
  getStreetVariants: any
}

interface DeliveryByCourierState {
  isDelivery: boolean
}

class DeliveryByCourier extends React.Component<DeliveryByCourierProps, DeliveryByCourierState> {
  constructor(props: DeliveryByCourierProps) {
    super(props)
  }

  getStreetsFromIiko = async (street: string) => {
    if (street.length % 4 === 0 && street.length > 0) {
      const streetVariants: Street[] = await this.props.getStreetVariants(street)
      const streetInput = document.getElementById('street') as HTMLInputElement
      const datalist = document.getElementById('list-street')
      let options: String[] = []
      if (datalist && streetInput) {
        streetVariants.map((street) => {
          options.push(
            `<option value="${street.name}" data-id=${street.id}>${street.city?.name} ${street.name}</option>`
          )
        })
        datalist.innerHTML = options.join('')
      }
    }
  }

  render() {
    return (
      <Container className="DeliveryByCourier p-0  mt-5">
        <form className="DeliveryByCourier__form">
          <div className="DeliveryByCourier__form__group">
            <div className="DeliveryByCourier__form__row">
              <label htmlFor="city">Населённый пункт*</label>
              <input
                className="DeliveryByCourier__form__street"
                id="city"
                type="text"
                placeholder="Укажите населённый пункт"
              />
            </div>
          </div>
          <div className="DeliveryByCourier__form__row">
            <div className="DeliveryByCourier__form__group">
              <label htmlFor="street">Улица*</label>
              <input
                onKeyPress={(e: React.FormEvent<HTMLInputElement>) => {
                  this.getStreetsFromIiko(e.currentTarget.value)
                }}
                className="DeliveryByCourier__form__street"
                id="street"
                type="text"
                placeholder="Укажите улицу"
              />
            </div>
            <datalist id="list-street"></datalist>
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
            <PaymentSection isDelivery={true} />
            <ActionButton
              onClick={() => console.log('process Order')}
              textColor="white"
              width="280px"
              text="Завершить заказ"
              backgroundColor="#303030"
              icon="cart_dark.svg"
            />
          </div>
        </form>
      </Container>
    )
  }
}

const mapDispatchToProps = {
  getStreetVariants,
}

const mapStateToProps = (state: any) => {
  const { loading, error } = state.auth
  const { loading: loadingOrder, error: errorOrder } = state.order
  return {
    loading: loading,
    error: error,
    loadingOrder: loadingOrder,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeliveryByCourier)
