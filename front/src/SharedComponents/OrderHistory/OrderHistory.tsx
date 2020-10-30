import React from 'react'
import { connect } from 'react-redux'
import Customer from '../../Interfaces/Customer'
import Order from '../../Interfaces/Order'
import OrderItem from '../../Interfaces/OrderItem'
import { RootState } from '../../Redux'
import BlockName from '../BlockName/BlockName'
import LineProductWithCart from '../LineProductWithCart/LineProductWithCart'
import { format, setGlobalDateI18n } from 'fecha'

import './OrderHistory.scss'

interface OrderHistoryProps {
  customer: Customer
}

interface OrderHistoryState {}

const i18: any = {
  monthNames: [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
  ],
}

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
          <React.Fragment>
            <input
              disabled={false}
              name="birthday"
              id="profile-birthday"
              style={{ width: '150px' }}
              type="date"
              onChange={(event) => console.log(111)}
              value={new Date().toISOString().slice(0, 10)}
              placeholder="мм.мм.гггг"
            />

            {this.props.customer.orders.map((order: Order) => {
              return (
                <React.Fragment key={order.id}>
                  <div className="OrderHistory__date">
                    {order.completeBefore ? format(new Date(order.completeBefore), 'DD MMMM YYYY', i18) : null}
                  </div>
                  {order.items?.map((orderItem: OrderItem) => {
                    if (!orderItem.comboId) {
                      return <LineProductWithCart key={orderItem.id} product={orderItem.product} />
                    }
                  })}
                </React.Fragment>
              )
            })}
          </React.Fragment>
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
