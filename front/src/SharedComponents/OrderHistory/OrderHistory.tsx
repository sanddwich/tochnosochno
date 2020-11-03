import React from 'react'
import { connect } from 'react-redux'
import Customer from '../../Interfaces/Customer'
import Order from '../../Interfaces/Order'
import OrderItem from '../../Interfaces/OrderItem'
import { RootState } from '../../Redux'
import BlockName from '../BlockName/BlockName'
import LineProductWithCart from '../LineProductWithCart/LineProductWithCart'
import { format, setGlobalDateI18n } from 'fecha'
import { scroller, Element } from 'react-scroll'

import './OrderHistory.scss'
import ComboItemOrder from '../../Interfaces/ComboItemOrder'
import Category from '../../Interfaces/Category'
import _ from 'lodash'
import ComboOrderBlockDescription from '../ComboOrderBlockDescription/ComboOrderBlockDescription'
import orderItem from '../../Redux/reducers/orderItem'
import { Col, Container, Row } from 'react-bootstrap'

interface OrderHistoryProps {
  customer: Customer
  menu: Category[]
}

interface OrderHistoryState {
  allOrders: Order[]
  ordersAtPage: Order[]
  pages: number
  activePage: number
}

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

const ordersPerPage: number = 6

class OrderHistory extends React.Component<OrderHistoryProps, OrderHistoryState> {
  constructor(props: OrderHistoryProps) {
    super(props)
    this.state = {
      activePage: 1,
      pages: this.props.customer.orders
        ? Math.ceil(this.getNoEmptyOrders(this.props.customer.orders).length / ordersPerPage)
        : 1,
      allOrders: this.props.customer.orders ? this.getNoEmptyOrders(this.props.customer.orders) : [],
      ordersAtPage: this.getPageOrders(this.getNoEmptyOrders(this.props.customer.orders), 1),
    }
  }

  getNoEmptyOrders = (allOrders: Order[]): Order[] => {
    let resultOrders: Order[] = []
    allOrders.map((order) => {
      if (order.items && order.items.length > 0) {
        resultOrders.push(order)
      }
    })
    // console.log(resultOrders)
    return resultOrders
  }

  getPageOrders = (allOrders: Order[], activePage: number): Order[] => {
    let ordersAtPage: Order[] = []
    for (let i = (activePage - 1) * ordersPerPage; i < activePage * ordersPerPage; i++) {
      if (allOrders[i]) {
        ordersAtPage.push(allOrders[i])
      }
    }
    return ordersAtPage
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

  renderCombos = (order: Order): any => {
    const filterComboItems = order.items?.filter((orderItem) => orderItem.comboId !== '') as OrderItem[]
    if (filterComboItems && filterComboItems.length > 0) {
      return this.getCombos(filterComboItems).map((comboItem, index) => {
        const category = this.props.menu.find((cat) => cat.id === comboItem.comboId) as Category
        return (
          <React.Fragment key={comboItem.comboId}>
            <h1 style={{ fontWeight: 500, paddingTop: 10 }}>Набор комбо:</h1>
            <ComboOrderBlockDescription category={category} comboItem={comboItem} history={true} />
          </React.Fragment>
        )
      })
    }
  }

  setPage = (activePage: number): void => {
    const ordersAtPage = this.getPageOrders(this.state.allOrders, activePage)
    this.setState({ activePage, ordersAtPage })
    this.scrollTo('OrderHistoryBegin')
  }

  getPagesStringArray = (pages: number): number[] => {
    let pagesStringArray: number[] = []
    for (let i = 1; i <= pages; i++) {
      pagesStringArray.push(i)
    }
    return pagesStringArray
  }

  transformDate = (date: string): string => {
    let tmpDate: any = date.split(' ')
    tmpDate[0] = tmpDate[0].split('.')[2] + '.' + tmpDate[0].split('.')[1] + '.' + tmpDate[0].split('.')[0]
    return tmpDate[0] + ' ' + tmpDate[1]
  }

  scrollTo = (name: string): void => {
    scroller.scrollTo(name, {
      duration: 500,
      delay: 0,
      smooth: true,
      offset: -220, // Scrolls to element + 50 pixels down the page
    })
  }

  render() {
    const pagesStringArray: number[] = this.getPagesStringArray(this.state.pages)
    return (
      <div className="OrderHistory">
        <Element name="OrderHistoryBegin">
          <div className="row m-0 mt-5">
            <BlockName name="Последние заказы" />
          </div>
        </Element>
        {this.props.customer.orders.length > 0 ? (
          <React.Fragment key={this.props.customer.orders.length}>
            {/* {this.props.customer.orders.map((order: Order) => { */}
            {this.state.ordersAtPage.map((order: Order) => {
              if (order.items && order.items.length > 0) {
                return (
                  <React.Fragment key={order.id}>
                    <div className="OrderHistory__date">
                      <div className="OrderHistory__orderDate">
                        <span>Заказ оформлен: </span>
                        {order.date
                          ? format(new Date(this.transformDate(order.date)), 'DD MMMM YYYY HH:mm:ss', i18)
                          : null}
                      </div>
                      <div className="OrderHistory__orderToDate">
                        <span>Доставка: </span>
                        {order.completeBefore
                          ? format(new Date(order.completeBefore), 'DD MMMM YYYY HH:mm:ss', i18)
                          : null}
                      </div>
                    </div>

                    {this.renderCombos(order)}

                    {order.items?.map((orderItem: OrderItem) => {
                      if (!orderItem.comboId) {
                        return (
                          <React.Fragment key={orderItem.id}>
                            <h1 style={{ fontWeight: 500, paddingTop: 10, marginBottom: 0 }}>Блюдо: </h1>
                            <LineProductWithCart product={orderItem.product} />
                          </React.Fragment>
                        )
                      }
                    })}
                  </React.Fragment>
                )
              }
            })}

            <Container className="p-0">
              <Row className="OrderHistory__pagesCont p-0 m-0 mt-5 mb-5">
                <Col className="OrderHistory__pagesTitle p-0 m-0" md={4} lg={3}>
                  <h1>Страница</h1>
                </Col>
                <Col
                  className="OrderHistory__pagesStickers p-0 m-0 pl-4 pr-4 d-flex justify-content-start"
                  md={8}
                  lg={9}
                >
                  {pagesStringArray.map((pageNumber, index) => {
                    return (
                      <div
                        key={index}
                        className="OrderHistory__pageNum"
                        style={{ backgroundColor: pageNumber === this.state.activePage ? '#FFD12D' : '#E2E2E2' }}
                        onClick={() => this.setPage(pageNumber)}
                      >
                        {pageNumber}
                      </div>
                    )
                  })}
                </Col>
              </Row>
            </Container>
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
    customer,
    menu,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderHistory)
