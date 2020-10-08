import Address from '../../../../Interfaces/Address'
import React, { Component } from 'react'
import Customer from '../../../../Interfaces/Customer'
import { BackButton } from '../../../../SharedComponents/BackButton/BackButton'
import LoginForm from '../Cart/LoginForm/LoginForm'
import Loader from '../../../../SharedComponents/Loader/Loader'
import ErrorMessage from '../../../../SharedComponents/ErrorMessage/ErrorMessage'
import { Col, Container, Row } from 'react-bootstrap'
import CircleSideButton from '../../../../SharedComponents/CircleSideButton/CircleSideButton'
import './CookingTime.scss'
import FullAddress from '../../../../Interfaces/FullAddress'
import CookingTimeEntryPage from '../../../../Interfaces/CookingTimeEntryPage'
import { connect } from 'react-redux'
import { hideSideDialog, showPayment, showCartDialog } from '../../../../Redux/actions/app'
import { setDelivery, setPrepareDate } from '../../../../Redux/actions/order'
import { addCustomerAddress } from '../../../../Redux/actions/auth'
import DeliveryAddress from './DeliveryAddress/DeliveryAddress'
import DeliveryAddressEl from './DeliveryAddressEl/DeliveryAddressEl'
import AddDeliveryAddressForm from './AddDeliveryAddressForm/AddDeliveryAddressForm'
import ByDateEntryPage from './ByDateEntryPage/ByDateEntryPage'

type CookingTimeState = {
  addressCafeList: FullAddress[]
  addressСustomerList: FullAddress[]
  resultAddress: Address
  dateTime: string
  loading: boolean
  error: string
  cookingTimeEntryPages: CookingTimeEntryPage[]
  renderEntryPageKey: number
  buttonGroups: {
    deliveryGroup: {
      pickupAddress: {
        clicked: boolean
      }
      deliveryAddress: {
        clicked: boolean
      }
    }
    deliveryDateGroup: {
      now: {
        clicked: boolean
      }
      byDate: {
        clicked: boolean
      }
    }
  }
}

type CookingTimeProps = {
  addCustomerAddress: any
  showPayment: () => {}
  setDelivery: (isDelivery: boolean, address: Address) => void
  setPrepareDate: (prepareDate: string) => void
  showCartDialog: any
  hideSideDialog: () => {}
  customer: Customer
}

class CookingTime extends Component<CookingTimeProps, CookingTimeState> {
  constructor(props: CookingTimeProps) {
    super(props)
    this.state = {
      dateTime: '',
      addressCafeList: [],
      addressСustomerList: [],
      resultAddress: {
        id: -1,
        house: '',
        street: '',
      },
      cookingTimeEntryPages: [
        {
          name: 'pickupAddress', //По умолчанию 1-я страница для ввода данных
          active: true,
        },
        {
          name: 'deliveryAddress',
          active: false,
        },
        {
          name: 'byDate',
          active: false,
        },
        {
          name: 'addDeliveryAddress',
          active: false,
        },
      ],
      renderEntryPageKey: Math.random(),
      loading: true,
      error: '',
      buttonGroups: {
        deliveryGroup: {
          pickupAddress: {
            clicked: true,
          },
          deliveryAddress: {
            clicked: false,
          },
        },
        deliveryDateGroup: {
          now: {
            clicked: true,
          },
          byDate: {
            clicked: false,
          },
        },
      },
    }
  }

  componentDidMount() {
    // console.log(this.props.customer)
    this.stateBuild()
  }

  addAddressListArraysToState = (addressCafeList: FullAddress[], addressСustomerList: FullAddress[]): void => {
    const buttonGroups = this.state.buttonGroups
    const cookingTimeEntryPages = this.state.cookingTimeEntryPages
    let resultAddress = this.state.resultAddress

    let entryPage = ''
    let isDelivery = false

    if (addressСustomerList.length > 0) {
      addressСustomerList[0].clicked = true
      entryPage = 'deliveryAddress'
      buttonGroups.deliveryGroup.pickupAddress.clicked = false
      buttonGroups.deliveryGroup.deliveryAddress.clicked = true
      resultAddress = addressСustomerList[0].address
      isDelivery = true
    } else {
      if (addressCafeList.length > 0) {
        addressCafeList[0].clicked = true
        entryPage = 'pickupAddress'
        buttonGroups.deliveryGroup.pickupAddress.clicked = true
        buttonGroups.deliveryGroup.deliveryAddress.clicked = false
        resultAddress = addressCafeList[0].address
      }
    }

    cookingTimeEntryPages.map((ep) => {
      if (ep.name === entryPage) {
        ep.active = true
      } else {
        ep.active = false
      }
    })

    this.setState({
      resultAddress,
      buttonGroups,
      cookingTimeEntryPages,
      addressCafeList,
      addressСustomerList,
    })

    this.props.setDelivery(isDelivery, resultAddress)
  }

