import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { connect } from 'react-redux'
import Address from '../../../../../Interfaces/Address'
import { DeliveryAddressValidation } from '../../../../../Interfaces/DeliveryAddressValidation'
import './AddDeliveryAddressForm.scss'

interface AddDeliveryAddressFormProps {
  addDeliveryAddress: (deliveryAddress: Address) => void
  renderEntryPage: (entryPage: string) => void
  deliveryAddressesCount: number
  loading: boolean
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
        street: '',
        apartment: '',
        comment: '',
        entrance: '',
        floor: '',
        name: '',
        id: -1
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

    textFieldName === 'apartment' && (state.deliveryAddress.apartment = value)
    textFieldName === 'comment' && (state.deliveryAddress.comment = value)
    textFieldName === 'entrance' && (state.deliveryAddress.entrance = value)
    textFieldName === 'floor' && (state.deliveryAddress.floor = value)
    textFieldName === 'house' && (state.deliveryAddress.house = value)
    textFieldName === 'name' && (state.deliveryAddress.name = value)
    textFieldName === 'street' && (state.deliveryAddress.street = value)

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

    const validationTextfields = this.state.validationTextfields
    validationTextfields.map((textfield) => {
      let isValid: boolean = true
      let value = ''
      textfield.name === 'street' && (value = this.state.deliveryAddress.street)
      textfield.name === 'house' && (value = this.state.deliveryAddress.house)

      if (textfield.required) {
        isValid = isValid && value.trim() !== ''
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
        apartment: this.state.deliveryAddress.apartment,
        comment: this.state.deliveryAddress.comment,
        entrance: this.state.deliveryAddress.entrance,
        floor: this.state.deliveryAddress.floor,
        house: this.state.deliveryAddress.house,
        name: this.state.deliveryAddress.name,
        street: this.state.deliveryAddress.street,
        id: Date.now(),        
      }

      this.props.addDeliveryAddress(formData)
    } else {
      this.setState({ validationTextfields })
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
              <input
                autoComplete="off"
                type="text"
                className="form-control"
                id="street"
                placeholder="Савушкина"
                onInput={(e: React.FormEvent<HTMLInputElement>) =>
                  this.textFieldInputHandler(e.currentTarget.value, 'street')
                }
                defaultValue={this.state.deliveryAddress.street}
              />
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
              <label htmlFor="apartment" className="formLabel">
                Квартира
              </label>
              <input
                autoComplete="off"
                type="text"
                className="form-control"
                id="apartment"
                placeholder="98"
                defaultValue={this.state.deliveryAddress.apartment}
                onInput={(e: React.FormEvent<HTMLInputElement>) =>
                  this.textFieldInputHandler(e.currentTarget.value, 'apartment')
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

const mapDispatchToProps = {}

const mapStateToProps = (state: any) => {
  const { loading, error } = state.auth
  return {
    loading: loading,
    error: error,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddDeliveryAddressForm)
