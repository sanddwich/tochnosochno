import React from 'react'
import { Container } from 'react-bootstrap'
import { connect } from 'react-redux'
import { YMaps, Map, Placemark } from 'react-yandex-maps'
import { RootState } from '../../../../../Redux'
import ActionButton from '../../../../../SharedComponents/ActionButton/ActionButton'
import CookingTime from '../../../../../SharedComponents/CookingTime/CookingTime'
import Loader from '../../../../../SharedComponents/Loader/Loader'
import OrderTotalPrice from '../../../../../SharedComponents/OrderTotalPrice/OrderTotalPrice'
import PaymentSection from '../../../../../SharedComponents/PaymentSection/PaymentSection'
import PoliticSection from '../../../../../SharedComponents/PoliticSection/PoliticSection'
import { showLoginModal } from '../../../../../Redux/actions/app'
import { setPhone } from '../../../../../Redux/actions/auth'
import InputMask from 'react-input-mask'

import './DeliveryByClient.scss'
import { DeliveryAddressValidation } from '../../../../../Interfaces/DeliveryAddressValidation'
import Customer from '../../../../../Interfaces/Customer'

interface DeliveryByClientProps {
  ruleCheck: boolean
  smsCheck: boolean
  personCheck: boolean
  isAuth: boolean
  showLoginModal: () => void
  setPhone: (phone: string) => void
  phone: string
  customer: Customer
}

interface DeliveryByClientState {
  loading: boolean
  validationTextfields: DeliveryAddressValidation[]
}

class DeliveryByClient extends React.Component<DeliveryByClientProps, DeliveryByClientState> {
  constructor(props: DeliveryByClientProps) {
    super(props)
    this.state = {
      loading: true,
      validationTextfields: [
        {
          name: 'phone',
          minLength: 10,
          required: true,
          touched: false,
          isValid: false,
        },
      ],
    }
  }

  processOrder = () => {
    if (!this.props.isAuth) {
      this.props.showLoginModal()
    }
  }

  setLoading = (loading: boolean) => {
    this.setState({ loading })
  }

  textFieldInputHandler = (value: string, textFieldName: string): void => {
    const state = this.state
    let phone = ''

    // textFieldName === 'name' && (state.deliveryAddress.name = value)
    // textFieldName === 'street' && (state.deliveryAddress.street.name = value)
    textFieldName === 'phone' && this.props.setPhone(value)

    state.validationTextfields.map((textfield) => {
      if (textfield.name === textFieldName) {
        let isValid = true
        Object.keys(textfield).map((key) => {
          if (key === 'required') {
            isValid = isValid && value.trim() !== ''
          }
          if (key === 'minLength') {
            isValid = isValid && value.trim().length > textfield.minLength
          }
        })
        textfield.touched = true
        textfield.isValid = isValid
      }
    })

    this.setState({ ...state })
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
                <input
                  onInput={(e: React.FormEvent<HTMLInputElement>) => {
                    this.textFieldInputHandler(e.currentTarget.value, 'name')
                  }}
                  value={this.props.customer?.name || ''}
                  className="DeliveryByClient__form__name"
                  id="name"
                  type="text"
                  placeholder="Николай.."
                />
              </div>
              <div className="DeliveryByClient__form__group">
                <label htmlFor="phone">Телефон*</label>
                <InputMask
                  mask="8(999) 999-99-99"
                  value={this.props.phone || this.props.customer?.phone.substring(2)}
                  onInput={(e: React.FormEvent<HTMLInputElement>) => {
                    this.textFieldInputHandler(e.currentTarget.value, 'phone')
                  }}
                  maskChar=" "
                >
                  {(inputProps: any) => (
                    <input
                      {...inputProps}
                      id="phone"
                      // className={`${this.state.phoneError && !this.state.phoneValid ? 'error' : ''} ${
                      //   this.state.phoneValid ? 'correct' : ''
                      // }`}
                      type="text"
                      placeholder="8 (999) 123-45-67"
                    />
                  )}
                </InputMask>
              </div>
            </div>
            <div className="DeliveryByClient__form__row">
              <div className="DeliveryByClient__form__group">
                <label htmlFor="email">E-mail</label>
                <input
                  onInput={(e: React.FormEvent<HTMLInputElement>) => {
                    this.textFieldInputHandler(e.currentTarget.value, 'email')
                  }}
                  id="email"
                  type="text"
                  placeholder="tochno-sochno@mail.ru"
                />
              </div>
            </div>
            <CookingTime />
            <OrderTotalPrice />

            <PoliticSection />
            <PaymentSection isDelivery={false} />
            <ActionButton
              disabled={!(this.props.ruleCheck && this.props.smsCheck && this.props.personCheck)}
              onClick={() => this.processOrder()}
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

const mapDispatchToProps = {
  showLoginModal,
  setPhone,
}

const mapStateToProps = (state: RootState) => {
  const { isAuth, phone, customer } = state.auth
  const { smsCheck, ruleCheck, personCheck } = state.order
  return {
    isAuth,
    smsCheck,
    ruleCheck,
    personCheck,
    phone,
    customer,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeliveryByClient)
