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
import InputMask from 'react-input-mask'
import { setPhone } from '../../../../../Redux/actions/auth'
import { showLoginModal } from '../../../../../Redux/actions/app'
import {
  getStreetVariants,
  getCityVariants,
  getAllCities,
  getStreetsByCity,
  setDelivery,
  setPrepareDate,
  processOrder,
} from '../../../../../Redux/actions/order'

import './DeliveryByCourier.scss'
import City from '../../../../../Interfaces/City'
import Order from '../../../../../Interfaces/Order'
import Address from '../../../../../Interfaces/Address'
import { DeliveryAddressValidation } from '../../../../../Interfaces/DeliveryAddressValidation'
import Customer from '../../../../../Interfaces/Customer'
import * as Scroll from 'react-scroll'

interface DeliveryByCourierProps {
  getStreetVariants: any
  getCityVariants: any
  getAllCities: any
  getStreetsByCity: any
  order: Order
  phone: string
  setPhone: (phone: string) => void
  isAuth: boolean
  showLoginModal: () => void
  setDelivery: (isDelivery: boolean, address: Address) => void
  smsCheck: boolean
  ruleCheck: boolean
  personCheck: boolean
  customer: Customer
  processOrder: any
  loadingOrder: boolean
}

interface DeliveryByCourierState {
  isDelivery: boolean
  cityId: string
  deliveryAddress: Address
  validationTextfields: DeliveryAddressValidation[]
  phone: string
  validCity: boolean
  formSubmitted: boolean
}

class DeliveryByCourier extends React.Component<DeliveryByCourierProps, DeliveryByCourierState> {
  constructor(props: DeliveryByCourierProps) {
    super(props)
    this.state = {
      formSubmitted: false,
      validCity: false,
      isDelivery: true,
      cityId: '',
      deliveryAddress: this.props.order.address || {
        house: '',
        street: { name: '' },
        flat: '',
        comment: '',
        entrance: '',
        floor: '',
        name: '',
        id: '',
      },
      phone: '',
      validationTextfields: [
        {
          name: 'street',
          minLength: 3,
          required: true,
          touched: false,
          isValid: false,
        },
        {
          name: 'house',
          minLength: 0,
          required: true,
          touched: false,
          isValid: false,
        },
        {
          name: 'phone',
          minLength: 11,
          required: true,
          touched: false,
          isValid: false,
        },
      ],
    }
  }

  checkValidation = () => {
    if (this.state.cityId.length < 28) this.setState({ validCity: true })
  }

  componentDidMount() {
    this.selectCitiesFromIiko()
  }

  processOrder = () => {
    this.setState({ formSubmitted: true })

    let formValid: boolean = true
    let isCorrectStreet = false
    const dataList = document.getElementById('list-street')
    if (dataList) {
      const options = Array.from(dataList.children)
      options.map((option: any) => {
        if (option.value === this.state.deliveryAddress.street.name) {
          isCorrectStreet = true
        }
      })
    }
    const validationTextfields = this.state.validationTextfields
    validationTextfields.map((textfield) => {
      let isValid: boolean = true
      let value = ''
      textfield.name === 'street' && (value = this.state.deliveryAddress.street.name)
      textfield.name === 'house' && (value = this.state.deliveryAddress.house)
      textfield.name === 'phone' && (value = this.props.phone)

      if (textfield.required) {
        isValid = isValid && value.trim() !== ''
        if (textfield.name === 'street') {
          isValid = isCorrectStreet ? true : false
        }
      }
      if (textfield.minLength > 0) {
        isValid = isValid && value.trim().length > textfield.minLength
      }

      textfield.touched = true
      textfield.isValid = isValid

      formValid = formValid && isValid
    })

    if (formValid) {
      if (!this.props.isAuth) {
        this.props.showLoginModal()
      } else {
        this.props.processOrder()
      }
    } else {
      Scroll.scroller.scrollTo('formElement', {
        duration: 800,
        delay: 0,
        smooth: true,
        offset: -200,
      })
      this.setState({ validationTextfields })
    }
  }

  selectCitiesFromIiko = async () => {
    const cityVariants: City[] = await this.props.getAllCities()
    const citySelect = document.getElementById('city-select') as HTMLInputElement
    let options: String[] = []
    if (citySelect) {
      cityVariants.map((city) => {
        options.push(`<option value="${city.id}" data-id=${city.id}>${city.name}</option>`)
      })
      citySelect.innerHTML = citySelect.innerHTML + options.join('')
    }
  }

  getCitiesFromIiko = async (city: string) => {
    if (city.length % 4 === 0 && city.length > 0) {
      const cityVariants: City[] = await this.props.getCityVariants(city)
      const cityInput = document.getElementById('city') as HTMLInputElement
      const datalist = document.getElementById('list-city')
      let options: String[] = []
      if (datalist && cityInput) {
        cityVariants.map((city) => {
          options.push(`<option value="${city.id}" data-id=${city.id}>${city.name}</option>`)
        })
        datalist.innerHTML = options.join('')
      }
    }
  }

