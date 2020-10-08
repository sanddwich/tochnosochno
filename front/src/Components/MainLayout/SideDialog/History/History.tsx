import React, { Component } from 'react'
import { connect } from 'react-redux'
import Customer from '../../../../Interfaces/Customer'
import { BackButton } from '../../../../SharedComponents/BackButton/BackButton'
import LoginForm from '../Cart/LoginForm/LoginForm'
import { hideSideDialog, showOrderDetail } from '../../../../Redux/actions/app'
import './History.scss'
import Order from '../../../../Interfaces/Order'
import Bonus from '../Payment/Components/Bonus/Bonus'
import Address from '../../../../Interfaces/Address'

type HistoryState = {}

type HistoryProps = {
  hideSideDialog: () => {}
  showOrderDetail: (order: Order) => {}
  customer: Customer
}
class History extends Component<HistoryProps, HistoryState> {
  constructor(props: any) {
    super(props)
  }
  showAddress = (address: Address | undefined) => {
    if (address) {
      let { apartment, house, comment, entrance, floor, street } = address
      street = street ? ` ул. ${street}` : ''
      house = house ? `, д. ${house}` : ''
      apartment = apartment ? `, кв. ${apartment}` : ''

      return `${street}   ${house}  ${apartment}`
    }
    return ''
  }

  render() {
    let orderItems

    if (this.props.customer) {
      orderItems = this.props.customer.orders.map((order, index) => {
        return (
          <div key={index.toString()} className="order-row pt-3">
            <div className="d-flex justify-content-between">
              <div className="order-row__status">{order.status}</div>
              <div className="order-row__more d-flex justify-content-between">
                <div onClick={() => this.props.showOrderDetail(order)} className="history__details">
                  <div className="align-self-stretch flex-fill">Подробнее</div>

                  <div className="align-self-stretch flex-fill ml-1">
                    <img src="images/info-icon.svg" alt="info" />
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex  pt-3 order-row__address">{this.showAddress(order.address)}</div>
            <div className="d-flex justify-content-between pt-3">
              <div className="order-row__date">{order.date}</div>
              <div className="order-row__amount">{order.amount} РУБ</div>
            </div>
          </div>
        )
      })
    } else {
      orderItems = <div></div>
    }

    return (
      <section className="history">
        <LoginForm />
        <BackButton text="Вернуться назад" onClick={this.props.hideSideDialog} />
        {this.props.customer ? <Bonus showCheck={false} value={this.props.customer.bonus} /> : null}

        <div className="history__order__title mb-4">
          <h3>История заказов</h3>
        </div>
        <div className="container-fluid mt-4 history__order-items">
          <div className="container">{orderItems}</div>
        </div>
      </section>
    )
  }
}

const mapDispatchToProps = {
  hideSideDialog,
  showOrderDetail,
}

const mapStateToProps = (state: any) => {
  const { auth } = state
  return {
    customer: auth.customer,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(History)