  getAddressListArrays = (): void => {
    const addressCafeList: FullAddress[] = [
      {
        address: {
          house: '6к2',
          street: 'Савушкина',
          id: 1111,
        },
        clicked: false,
      },
      {
        address: {
          house: '31',
          street: 'Фиолетова',
          id: 2222,
        },
        clicked: false,
      },
      {
        address: {
          house: '9',
          street: 'Богдана Хмельницкого',
          id: 3333,
        },
        clicked: false,
      },
    ]

    // const addressСustomerList: FullAddress[] = []
    // if (typeof this.props.customer !== 'undefined') {
    //   const addressСustomerList: FullAddress[] = this.props.customer.addresses.map((address) => {
    //     return {
    //       address,
    //       clicked: false,
    //     }
    //   })
    // }

    const addressСustomerList: FullAddress[] = this.props.customer.addresses.map((address) => {
      return {
        address,
        clicked: false,
      }
    })

    this.addAddressListArraysToState(addressCafeList, addressСustomerList)
  }

  stateBuild = (): void => {
    this.getAddressListArrays()

    this.setState({ loading: false })
  }

  renderAuthBlock = (): any => {
    let toDeliveryAddress: boolean = false
    this.state.cookingTimeEntryPages.map((page) => {
      if (page.name === 'addDeliveryAddress' && page.active) {
        toDeliveryAddress = !toDeliveryAddress
      }
    })

    if (toDeliveryAddress) {
      return (
        <section className="cooking-time">
          <LoginForm />
          <BackButton text="Вернуться" onClick={() => this.renderEntryPage('deliveryAddress')} />
        </section>
      )
    } else {
      return (
        <section className="cooking-time">
          <LoginForm />
          <BackButton text="Вернуться" onClick={this.props.showCartDialog} />
        </section>
      )
    }
  }

  renderNoActiveButtonGroup = (activeButtonGroup: string) => {
    const buttonGroups = this.state.buttonGroups

    //Подкраска кнопок в зависимости от данных state о доставке
    if (activeButtonGroup !== 'deliveryGroup') {
      this.state.addressCafeList.map((pickupAddress) => {
        if (pickupAddress.clicked === true) {
          buttonGroups.deliveryGroup.pickupAddress.clicked = true
          buttonGroups.deliveryGroup.deliveryAddress.clicked = false
        }
      })
      this.state.addressСustomerList.map((deliveryAddress) => {
        if (deliveryAddress.clicked === true) {
          buttonGroups.deliveryGroup.deliveryAddress.clicked = true
          buttonGroups.deliveryGroup.pickupAddress.clicked = false
        }
      })
    } else {
      if (this.state.dateTime !== '') {
        buttonGroups.deliveryDateGroup.now.clicked = false
        buttonGroups.deliveryDateGroup.byDate.clicked = true
      } else {
        buttonGroups.deliveryDateGroup.now.clicked = true
        buttonGroups.deliveryDateGroup.byDate.clicked = false
      }
    }

    this.setState({ buttonGroups })
  }

  clickButtonHandler = (buttonName: string, buttonGroup: string): void => {
    const buttonGroups: any = this.state.buttonGroups
    Object.keys(buttonGroups).forEach((key) => {
      if (key === buttonGroup) {
        Object.keys(buttonGroups[key]).forEach((button) => {
          buttonGroups[key][button].clicked = false
          // buttonGroups[key][button].key = Math.random()
        })
      }
    })
    buttonGroups[buttonGroup][buttonName].clicked = true
    this.setState({ buttonGroups })
    this.renderEntryPage(buttonName)
    this.renderNoActiveButtonGroup(buttonGroup)
    // console.log(this.state.buttonGroups)
  }

  // clickCheckBoxHandler = (idItem: number): void => {
  //   const addressCafeList: FullAddress[] = this.state.addressCafeList
  //   const addressСustomerList = this.state.addressСustomerList

  //   addressСustomerList.map((address) => {
  //     address.clicked = false
  //   })

  //   addressCafeList.map((address) => {
  //     address.address.id !== idItem ? (address.clicked = false) : (address.clicked = true)
  //     return address
  //   })
  //   this.setState({ addressCafeList, addressСustomerList })
  // }

  checkPickup = (address: Address): boolean => {
    let isPickup = true
    this.state.addressСustomerList.map((addr) => {
      if (address.id === addr.address.id) {
        isPickup = false
      }
    })
    return !isPickup
  }

