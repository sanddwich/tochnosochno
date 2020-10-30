import React from 'react'
import { connect } from 'react-redux'
import Customer from '../../Interfaces/Customer'
import Order from '../../Interfaces/Order'
import OrderItem from '../../Interfaces/OrderItem'
import { RootState } from '../../Redux'
import BlockName from '../BlockName/BlockName'
import LineProductWithCart from '../LineProductWithCart/LineProductWithCart'

import './OrderHistory.scss'

interface OrderHistoryProps {
  customer: Customer
}

interface OrderHistoryState {}

class OrderHistory extends React.Component<OrderHistoryProps, OrderHistoryState> {
  constructor(props: OrderHistoryProps) {
    super(props)
  }

  getOrderDate = (order: Order) => {
    return <div>{order.date}</div>
  }

  render() {
    return (
      <div className="OrderHistory">
        <div className="row m-0 mt-5">
          <BlockName name="Последние заказы" />
        </div>
        {this.props.customer.orders.length > 0 ? (
          this.props.customer.orders.map((order: Order) => {
            return order.items?.map((orderItem: OrderItem) => {
              return <LineProductWithCart key={orderItem.id} product={orderItem.product} />
            })
          })
        ) : (
          <div className="row m-0 mt-4 profile__text">Сейчас тут ничего нет :( И мы ждем вашего заказа :)</div>
        )}
      </div>
    )
  }
}

const mapDispatchToProps = {}

const mapStateToProps = (state: RootState) => {
  const { customer } = state.auth
  return {
    customer,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderHistory)
