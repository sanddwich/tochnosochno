import React, { Component } from 'react'
import { connect } from 'react-redux'
import { BackButton } from '../../../../SharedComponents/BackButton/BackButton'
import LoginForm from '../Cart/LoginForm/LoginForm'
import { showHistoryDialog } from '../../../../Redux/actions/app'
import Order from '../../../../Interfaces/Order'
import './OrderDetails.scss'
import order from '../../../../Redux/reducers/order'
import Address from '../../../../Interfaces/Address'

type OrderDetailsState = {}

type OrderDetailsProps = {
  showHistoryDialog: () => {}
  orderHistory: Order
}
class OrderDetails extends Component<OrderDetailsProps, OrderDetailsState> {
  componentWillMount() {}

  componentDidMount() {}

  showAddress = (address: Address | undefined) => {
    if (address) {
      let { flat, house, comment, entrance, floor, street } = address
      const streetDisplay = street.name ? ` ул. ${street.name}` : ''
      house = house ? `, д. ${house}` : ''
      flat = flat ? `, кв. ${flat}` : ''

      return `${streetDisplay}   ${house}  ${flat}`
    }
    return ''
  }

  render() {
    return (
      <section className="order-details">
        <LoginForm />
        <BackButton text={'Вернуться'} onClick={this.props.showHistoryDialog} />
        <div className="container-fluid mt-5 ">
          <div className="container ">
            <div className="order-row pt-3 pb-3 order-details__info">
              <div className="d-flex justify-content-between">
                <div className="order-row__status">{this.props.orderHistory.status}</div>
              </div>
              <div className="d-flex  pt-3 order-row__address">{this.showAddress(this.props.orderHistory.address)}</div>
              <div className="d-flex justify-content-between pt-3">
                <div className="order-row__date">{this.props.orderHistory.date}</div>
                <div className="order-details__product__value">{this.props.orderHistory.amount} РУБ</div>
              </div>
            </div>

            <div className="order-row pt-5 order-details__products ">
              {this.props.orderHistory.items?.map((orderItem, index) => {
                const name = orderItem.productVariant.product.name
                const orderItemValue =
                  orderItem.amount *
                  (orderItem.productVariant.price +
                    orderItem.orderItemModifiers.reduce((acc, modifier) => {
                      return acc + modifier.amount * modifier.productModifier.modifier.price
                    }, 0))
                const productNameWords = name.split(' ')
                const productNameFirst = productNameWords[0]
                productNameWords.shift()
                const productNameLast = productNameWords.join(' ')
                return (
                  <div key={index} className="order-details__product">
                    <div className="d-flex justify-content-between">
                      <div className="order-details__product__name">
                        <span className="lined-text text-white">{productNameFirst}</span>
                      </div>
                      <div className="order-details__product__amount">{orderItem.amount} шт</div>
                    </div>

                    <div className="d-flex justify-content-between">
                      <div className="order-details__product__name">
                        <div className="mt-2">
                          <span className="product-name text-white">{productNameLast}</span>
                        </div>
                      </div>
                      <div className="d-flex justify-content-end mt-2">
                        <div className="order-details__product__value text-right">{orderItemValue}</div>
                        <div className="order-details__product__currency text-right ml-2">руб</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div className="order-details__buttons">
          {/* <div className="order-details__button support-btn"> Связаться с поддержкой</div> */}
          <div onClick={this.props.showHistoryDialog} className="order-details__button repeat-btn">
            Отмена
          </div>
        </div>
      </section>
    )
  }
}

const mapDispatchToProps = {
  showHistoryDialog,
}

const mapStateToProps = (state: any) => {
  const { app } = state
  return {
    orderHistory: app.orderHistory,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetails)
