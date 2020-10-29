import React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import Category from '../../Interfaces/Category'
import Order from '../../Interfaces/Order'
import OrderItem from '../../Interfaces/OrderItem'
import Product from '../../Interfaces/Product'
import { RootState } from '../../Redux'
import order from '../../Redux/reducers/order'
import ActionButton from '../ActionButton/ActionButton'
import BlockName from '../BlockName/BlockName'
import LineProductWithNumberInput from '../LineProductWithNumberInput/LineProductWithNumberInput'
import NumberInput from '../NumberInput/NumberInput'
import OrderTotalPrice from '../OrderTotalPrice/OrderTotalPrice'
import { setGuestCount } from '../../Redux/actions/order'

import './CartOrder.scss'
import ComboOrderBlockDescription from '../ComboOrderBlockDescription/ComboOrderBlockDescription'
import _ from 'lodash'
import ComboItemOrder from '../../Interfaces/ComboItemOrder'

interface CartOrderProps {
  menu: Category[]
  order: Order
  setGuestCount: (count: number) => void
}

interface CartOrderState {
  cartProducts: OrderItem[]
  cartCombos: ComboItemOrder[]
}

class CartOrder extends React.Component<CartOrderProps, CartOrderState> {
  constructor(props: CartOrderProps) {
    super(props)
    this.state = {
      cartProducts: this.setStateCartProducts() || [],
      cartCombos: this.setStateCartCombos() || [],
    }
    // console.log(this.props.menu)
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

  setStateCartProducts = (): OrderItem[] => {
    let cartProducts: any = this.props.order.items?.filter((item) => {
      if (typeof item.comboId === 'undefined') {
        return item
      }
    })
    return cartProducts
  }

  setStateCartCombos = (): ComboItemOrder[] => {
    let cartCombo: any = this.props.order.items?.filter((item) => {
      if (typeof item.comboId !== 'undefined') {
        return item.product
      }
    })

    return cartCombo.length > 0 ? this.getCombos(cartCombo) : []
    // return this.getCombos(cartCombo)
  }

  renderComboListBlock = (): any => {
    return (
      <div className="CartOrder__products mt-3 mb-3">
        <h1>Наборы Комбо:</h1>
        {this.state.cartCombos.map((comboItem: ComboItemOrder, index) => {
          const category = this.props.menu.find(cat => cat.id === comboItem.comboId) as Category
          return <ComboOrderBlockDescription key={index+comboItem.comboId} comboItem={comboItem} category={category} />
        })}
      </div>
    )
  }

  renderProductListBlock = (): any => {
    return (
      <div className="CartOrder__products mb-3">
        <h1>Продукты:</h1>
        {this.state.cartProducts.map((orderItem: OrderItem) => {
          return <LineProductWithNumberInput key={orderItem.id} orderItem={orderItem} />
        })}
      </div>
    )
  }

  render() {
    // console.log(this.state.cartProducts)
    // console.log(this.state.cartCombos)
    // console.log(this.props.showComboModal)

    return (
      <div className="CartOrder">
        <div className="CartOrder__banner-mob">
          <img className="img-fluid" src="/images/banners/full_banner.jpg" alt="" />
        </div>
        <div className="CartOrder__left">
          <BlockName name="Ваш заказ" />
          <React.Fragment>
            {this.props.order.items && this.props.order.items.length > 0 ? (
              <React.Fragment>
                {this.state.cartCombos.length > 0 ? this.renderComboListBlock() : null}

                {this.state.cartProducts.length > 0 ? this.renderProductListBlock() : null}

                <div className="CartOrder__guests">
                  <NumberInput
                    minValue={1}
                    value={this.props.order.guests.count}
                    onChange={(count: number) => this.props.setGuestCount(count)}
                    label="Количество персон"
                    hideLabel={false}
                  />
                </div>

                <OrderTotalPrice />
              </React.Fragment>
            ) : (
              <div className="CartOrder__empty">
                <div className="CartOrder__empty__text">
                  Сейчас тут ничего нет :( И мы ждем вашего заказа :) Для этого перейдите в меню и добавьте сочную еду в
                  корзину.
                </div>
                <NavLink to="/">
                  <ActionButton
                    onClick={() => null}
                    textColor="white"
                    width="260px"
                    text="Перейти в меню"
                    backgroundColor="#303030"
                    icon="dish-dark.svg"
                    hideTextMobile={false}
                  />
                </NavLink>
              </div>
            )}
          </React.Fragment>
        </div>

        <div className="CartOrder__banner">
          <img className="img-fluid" src="/images/banners/cart-banner.png" alt="" />
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = {
  setGuestCount,
}

const mapStateToProps = (state: RootState) => {
  const { order } = state.order
  const { menu } = state.menu
  return {
    order,
    menu,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CartOrder)
