import React, { Component } from 'react'
import { connect } from 'react-redux'
import Order from '../../../../../../Interfaces/Order'
import './NewOrderDetails.scss'

type NewOrderDetailsState = {
  isShowProducts: boolean
  collapseClass: string
}

type NewOrderDetailsProps = {
  order: Order
}
class NewOrderDetails extends Component<NewOrderDetailsProps, NewOrderDetailsState> {
  constructor(props: NewOrderDetailsProps) {
    super(props)
    this.state = {
      isShowProducts: false,
      collapseClass: '',
    }
  }
  collapseClickHandler = () => {
    this.setState({
      isShowProducts: !this.state.isShowProducts,
    })
  }

  showAddress = () => {
    if (this.props.order.address) {
      let { flat, house, comment, entrance, floor, street } = this.props.order.address
      const streetDisplay = street.name ? ` ул. ${street.name}` : ''
      house = house ? `, д. ${house}` : ''
      flat = flat ? `, кв. ${flat}` : ''

      return `${streetDisplay}   ${house}  ${flat}`
    }
    return ''
  }

  render() {
    return (
      <div className="newOrder-details mt-4">
        <div className="newOrder-details__title pb-2">Детали заказа</div>

        <div
          onClick={this.collapseClickHandler}
          className={`newOrder-details__collapse d-flex mt-4 noselect ${
            this.state.isShowProducts ? 'active-collapse' : ''
          } `}
        >
          Список позиций
          <img
            className={`newOrder-details__arrow ${this.state.isShowProducts ? 'active-arrow' : ''}`}
            src="images/arrow-white.png"
            alt="arrow"
          />
        </div>
        <div hidden={!this.state.isShowProducts} className="newOrder-details__products mt-3">
          {this.props.order.items?.map((orderItem, index) => {
            return (
              <div key={index} className="newOrder__product">
                <div className="newOrder__product__name">{orderItem.product.name}</div>
                <div className="d-flex  justify-content-between mt-2 newOrder__product__details">
                  <div className="newOrder__product__size">{orderItem.productVariant.name}</div>
                  <div className="newOrder__product__amount">{orderItem.amount} шт</div>
                  <div className="newOrder__product__weight">{orderItem.productVariant.weight} гр</div>
                  <div className="newOrder__product__value">{orderItem.value * orderItem.amount} РУБ</div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="newOrder-details__shipping mt-5 d-flex justify-content-between">
          <div className="shipping__title">{this.props.order.isDelivery ? 'Доставка' : 'Самовывоз'}</div>
          <div className="shipping__address">{this.showAddress()}</div>
        </div>

        <div className="newOrder-details__date mt-5 d-flex justify-content-between">
          <div className="date__title">Время заказа</div>
          <div className="date__text">{this.props.order.date}</div>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = {}

const mapStateToProps = (state: any) => {
  const { order } = state
  return {
    order: order.order,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewOrderDetails)
