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
import ComboItemOrder from '../../Interfaces/ComboItemOrder'
import Category from '../../Interfaces/Category'
import _ from 'lodash'

interface OrderHistoryProps {
  customer: Customer
  menu: Category[]
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

  getCombos = (comboProducts: OrderItem[]): ComboItemOrder[] => {
    // Уникальные значения pickData
    let pickDatas: number[] = []
    comboProducts.map((item) => {
      pickDatas.push(item.pickDate || 0)
    })
    pickDatas = _.uniq(pickDatas)

    //Получение массива подмассивов OrderItem с уникальными pickData
    let orderItemsPools = pickDatas.map((pd) => {
      const pdProducts = comboProducts.filter((cp) => cp.pickDate === pd)
      return pdProducts
    })

    //Формирование массива элементов типа Combo (ComboItemOrder)
    const comboItemsOrder: ComboItemOrder[] = orderItemsPools.map((comboItems) => {
      // console.log(comboItems)
      const result: ComboItemOrder = {
        comboId: comboItems[0].comboId || '',
        name: this.props.menu.find((cat) => cat.id === comboItems[0].comboId)?.name || '',
        pickDate: comboItems[0].pickDate || 0,
        image: this.props.menu.find((cat) => cat.id === comboItems[0].comboId)?.imageLinks,
        products: comboItems.map((comboItem) => comboItem.product),
      }
      return result
    })

    return comboItemsOrder
  }

  render() {
    // console.log(this.props.customer.orders)
    return (
      <div className="OrderHistory">
        <div className="row m-0 mt-5">
          <BlockName name="Последние заказы" />
        </div>
        {this.props.customer.orders.length > 0 ? (
          <React.Fragment>
            {/* <input
              disabled={false}
              name="birthday"
              id="profile-birthday"
              style={{ width: '150px' }}
              type="date"
              onChange={(event) => console.log(event.target.value)}
              value={new Date().toISOString().slice(0, 10)}
              placeholder="мм.мм.гггг"
            /> */}

            {this.props.customer.orders.map((order: Order) => {
              console.log(order)
              // const orderComboProducts = order.items?.filter(product => product.comboId && product.comboId !== '')
              // console.log(orderComboProducts)
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
  const { menu } = state.menu
  return {
    customer, menu
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderHistory)