  clickCheckBoxHandlerFull = (listItem: FullAddress) => {
    const addressCafeList: FullAddress[] = this.state.addressCafeList
    const addressСustomerList = this.state.addressСustomerList
    let resultAddress = this.state.resultAddress
    let isDelivery = true

    addressCafeList.map((address) => {
      if (address.address.id !== listItem.address.id) {
        address.clicked = false
      } else {
        address.clicked = true
        resultAddress = address.address
        isDelivery = false
      }
      return address
    })

    addressСustomerList.map((address) => {
      if (address.address.id !== listItem.address.id) {
        address.clicked = false
      } else {
        address.clicked = true
        resultAddress = address.address
        isDelivery = true
      }
      return address
    })

    this.setState({ addressCafeList, addressСustomerList, resultAddress })

    this.props.setDelivery(isDelivery, resultAddress)
  }

  getAlternitiveEntryPage = (): string => {
    let entryPage = 'pickupAddress'
    this.state.addressСustomerList.map((address) => {
      if (address.clicked) {
        entryPage = 'deliveryAddress'
      }
    })
    return entryPage
  }

  renderEntryPage = (entryPage: string = ''): void => {
    const cookingTimeEntryPages = this.state.cookingTimeEntryPages

    if (entryPage === 'now') {
      this.getOrderTime('')

      entryPage = this.getAlternitiveEntryPage()
    }

    cookingTimeEntryPages.map((ep) => {
      if (ep.name !== entryPage) {
        ep.active = false
      } else {
        ep.active = true
      }
    })

    this.setState({ cookingTimeEntryPages, renderEntryPageKey: Math.random() })
  }

  getDeliveryAddressString = (address: Address): string => {
    let addressString = ''
    addressString = address.street + ' ' + address.house
    if (typeof address.apartment !== 'undefined' && address.apartment !== '') {
      addressString = addressString + ', кв.' + address.apartment
    }
    if (typeof address.name !== 'undefined' && address.name !== '') {
      addressString = address.name + ': ' + addressString
    }
    return addressString
  }

  getDelivery = (): any => {
    let delivery = {
      pickup: false,
      address: '',
    }

    this.state.addressCafeList.map((address) => {
      if (address.clicked) {
        delivery.address = this.getDeliveryAddressString(address.address)
        delivery.pickup = true
      }
    })

    this.state.addressСustomerList.map((address) => {
      if (address.clicked) {
        delivery.address = this.getDeliveryAddressString(address.address)
        delivery.pickup = false
      }
    })

    // console.log(delivery)
    return delivery
  }

  addDeliveryAddress = (deliveryAddress: Address): void => {
    let addressСustomerList = this.state.addressСustomerList
    let resultAddress = this.state.resultAddress
    resultAddress = deliveryAddress

    addressСustomerList.map((address) => {
      address.clicked = false
    })
    let addressCafeList = this.state.addressCafeList
    addressCafeList.map((address) => {
      address.clicked = false
    })

    addressСustomerList.unshift({ address: deliveryAddress, clicked: true })

    this.setState({ addressСustomerList, addressCafeList, resultAddress })
    this.renderEntryPage('deliveryAddress')

    this.props.setDelivery(true, resultAddress)

    this.props.addCustomerAddress(deliveryAddress)
  }

  getOrderTime = (dateTime: string) => {
    this.setState({ dateTime })
    this.props.setPrepareDate(dateTime)
  }

