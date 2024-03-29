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
import { setPhone, setProcessOrderOnAuth } from '../../../../../Redux/actions/auth'
import { showLoginModal } from '../../../../../Redux/actions/app'
import {
  getStreetVariants,
  getCityVariants,
  getAllCities,
  getStreetsByCity,
  setDelivery,
  setPrepareDate,
  processOrder,
  getDeliveryRestrictions,
  showPaymentSelection,
  hidePaymentSelection,
  addOrderItemToOrder,
  deleteDeliveryProduct,
  calculateOrder,
  getGeoLocation,
  setComment,
  setTerminal,
} from '../../../../../Redux/actions/order'

import './DeliveryByCourier.scss'
import City from '../../../../../Interfaces/City'
import Order from '../../../../../Interfaces/Order'
import Address from '../../../../../Interfaces/Address'
import { DeliveryAddressValidation } from '../../../../../Interfaces/DeliveryAddressValidation'
import Customer from '../../../../../Interfaces/Customer'
import { YMaps, Map, Placemark, ZoomControl, GeolocationControl } from 'react-yandex-maps'
import * as Scroll from 'react-scroll'
import Loader from '../../../../../SharedComponents/Loader/Loader'
import { AddressSuggestions, DaDataSuggestion, DaDataAddress } from 'react-dadata'

import 'react-dadata/dist/react-dadata.css'
import CustomAlert from '../../../../../SharedComponents/CustomAlert/CustomAlert'
import Group from '../../../../../Interfaces/Group'
import Product from '../../../../../Interfaces/Product'
import Category from '../../../../../Interfaces/Category'
import OrderItem from '../../../../../Interfaces/OrderItem'
import Organization from '../../../../../Interfaces/Organization'
import { RootState } from '../../../../../Redux'

interface DeliveryByCourierProps {
  getStreetVariants: any
  getCityVariants: any
  getAllCities: any
  getStreetsByCity: any
  getGeoLocation: any
  order: Order
  phone: string
  setPhone: (phone: string) => void
  isAuth: boolean
  showLoginModal: () => void
  showPaymentSelection: () => void
  hidePaymentSelection: () => void
  setDelivery: (isDelivery: boolean, address: Address) => void
  getDeliveryRestrictions: any
  smsCheck: boolean
  ruleCheck: boolean
  personCheck: boolean
  customer: Customer
  processOrder: any
  loadingOrder: boolean
  errorAuth: string
  errorOrder: string
  isShowPaymentSelection: boolean
  menu: Category[]
  addOrderItemToOrder: (orderItem: OrderItem) => void
  deleteDeliveryProduct: () => void
  calculateOrder: () => void
  setComment: (comment: string) => void
  setTerminal: (terminalId: string) => void
  setProcessOrderOnAuth: (isProcessOrder: boolean) => void
  organizationId: string
  organizations: Organization[]
}

interface DeliveryByCourierState {
  isDelivery: boolean
  cityId: string
  deliveryAddress: Address
  validationTextfields: DeliveryAddressValidation[]
  phone: string
  validCity: boolean
  formSubmitted: boolean
  loading: boolean
  coordinates: number[]
  deliverySum: number
  dadataAddress?: DaDataSuggestion<DaDataAddress> | undefined
  // isPaymentShow: boolean
  mapCenterCoordinates: number[]
  ymaps: any
  isAllowedDelivery: boolean
  deliveryPrice: number
  addressFromInput: boolean
  isAddressError: boolean
}

class DeliveryByCourier extends React.Component<DeliveryByCourierProps, DeliveryByCourierState> {
  daDataInputRef = React.createRef<AddressSuggestions>()

