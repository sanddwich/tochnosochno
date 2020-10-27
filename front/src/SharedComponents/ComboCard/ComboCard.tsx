import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import Product from '../../Interfaces/Product'
import RoundButton from '../RoundButton/RoundButton'
import Sticker from '../Sticker/Sticker'
import { showComboModal } from '../../Redux/actions/app'
import { addOrderItemToOrder, setOrderItemAmount, deleteOrderItem } from '../../Redux/actions/order'

import './ComboCard.scss'
import ActionButton from '../ActionButton/ActionButton'
import { connect } from 'react-redux'
import OrderItem from '../../Interfaces/OrderItem'
import { RootState } from '../../Redux'
import Order from '../../Interfaces/Order'
import NumberInput from '../NumberInput/NumberInput'
import FavouriteRoundButton from '../FavouriteRoundButton/FavouriteRoundButton'
import Category from '../../Interfaces/Category'
import AddComboButton from '../AddComboButton/AddComboButton'
// import { NavLink } from 'react-router-dom'

interface ComboCardProps {
  order: Order
  combo: Category
  showComboModal: (combo: Category) => void
  addOrderItemToOrder: (orderItem: OrderItem) => void
  setOrderItemAmount: (orderItem: OrderItem, amount: number) => void
  deleteOrderItem: (orderItem: OrderItem) => void
}

interface ComboCardState {
  orderItem: OrderItem | null
}

const newPrice: number = 200
const oldPrice: number = 300

class ComboCard extends React.Component<ComboCardProps, ComboCardState> {
  constructor(props: ComboCardProps) {
    super(props)
    this.state = {
      orderItem: null,
    }
  }

  componentDidMount() {
    // console.log(this.props.combo)
  }

  render() {
    // const comboPrice: number = 0
    const comboPrice: number = this.props.combo.products[0].sizePrices[0].price.currentPrice * (this.props.combo.comboProductsCount || 1)
    return (
      <React.Fragment>
        <Container className="ComboCard p-3 m-0">
          <Container className="ComboCard__container p-0 m-0">
            <Row className="ComboCard__firstLine p-0 m-0 d-flex justify-content-between">
              <div className="ComboCard__favoriteButton">
                {/* <FavouriteRoundButton product={this.props.combo.} /> */}
                {/* <RoundButton icon="favorite.svg" backgroundColor="#F2F2F2" onClick={() => this.favoriteClick()} /> */}
              </div>
              <div className="ComboCard__stickerCont">
                {/* <Sticker title="Новинка" backgroundColor="#FFD74B" /> */}
                <Sticker title="Акция" backgroundColor="#FF371C" />
              </div>
            </Row>

            <Row
              className="ComboCard__img d-flex justify-content-center"
              onClick={() => this.props.showComboModal(this.props.combo)}
            >
              <img
                className="img-fluid"
                src={
                  typeof this.props.combo.imageLinks[0] !== 'undefined'
                    ? `${this.props.combo.imageLinks[0]}`
                    : '/images/products/no-photo.png'
                }
                alt={this.props.combo.name}
                style={{cursor:'pointer'}}
              />
            </Row>

            <Row className="ComboCard__textContent">
              <div className="ComboCard__title w-100" onClick={() => this.props.showComboModal(this.props.combo)}>
                <h1>{this.props.combo.name}</h1>
              </div>

              <div className="ComboCard__desc w-100">{this.props.combo.description}</div>
            </Row>

            <Row className="ComboCard__priceLine d-flex justify-content-between">
              <div className="ComboCard__prices">
                <div className="ComboCard__price d-inline-block">
                  {comboPrice.toFixed(0).toString() + ' '}
                  <span>руб</span>
                </div>
                <div className="ComboCard__oldPrice d-inline-block">{oldPrice.toFixed(0).toString()}р</div>
              </div>

              <div className="ComboCard__button d-flex justify-content-end">
                <AddComboButton combo={this.props.combo} />                
              </div>
            </Row>
          </Container>
        </Container>
      </React.Fragment>
    )
  }
}

const mapDispatchToProps = {
  showComboModal,
  addOrderItemToOrder,
  setOrderItemAmount,
  deleteOrderItem,
}

const mapStateToProps = (state: RootState) => {
  const { order } = state.order

  return {
    order,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ComboCard)