  render() {
    const delivery = this.getDelivery()
    // console.log(this.state.resultAddress)
    // console.log(this.state.resultAddress + ' ' + this.state.dateTime)

    if (this.state.loading) {
      return <Loader />
    } else {
      if (this.state.error !== '') {
        return <ErrorMessage errorMessage={this.state.error} />
      } else if (
        this.state.cookingTimeEntryPages[3].active &&
        this.state.cookingTimeEntryPages[3].name === 'addDeliveryAddress'
      ) {
        return (
          <Container className="CookingTime p-0 m-0 h-100">
            {this.renderAuthBlock()}

            <AddDeliveryAddressForm
              deliveryAddressesCount={this.state.addressСustomerList.length}
              addDeliveryAddress={this.addDeliveryAddress}
              renderEntryPage={this.renderEntryPage}
            />
          </Container>
        )
      } else {
        return (
          <Container className="CookingTime p-0 m-0 h-100">
            {this.renderAuthBlock()}
            <Row className="p-0 m-0 pt-2 pb-3">
              <Col xs={6} className="p-0 pl-5">
                <CircleSideButton
                  clicked={this.state.buttonGroups.deliveryGroup.deliveryAddress.clicked}
                  buttonName="deliveryAddress"
                  buttonGroup="deliveryGroup"
                  text="Доставка"
                  color={this.state.buttonGroups.deliveryGroup.deliveryAddress.clicked ? '#5EAD03' : '#767676'}
                  rightCircle={false}
                  clickButtonHandler={this.clickButtonHandler}
                />
              </Col>
              <Col xs={6} className="p-0 pr-5">
                <CircleSideButton
                  clicked={this.state.buttonGroups.deliveryGroup.pickupAddress.clicked}
                  buttonName="pickupAddress"
                  buttonGroup="deliveryGroup"
                  text="Самовывоз"
                  color={this.state.buttonGroups.deliveryGroup.pickupAddress.clicked ? '#5EAD03' : '#767676'}
                  rightCircle={true}
                  clickButtonHandler={this.clickButtonHandler}
                />
              </Col>
            </Row>
            <DeliveryAddress delivery={delivery} dateTime={this.state.dateTime} />

            <Container key={this.state.renderEntryPageKey} fluid className="p-0 m-0 listItemContainer">
              {this.state.cookingTimeEntryPages.map((entryPage, index) => {
                if (entryPage.active && entryPage.name === 'pickupAddress') {
                  return (
                    <Row key={index} className="m-0 pl-4 pr-4 pb-2">
                      <Col className="pl-3 pr-3">
                        {this.state.addressCafeList.map((item, index) => {
                          return (
                            <DeliveryAddressEl
                              key={index}
                              listItemTitle={this.getDeliveryAddressString(item.address)}
                              listItem={item}
                              clickCheckBoxHandlerFull={this.clickCheckBoxHandlerFull}
                            />
                          )
                        })}
                      </Col>
                    </Row>
                  )
                }

                if (entryPage.active && entryPage.name === 'deliveryAddress') {
                  return (
                    <Container key={index} className="p-0 m-0">
                      <Row className="m-0 pl-4 pr-4">
                        <Col className="pl-3 pr-3">
                          {this.state.addressСustomerList.map((item, index) => {
                            return (
                              <DeliveryAddressEl
                                key={index}
                                listItemTitle={this.getDeliveryAddressString(item.address)}
                                listItem={item}
                                clickCheckBoxHandlerFull={this.clickCheckBoxHandlerFull}
                              />
                            )
                          })}
                        </Col>
                      </Row>
                      <Row className="m-0 pl-4 pr-4">
                        <Col className="mt-4 pl-3 pr-3 d-flex justify-content-center">
                          <div
                            className="addDeliveryAddressButton"
                            onClick={() => this.renderEntryPage('addDeliveryAddress')}
                          >
                            <Row className="d-flex justify-content-start m-0 p-0">
                              <Col className=" m-0 p-0">Добавить адрес</Col>
                            </Row>
                            <Row className="d-flex justify-content-end m-0 p-0">
                              <Col className="m-0 p-0">
                                <div className="addDeliveryAddressButton__img">
                                  <img src="images/map-marker-plus512.png" alt="" width="25px" />
                                </div>
                              </Col>
                            </Row>
                          </div>
                        </Col>
                      </Row>
                    </Container>
                  )
                }

                if (entryPage.active && entryPage.name === 'byDate') {
                  return <ByDateEntryPage key={index} getOrderTime={this.getOrderTime} />
                }
              })}
            </Container>

            <Row className="m-0 pl-4 pr-4 pt-1">
              <Col style={{ fontSize: 14 }} className="d-flex justify-content-start">
                К какому времени подготовить заказ?
              </Col>
            </Row>
            <Row className="p-0 m-0 pt-1 pb-2">
              <Col xs={6} className="p-0 pl-5">
                <CircleSideButton
                  clicked={this.state.buttonGroups.deliveryDateGroup.byDate.clicked}
                  buttonName="byDate"
                  buttonGroup="deliveryDateGroup"
                  text="Ко времени"
                  color={this.state.buttonGroups.deliveryDateGroup.byDate.clicked ? '#5EAD03' : '#767676'}
                  rightCircle={false}
                  clickButtonHandler={this.clickButtonHandler}
                />
              </Col>
              <Col xs={6} className="p-0 pr-5">
                <CircleSideButton
                  clicked={this.state.buttonGroups.deliveryDateGroup.now.clicked}
                  buttonName="now"
                  buttonGroup="deliveryDateGroup"
                  text="Сейчас"
                  color={this.state.buttonGroups.deliveryDateGroup.now.clicked ? '#5EAD03' : '#767676'}
                  rightCircle={true}
                  clickButtonHandler={this.clickButtonHandler}
                />
              </Col>
            </Row>

            <div onClick={this.props.showPayment} className="underButton">
              Перейти к оплате
            </div>
          </Container>
        )
      }
    }
  }
}

const mapDispatchToProps = {
  hideSideDialog,
  showPayment,
  addCustomerAddress,
  showCartDialog,
  setDelivery,
  setPrepareDate,
}

const mapStateToProps = (state: any) => {
  const { customer } = state.auth
  return {
    customer: customer,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CookingTime)