  constructor(props: DeliveryByCourierProps) {
    super(props)
    this.state = {
      isAddressError: false,
      addressFromInput: false,
      deliveryPrice: 0,
      isAllowedDelivery: false,
      ymaps: {},
      deliverySum: 0,
      loading: false,
      mapCenterCoordinates: [46.347801, 48.037095],
      coordinates: [46.347801, 48.037095],
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
      phone: this.props.customer?.phone,
      validationTextfields: [
        // {
        //   name: 'street',
        //   minLength: 3,
        //   required: true,
        //   touched: false,
        //   isValid: false,
        // },
        {
          name: 'name',
          minLength: 2,
          required: true,
          touched: false,
          isValid: false,
        },
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
  componentDidMount() {
    this.props.setComment('')
    this.props.hidePaymentSelection()
    this.props.deleteDeliveryProduct()
  }

  getCurrentOrganization() {
    return this.props.organizations.find((organization) => organization.id === this.props.organizationId)
  }

  showPaymentSection = async () => {
    if (
      this.state.dadataAddress &&
      this.props.order.address?.street.classifierId &&
      this.props.order.address?.house &&
      this.props.order.address?.house != 'null'
    ) {
      await this.getDeliveryRestrictions()
    } else {
      this.setState({ isAddressError: true })
      Scroll.scroller.scrollTo('addressElement', {
        duration: 800,
        delay: 0,
        smooth: true,
        offset: -200,
      })
    }
  }

  setLoading = (loading: boolean) => {
    this.setState({ loading })
  }

  getDeliveryRestrictions = async () => {
    const streetId = this.props.order.address?.street.id
    const classifierId = this.props.order.address?.street.classifierId
    const house = this.props.order.address?.house
    const deliverySum = this.props.order.amount
    const latitude = parseFloat(this.props.order.address?.latitude || '')
    const longitude = parseFloat(this.props.order.address?.longitude || '')
    const isCourierDelivery = true
    const deliveryDate = this.props.order.completeBefore
    const deliveryRestriction = await this.props.getDeliveryRestrictions(
      streetId,
      deliverySum,
      house,
      isCourierDelivery,
      latitude,
      longitude,
      classifierId,
      deliveryDate
    )

    if (deliveryRestriction && deliveryRestriction.isAllowed && deliveryRestriction.allowedItems.length > 0) {
      const deliveryServiceProductId = deliveryRestriction.allowedItems[0].deliveryServiceProductId
      this.props.setTerminal(deliveryRestriction.allowedItems[0].terminalGroupId)
      if (deliveryServiceProductId) {
        let deliveryProducts: Product[] = []

        this.props.menu.map((group) => {
          if (group.isService) {
            deliveryProducts = group.products
          }
        })
        deliveryProducts.map((product) => {
          if (product.id === deliveryServiceProductId) {
            const orderItem = {
              product: product,
              amount: 1,
              orderItemModifiers: [],
              value: (product.sizePrices && product.sizePrices[0].price.currentPrice) || product.price,
            }
            this.props.addOrderItemToOrder(orderItem)

            this.setState({
              deliveryPrice: (product.sizePrices && product.sizePrices[0].price.currentPrice) || product.price,
            })
          }
        })
      } else {
        this.setState({ deliveryPrice: 0 })
      }

      this.setState({ isAllowedDelivery: true })
      // this.setState({ isPaymentShow: true })
      this.props.showPaymentSelection()
    } else if (
      (deliveryRestriction && !deliveryRestriction.isAllowed) ||
      deliveryRestriction.allowedItems.length == 0
    ) {
      this.setState({ isAllowedDelivery: false })
      // this.setState({ isPaymentShow: true })
      this.props.showPaymentSelection()
    }
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
      textfield.name === 'name' && (value = this.props.order.address?.name || this.props.customer?.name || '')
      textfield.name === 'street' && (value = this.state.deliveryAddress.street.name)
      textfield.name === 'house' && (value = this.state.deliveryAddress.house)
      textfield.name === 'phone' && (value = this.props.phone || this.props.customer?.phone || '')

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
        this.props.setProcessOrderOnAuth(true)
        this.props.showLoginModal()
      } else {
        this.props.processOrder()
      }
    } else {
      Scroll.scroller.scrollTo('formElement', {
        duration: 800,
        delay: 0,
        smooth: true,
        offset: -300,
      })
      this.setState({ validationTextfields })
    }
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
    if (textFieldName === 'street' || textFieldName === 'house') {
      this.getDeliveryRestrictions()
    }
  }

  setYmaps = (ymaps: any) => {
    this.setState({ ymaps: ymaps })
  }

  chooseAddressFromInput = (dadataAddress: DaDataSuggestion<DaDataAddress> | undefined) => {
    if (dadataAddress) {
      const coordinates = [
        Number.parseFloat(dadataAddress.data.geo_lat || '0'),
        Number.parseFloat(dadataAddress.data.geo_lon || '0'),
      ]
      console.log(coordinates)
      const address = dadataAddress.value
      const city = dadataAddress.data.city || 'Астрахань'
      const street = dadataAddress.data.street
      const house =
        `${dadataAddress.data.house}${dadataAddress.data.block_type ? dadataAddress.data.block_type : ''}${
          dadataAddress.data.block ? dadataAddress.data.block : ''
        }` || ''

      this.setState(
        {
          dadataAddress,
          coordinates,
        },
        () => {
          this.setdaDataAddress(address, house, coordinates, city)
        }
      )
      this.props.deleteDeliveryProduct()
      this.setState({ addressFromInput: true, isAddressError: false, deliveryPrice: 0 })
    }
  }

  async chooseAddressOnMap(coordinates: number[]) {
    if (!this.state.addressFromInput) {
      const geoData = await this.props.getGeoLocation(coordinates)
      if (geoData) {
        const { address, city, street, house, daData } = geoData

        if (this.daDataInputRef.current) {
          this.daDataInputRef.current.setInputValue(address)
        }
        this.setState({ dadataAddress: daData })
        this.setdaDataAddress(address, house, coordinates, city)
      }
    }
    this.props.deleteDeliveryProduct()
    this.setState({ deliveryPrice: 0, addressFromInput: false, isAddressError: false })
  }

  setdaDataAddress = (address: string, house: string, coordinates: number[], city: string) => {
    if (this.state.dadataAddress) {
      const daAddress: DaDataSuggestion<DaDataAddress> | undefined = {
        value: address,
        data: this.state.dadataAddress.data,
        unrestricted_value: address,
      }

      this.setState({ dadataAddress: daAddress })
    }

    const orderAddress = this.props.order.address
    if (orderAddress) {
      orderAddress.house = house
      orderAddress.latitude = coordinates[0].toString()
      orderAddress.longitude = coordinates[1].toString()

      orderAddress.street = {
        name: this.state.dadataAddress?.data.street || '',
        classifierId: this.state.dadataAddress?.data.street_kladr_id || '',
        city,
      }
      this.props.setDelivery(this.state.isDelivery, orderAddress)
      this.setState({ deliveryAddress: orderAddress })
    }
  }

  render() {
    return (
      <Container className="DeliveryByCourier p-0  mt-4">
        <React.Fragment>
          <form hidden={this.state.loading} autoComplete="off" className="DeliveryByCourier__form">
            <div className="DeliveryByCourier__form__row w-100">
              <div className="DeliveryByCourier__form__group ">
                <Scroll.Element name="addressElement"></Scroll.Element>
                <label htmlFor="address">Адрес*</label>

                <AddressSuggestions
                  ref={this.daDataInputRef}
                  token="2a4f6368b9d756c95e4092292d7c2f53ccefa7bf"
                  value={this.state.dadataAddress}
                  minChars={5}
                  delay={500}
                  inputProps={{ type: 'text' }}
                  count={5}
                  filterLocations={[
                    {
                      ['region']: this.getCurrentOrganization()?.area,
                    },
                  ]}
                  onChange={(value) => this.chooseAddressFromInput(value)}
                />
                {this.state.isAddressError ? (
                  <div className="DeliveryByCourier__form__error">Введите корректный адрес</div>
                ) : null}
              </div>

              <div className="DeliveryByCourier__map__info mb-2 mt-2">
                Выберите ваш адрес из списка. Адрес должен включать улицу и номер дома (корпус).
              </div>
            </div>

            {/* <div className="DeliveryByCourier__map mt-2">
              {this.state.isAddressError ? (
                <div className="DeliveryByCourier__form__error">Введите корректный адрес - улицу и номер дома.</div>
              ) : null}
              <div className="DeliveryByCourier__map__info mb-2">
                Выберите ваш адрес из списка, если Ваш адрес не удалось найти - отметьте его на карте
              </div>
              <div className="DeliveryByCourier__map__pin">
                <img src="/images/map-pin.png" alt="map-pin" />
              </div>

              <div style={{ position: 'relative' }}>
                <div className="DeliveryByCourier__map__address">
                  {this.props.order.address?.street.classifierId &&
                  this.props.order.address?.house &&
                  this.props.order.address?.house != 'null'
                    ? `${this.props.order.address?.street.city}, ул ${this.props.order.address?.street.name}, д ${this.props.order.address?.house}`
                    : 'Адрес не найден'}
                </div>
                <YMaps query={{ lang: 'ru_RU' }}>
                  <Map
                    modules={['geolocation']}
                    onBoundsChange={(e: any) => this.chooseAddressOnMap(e.get('target').getCenter())}
                    onLoad={(ymaps: any) => {
                      this.setYmaps(ymaps)
                      this.setLoading(false)
                    }}
                    onError={() => this.setLoading(false)}
                    className="DeliveryByCourier__map__yandex"
                    state={{
                      center: this.state.coordinates,
                      zoom: 17,
                    }}
                  >
                    <GeolocationControl options={{ float: 'left' }} />
                    <ZoomControl options={{ float: 'right' }} />
                
                  </Map>
                </YMaps>
              </div>
            </div> */}

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
            </div>

            <div className="DeliveryByCourier__form__row mt-5 mt-md-4">
              <div className="DeliveryByCourier__form__group">
                <label htmlFor="name">Ваше имя*</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Николай.."
                  // value={this.props.customer?.name || ''}
                  defaultValue={this.props.customer?.name || this.props.order.address?.name}
                  //  / value={this.props.order.address?.name}
                  onInput={(e: React.FormEvent<HTMLInputElement>) => {
                    this.textFieldInputHandler(e.currentTarget.value, 'name')
                  }}
                />
                {this.state.validationTextfields[0].touched && !this.state.validationTextfields[0].isValid ? (
                  <div className="DeliveryByCourier__form__error">Введите ваше имя</div>
                ) : null}
              </div>
              <div className="DeliveryByCourier__form__group">
                <label htmlFor="phone">Телефон*</label>
                <InputMask
                  mask="8(999) 999-99-99"
                  defaultValue={this.props.phone || this.props.customer?.phone.substring(2)}
                  onChange={(e: React.FormEvent<HTMLInputElement>) => {
                    this.textFieldInputHandler(e.currentTarget.value, 'phone')
                  }}
                  maskChar=" "
                >
                  {(inputProps: any) => <input {...inputProps} id="phone" type="tel" placeholder="8 (999) 123-45-67" />}
                </InputMask>
                {this.state.validationTextfields[0].touched && !this.state.validationTextfields[0].isValid ? (
                  <div className="DeliveryByCourier__form__error">Введите номер телефона</div>
                ) : null}
              </div>
            </div>
            <Scroll.Element name="formElement"></Scroll.Element>

            <div className="DeliveryByCourier__form__row">
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

              <PoliticSection />
              <div className="w-100">
                <OrderTotalPrice
                  isDelivery={this.state.isAllowedDelivery && this.props.isShowPaymentSelection}
                  delivery={this.state.deliveryPrice}
                />
              </div>

              {this.props.errorOrder ? (
                <CustomAlert show={true} variant="danger" message={this.props.errorOrder} />
              ) : null}

              {this.props.isShowPaymentSelection ? (
                <React.Fragment>
                  {!this.state.isAllowedDelivery && !this.props.errorOrder ? (
                    <div className="DeliveryByCourier__error mb-5">
                      Доставка с указанными параметрами по данному адресу не осуществляется. Выберите другой адрес
                      доставки, либо измените заказ.
                    </div>
                  ) : (
                    <div className="DeliveryByCourier__error ">{this.props.errorOrder}</div>
                  )}
                  {this.state.isAllowedDelivery ? (
                    <React.Fragment>
                      <div className="DeliveryByCourier__address__label">Адрес доставки</div>
                      <div className="DeliveryByCourier__address__label">
                        {this.props.order.address?.street.classifierId &&
                        this.props.order.address?.house &&
                        this.props.order.address?.house != 'null'
                          ? `${this.props.order.address?.street.city}, ${this.state.dadataAddress?.data.street_type} ${this.props.order.address?.street.name}, д ${this.props.order.address?.house}`
                          : 'Адрес не найден'}
                      </div>
                      <PaymentSection isDelivery={true} />
                    </React.Fragment>
                  ) : null}

                  <ActionButton
                    disabled={
                      !(
                        this.props.ruleCheck &&
                        this.props.smsCheck &&
                        this.props.personCheck &&
                        this.state.isAllowedDelivery
                      )
                    }
                    loading={this.props.loadingOrder}
                    onClick={() => this.processOrder()}
                    textColor="white"
                    width="280px"
                    text="Завершить заказ"
                    backgroundColor="#303030"
                    icon="check.svg"
                  />
                </React.Fragment>
              ) : (
                <ActionButton
                  onClick={() => this.showPaymentSection()}
                  loading={this.props.loadingOrder}
                  textColor="white"
                  width="280px"
                  text="Выберите способ оплаты"
                  backgroundColor="#303030"
                  icon="wallet.svg"
                />
              )}
            </div>
          </form>
        </React.Fragment>
        <div hidden={!this.state.loading} className="DeliveryByClient__loader">
          <Loader />
        </div>
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
  getDeliveryRestrictions,
  showPaymentSelection,
  hidePaymentSelection,
  addOrderItemToOrder,
  deleteDeliveryProduct,
  calculateOrder,
  getGeoLocation,
  setComment,
  setTerminal,
  setProcessOrderOnAuth,
}

const mapStateToProps = (state: RootState) => {
  const { loading, error, phone, isAuth, customer } = state.auth
  const {
    loading: loadingOrder,
    error: errorOrder,
    order,
    smsCheck,
    ruleCheck,
    personCheck,
    isShowPaymentSelection,
  } = state.order
  const { menu, organizations, terminals } = state.menu
  const { organizationId } = state.app
  return {
    loading: loading,
    errorOrder,
    errorAuth: error,
    loadingOrder: loadingOrder,
    order,
    phone,
    isAuth,
    smsCheck,
    ruleCheck,
    personCheck,
    customer,
    isShowPaymentSelection,
    menu,
    organizationId,
    organizations,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeliveryByCourier)