  getStreetsFromIiko = async (street: string) => {
    if (street.length % 4 === 0 && street.length > 0) {
      const streetVariants: Street[] = await this.props.getStreetsByCity(street, this.state.cityId)
      const streetInput = document.getElementById('street') as HTMLInputElement
      const datalist = document.getElementById('list-street')
      let options: String[] = []
      if (datalist && streetInput) {
        streetVariants.map((street) => {
          options.push(`<option value="${street.name}" data-id="${street.id}">${street.name}</option>`)
        })
        datalist.innerHTML = options.join('')
      }
    }
  }

  selectCity = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const state = this.state
    let validCity = true
    state.deliveryAddress.street.name = ''
    const datalist = document.getElementById('list-street')
    if (datalist) {
      datalist.innerHTML = ''
    }
    if (event.target.value.length < 28) validCity = false
    this.setState({ ...state, cityId: event.target.value, validCity })
  }

  getStreetId = (): string => {
    const dataList = document.getElementById('list-street')
    let streetId = ''
    if (dataList) {
      const options = Array.from(dataList.children)
      options.map((option: any) => {
        if (option.value === this.state.deliveryAddress.street.name) {
          streetId = option.dataset.id
        }
      })
    }
    return streetId
  }

  textFieldInputHandler = (value: string, textFieldName: string): void => {
    const state = this.state
    let phone = ''

    textFieldName === 'flat' && (state.deliveryAddress.flat = value)
    textFieldName === 'comment' && (state.deliveryAddress.comment = value)
    textFieldName === 'entrance' && (state.deliveryAddress.entrance = value)
    textFieldName === 'floor' && (state.deliveryAddress.floor = value)
    textFieldName === 'house' && (state.deliveryAddress.house = value)
    textFieldName === 'name' && (state.deliveryAddress.name = value)
    textFieldName === 'street' && (state.deliveryAddress.street.name = value)
    textFieldName === 'phone' && this.props.setPhone(value)

    if (textFieldName === 'street') {
      state.deliveryAddress.street.id = this.getStreetId()
    }

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
    this.props.setDelivery(this.state.isDelivery, state.deliveryAddress)
  }

  render() {
    return (
      <Container className="DeliveryByCourier p-0  mt-5">
        <Scroll.Element name="formElement">
          <form autoComplete="off" className="DeliveryByCourier__form">
            <div className="DeliveryByCourier__form__group">
              <div className="DeliveryByCourier__form__row">
                <label htmlFor="city">Населённый пункт*</label>
                <select
                  onChange={(event) => this.selectCity(event)}
                  className="DeliveryByCourier__form__street"
                  id="city-select"
                >
                  <option>Выберите населённый пункт</option>
                </select>
                <datalist id="list-city"></datalist>
                {!this.state.validCity && this.state.formSubmitted ? (
                  <div className="DeliveryByCourier__form__error">Необходимо выбрать населённый пункт</div>
                ) : null}
              </div>
              {/* <div className="DeliveryByCourier__form__row">
              <label htmlFor="city">Населённый пункт*</label>
              <input
                list="list-city"
                className="DeliveryByCourier__form__street"
                id="city"
                type="text"
                placeholder="Укажите населённый пункт"
                onKeyPress={(e: React.FormEvent<HTMLInputElement>) => {
                  this.getCitiesFromIiko(e.currentTarget.value)
                }}
              />
              <datalist id="list-city"></datalist>
            </div> */}
            </div>
            <div className="DeliveryByCourier__form__row">
              <div hidden={!this.state.cityId} className="DeliveryByCourier__form__group">
                <label htmlFor="street">Улица*</label>
                <input
                  disabled={!this.state.cityId}
                  list="list-street"
                  onKeyPress={(e: React.FormEvent<HTMLInputElement>) => {
                    this.getStreetsFromIiko(e.currentTarget.value)
                  }}
                  className="DeliveryByCourier__form__street"
                  id="street"
                  type="text"
                  placeholder="Укажите улицу"
                  value={this.props.order.address?.street.name}
                  onInput={(e: React.FormEvent<HTMLInputElement>) => {
                    this.textFieldInputHandler(e.currentTarget.value, 'street')
                  }}
                />
                <datalist id="list-street"></datalist>
                {this.state.validationTextfields[0].touched && !this.state.validationTextfields[0].isValid ? (
                  <div className="DeliveryByCourier__form__error">Выберите улицу</div>
                ) : null}
              </div>

              <div hidden={!this.state.cityId} className="DeliveryByCourier__form__group">
                <label htmlFor="house">Дом*</label>
                <input
                  disabled={!this.state.cityId}
                  onInput={(e: React.FormEvent<HTMLInputElement>) => {
                    this.textFieldInputHandler(e.currentTarget.value, 'house')
                  }}
                  id="house"
                  type="text"
                  value={this.props.order.address?.house}
                  placeholder="16/1"
                />
                {this.state.validationTextfields[1].touched && !this.state.validationTextfields[1].isValid ? (
                  <div className="DeliveryByCourier__form__error">Введите дом и корпус</div>
                ) : null}
              </div>
            </div>
            <div className="DeliveryByCourier__form__row">
              <div className="DeliveryByCourier__form__group">
                <label htmlFor="name">Ваше имя*</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Николай.."
                  // value={this.props.customer?.name || ''}
                  defaultValue={this.props.order.address?.name}
                  //  / value={this.props.order.address?.name}
                  onInput={(e: React.FormEvent<HTMLInputElement>) => {
                    this.textFieldInputHandler(e.currentTarget.value, 'name')
                  }}
                />
              </div>
              <div className="DeliveryByCourier__form__group">
                <label htmlFor="phone">Телефон*</label>
                <InputMask
                  mask="8(999) 999-99-99"
                  value={this.props.phone || this.props.customer?.phone.substring(2)}
                  onChange={(e: React.FormEvent<HTMLInputElement>) => {
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
                {/* <input
                onInput={(e: React.FormEvent<HTMLInputElement>) => {
                  this.textFieldInputHandler(e.currentTarget.value, 'phone')
                }}
                id="phone"
                type="text"
                placeholder="+7 (999) 123-45-67"
              /> */}
                {this.state.validationTextfields[2].touched && !this.state.validationTextfields[2].isValid ? (
                  <div className="DeliveryByCourier__form__error">Введите номер телефона</div>
                ) : null}
              </div>
            </div>
            <div className="DeliveryByCourier__form__row">
              <div className="DeliveryByCourier__form__group">
                <label htmlFor="entrance">Подъезд*</label>
                <input
                  onInput={(e: React.FormEvent<HTMLInputElement>) => {
                    this.textFieldInputHandler(e.currentTarget.value, 'entrance')
                  }}
                  className="DeliveryByCourier__form__number"
                  id="entrance"
                  type="text"
                  placeholder="1"
                  defaultValue={this.props.order.address?.entrance}
                />
              </div>
              <div className="DeliveryByCourier__form__group">
                <label htmlFor="floor">Этаж*</label>
                <input
                  onInput={(e: React.FormEvent<HTMLInputElement>) => {
                    this.textFieldInputHandler(e.currentTarget.value, 'floor')
                  }}
                  className="DeliveryByCourier__form__number"
                  id="floor"
                  type="text"
                  placeholder="3"
                  defaultValue={this.props.order.address?.floor}
                />
              </div>
              <div className="DeliveryByCourier__form__group">
                <label htmlFor="flat">Квартира*</label>
                <input
                  onInput={(e: React.FormEvent<HTMLInputElement>) => {
                    this.textFieldInputHandler(e.currentTarget.value, 'flat')
                  }}
                  className="DeliveryByCourier__form__number"
                  id="flat"
                  type="text"
                  placeholder="74"
                  defaultValue={this.props.order.address?.flat}
                />
              </div>
              <div className="DeliveryByCourier__form__group">
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
              <CookingTime />

              <div className="DeliveryByCourier__form__group w-100">
                <label htmlFor="comment">Комментарий к заказу</label>
                <textarea
                  onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
                    this.textFieldInputHandler(e.currentTarget.value, 'comment')
                  }}
                  defaultValue={this.props.order.address?.comment}
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
                disabled={!(this.props.ruleCheck && this.props.smsCheck && this.props.personCheck)}
                loading={this.props.loadingOrder}
                onClick={() => this.processOrder()}
                textColor="white"
                width="280px"
                text="Завершить заказ"
                backgroundColor="#303030"
                icon="cart_dark.svg"
              />
            </div>
          </form>
        </Scroll.Element>
      </Container>
    )
  }
}

const mapDispatchToProps = {
  getStreetVariants,
  getCityVariants,
  getAllCities,
  getStreetsByCity,
  setPhone,
  showLoginModal,
  setDelivery,
  processOrder,
}

const mapStateToProps = (state: any) => {
  const { loading, error, phone, isAuth, customer } = state.auth
  const { loading: loadingOrder, error: errorOrder, order, smsCheck, ruleCheck, personCheck } = state.order
  return {
    loading: loading,
    error: error,
    loadingOrder: loadingOrder,
    order,
    phone,
    isAuth,
    smsCheck,
    ruleCheck,
    personCheck,
    customer,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeliveryByCourier)
