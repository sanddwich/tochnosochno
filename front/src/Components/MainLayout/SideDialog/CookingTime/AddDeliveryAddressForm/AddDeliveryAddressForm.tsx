import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { connect } from 'react-redux'
import Address from '../../../../../Interfaces/Address'
import { DeliveryAddressValidation } from '../../../../../Interfaces/DeliveryAddressValidation'
import './AddDeliveryAddressForm.scss'
import { getStreetVariants } from '../../../../../Redux/actions/order'
import Street from '../../../../../Interfaces/Street'

interface AddDeliveryAddressFormProps {
  addDeliveryAddress: (deliveryAddress: Address) => void
  renderEntryPage: (entryPage: string) => void
  getStreetVariants: any
  deliveryAddressesCount: number
  loading: boolean
  loadingOrder: boolean
  error: string
}

interface AddDeliveryAddressFormState {
  deliveryAddress: Address
  validationTextfields: DeliveryAddressValidation[]
}

class AddDeliveryAddressForm extends React.Component<AddDeliveryAddressFormProps, AddDeliveryAddressFormState> {
  constructor(props: AddDeliveryAddressFormProps) {
    super(props)
    this.state = {
      deliveryAddress: {
        house: '',
        street: { name: '' },
        flat: '',
        comment: '',
        entrance: '',
        floor: '',
        name: '',
        id: '',
      },
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
      ],
    }
  }

  textFieldInputHandler = (value: string, textFieldName: string): void => {
    const state = this.state

    textFieldName === 'flat' && (state.deliveryAddress.flat = value)
    textFieldName === 'comment' && (state.deliveryAddress.comment = value)
    textFieldName === 'entrance' && (state.deliveryAddress.entrance = value)
    textFieldName === 'floor' && (state.deliveryAddress.floor = value)
    textFieldName === 'house' && (state.deliveryAddress.house = value)
    textFieldName === 'name' && (state.deliveryAddress.name = value)
    textFieldName === 'street' && (state.deliveryAddress.street.name = value)

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

  addButtonHandler = (): void => {
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
      const formData: Address = {
        flat: this.state.deliveryAddress.flat,
        comment: this.state.deliveryAddress.comment,
        entrance: this.state.deliveryAddress.entrance,
        floor: this.state.deliveryAddress.floor,
        house: this.state.deliveryAddress.house,
        name: this.state.deliveryAddress.name,
        street: this.state.deliveryAddress.street,
        id: Date.now().toString(),
      }

      this.props.addDeliveryAddress(formData)
    } else {
      this.setState({ validationTextfields })
    }
  }

  getStreetsFromIiko = async (street: string) => {
    if (street.length % 4 === 0 && street.length > 0) {
      const streetVariants: Street[] = await this.props.getStreetVariants(street)
      const streetInput = document.getElementById('street') as HTMLInputElement
      const datalist = document.getElementById('list-street')
      let options: String[] = []
      if (datalist && streetInput) {
        streetVariants.map((street) => {
          options.push(`<option value="${street.name}" data-id=${street.id}>${street.name}</option>`)
        })
        datalist.innerHTML = options.join('')
      }
    }
  }

  render() {
    return (
      <Container className={'AddDeliveryAddressForm'}>
        <Row className="pl-4 pr-4">
          <Col className="form-group p-0 m-0">
            <div className="AddDeliveryAddressForm__textField">
              <label htmlFor="name" className="formLabel">
                Название
              </label>
              <input
                autoComplete="off"
                type="text"
                className="form-control"
                id="name"
                placeholder="Дом, работа.."
                defaultValue={this.state.deliveryAddress.name}
                onInput={(e: React.FormEvent<HTMLInputElement>) =>
                  this.textFieldInputHandler(e.currentTarget.value, 'name')
                }
              />
              {/* <span className="fieldError text-warning" id="name">Заполните поле</span> */}
            </div>
          </Col>
        </Row>
        <Row className="pl-4 pr-4">
          <Col className="form-group p-0 m-0">
            <div className="AddDeliveryAddressForm__textField">
              <label htmlFor="street" className="formLabel">
                Улица
              </label>
              <div className="d-flex justify-content-center">
                <div hidden={!this.props.loadingOrder} className="spinner-border" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
              <input
                list="list-street"
                autoComplete="off"
                type="text"
                className="form-control"
                id="street"
                placeholder="Савушкина"
                onKeyPress={(e: React.FormEvent<HTMLInputElement>) => {
                  this.getStreetsFromIiko(e.currentTarget.value)
                }}
                onInput={(e: React.FormEvent<HTMLInputElement>) => {
                  this.textFieldInputHandler(e.currentTarget.value, 'street')
                }}
                defaultValue={this.state.deliveryAddress.street.name}
              />

              <datalist id="list-street"></datalist>

              {this.state.validationTextfields[0].touched && !this.state.validationTextfields[0].isValid ? (
                <span className="fieldError text-warning" id="street">
                  Заполните поле
                </span>
              ) : (
                ''
              )}
            </div>
          </Col>
        </Row>
        <Row className="pl-4 pr-4">
          <Col className="form-group p-0 m-0">
            <div className="AddDeliveryAddressForm__textField">
              <label htmlFor="house" className="formLabel">
                Дом (корпус, строение)
              </label>
              <input
                autoComplete="off"
                type="text"
                className="form-control"
                id="house"
                placeholder="4к1"
                onInput={(e: React.FormEvent<HTMLInputElement>) =>
                  this.textFieldInputHandler(e.currentTarget.value, 'house')
                }
                defaultValue={this.state.deliveryAddress.house}
              />
              {this.state.validationTextfields[1].touched && !this.state.validationTextfields[1].isValid ? (
                <span className="fieldError text-warning" id="house">
                  Заполните поле
                </span>
              ) : (
                ''
              )}
            </div>
          </Col>
        </Row>
        <Row className="pl-4 pr-4">
          <Col xs={6} className="form-group p-0 m-0">
            <div className="AddDeliveryAddressForm__textField">
              <label htmlFor="flat" className="formLabel">
                Квартира
              </label>
              <input
                autoComplete="off"
                type="text"
                className="form-control"
                id="flat"
                placeholder="98"
                defaultValue={this.state.deliveryAddress.flat}
                onInput={(e: React.FormEvent<HTMLInputElement>) =>
                  this.textFieldInputHandler(e.currentTarget.value, 'flat')
                }
              />
            </div>
          </Col>
          <Col xs={6} className="form-group p-0 m-0">
            <div className="AddDeliveryAddressForm__textField">
              <label htmlFor="entrance" className="formLabel">
                Подъезд
              </label>
              <input
                autoComplete="off"
                type="text"
                className="form-control"
                id="entrance"
                placeholder="3"
                defaultValue={this.state.deliveryAddress.entrance}
                onInput={(e: React.FormEvent<HTMLInputElement>) =>
                  this.textFieldInputHandler(e.currentTarget.value, 'entrance')
                }
              />
            </div>
          </Col>
        </Row>
        <Row className="pl-4 pr-4">
          <Col xs={6} className="form-group p-0 m-0">
            <div className="AddDeliveryAddressForm__textField">
              <label htmlFor="floor" className="formLabel">
                Этаж
              </label>
              <input
                autoComplete="off"
                type="text"
                className="form-control"
                id="floor"
                placeholder="8"
                defaultValue={this.state.deliveryAddress.floor}
                onInput={(e: React.FormEvent<HTMLInputElement>) =>
                  this.textFieldInputHandler(e.currentTarget.value, 'floor')
                }
              />
            </div>
          </Col>
        </Row>
        <Row className="pl-4 pr-4">
          <Col className="form-group p-0 m-0">
            <div className="AddDeliveryAddressForm__textField">
              <label htmlFor="comment" className="formLabel">
                Комментарий
              </label>
              <input
                autoComplete="off"
                type="text"
                className="form-control"
                id="comment"
                placeholder="Домофон не работает..."
                onInput={(e: React.FormEvent<HTMLInputElement>) =>
                  this.textFieldInputHandler(e.currentTarget.value, 'comment')
                }
              />
            </div>
          </Col>
        </Row>
        <div className="DAFunderButtonCont">
          <Container className="h-100 m-0 p-0">
            <Row className="h-100 m-0 p-0">
              <Col
                xs={6}
                className="h-100 d-flex justify-content-center align-items-center DAFunderButton"
                style={{ backgroundColor: '#5EAD03' }}
                onClick={() => this.addButtonHandler()}
              >
                {this.props.loading ? (
                  <div className="spinner-border text-light mr-2" role="status">
                    <span className="sr-only">Загрузка...</span>
                  </div>
                ) : null}
                Добавить
              </Col>
              <Col
                xs={6}
                className="h-100 d-flex justify-content-center align-items-center DAFunderButton"
                style={{ backgroundColor: '#575757' }}
                onClick={() => this.props.renderEntryPage('deliveryAddress')}
              >
                Отменить
              </Col>
            </Row>
          </Container>
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(AddDeliveryAddressForm)
