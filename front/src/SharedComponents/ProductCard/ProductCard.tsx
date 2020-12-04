import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import Product from '../../Interfaces/Product'
import RoundButton from '../RoundButton/RoundButton'
import Sticker from '../Sticker/Sticker'
import { showProductModal } from '../../Redux/actions/app'
import { addOrderItemToOrder, setOrderItemAmount, deleteOrderItem } from '../../Redux/actions/order'

import './ProductCard.scss'
import ActionButton from '../ActionButton/ActionButton'
import { connect } from 'react-redux'
import OrderItem from '../../Interfaces/OrderItem'
import { RootState } from '../../Redux'
import Order from '../../Interfaces/Order'
import NumberInput from '../NumberInput/NumberInput'
import AddProductButton from '../AddProductButton/AddProductButton'
import FavouriteRoundButton from '../FavouriteRoundButton/FavouriteRoundButton'
import Category from '../../Interfaces/Category'
// import { NavLink } from 'react-router-dom'

interface ProductCardProps {
  menu: Category[]
  order: Order
  product: Product
  showProductModal: (product: Product) => void
  addOrderItemToOrder: (orderItem: OrderItem) => void
  setOrderItemAmount: (orderItem: OrderItem, amount: number) => void
  deleteOrderItem: (orderItem: OrderItem) => void
}

interface ProductCardState {
  showProductModal: boolean
  orderItem: OrderItem | null
}

const newPrice: number = 200
const oldPrice: number = 300

class ProductCard extends React.Component<ProductCardProps, ProductCardState> {
  constructor(props: ProductCardProps) {
    super(props)
    this.state = {
      showProductModal: false,
      orderItem: null,
    }
  }

  componentDidMount() {
    // console.log(this.props.product)
  }

  toggleModal = (): void => {
    const showProductModal: boolean = !this.state.showProductModal
    this.setState({ showProductModal })
  }

  newItemDefine = (): boolean => {
    let newItemsConsist: boolean = false
    if (typeof this.props.product !== 'undefined') {
      this.props.menu.map((cat) => {
        if (cat.products.find((product) => product.id === this.props.product.id)) {
          cat.products[cat.products.length - 1].id === this.props.product.id
            ? (newItemsConsist = true)
            : (newItemsConsist = false)
        }
      })
    }

    return newItemsConsist
  }

  render() {
    return (
      <React.Fragment>
        <Container className="ProductCard  p-3 m-0 ">
          <Container className="ProductCard__container p-0 m-0 hvr-glow">
            <Row className="ProductCard__firstLine p-0 m-0 d-flex justify-content-between">
              <div className="ProductCard__favoriteButton">
                <FavouriteRoundButton product={this.props.product} />
                {/* <RoundButton icon="favorite.svg" backgroundColor="##F2F2F2" onClick={() => this.favoriteClick()} /> */}
              </div>
              <div className="ProductCard__stickerCont">
                {this.newItemDefine() ? <Sticker title="Новинка" backgroundColor="#FFD74B" /> : null}
                {/* <Sticker title="Акция" backgroundColor="#FF371C" /> */}
              </div>
            </Row>

            {/* <Row
              className="ProductCard__img d-flex justify-content-center"
              onClick={() => this.props.showProductModal(this.props.product)}
            >
              <img
                id={this.props.product.id}
                className="img-fluid"
                src={
                  typeof this.props.product.imageLinks[0] !== 'undefined'
                    ? `${this.props.product.imageLinks[0]}`
                    : '/images/products/burger.png'
                }
                alt={this.props.product.name}
              />
            </Row> */}
            <div
              // style={{ background: 'url("/images/products/burger.png")', backgroundSize: 'contain', height: '292px' }}
              className="ProductCard__img d-flex justify-content-center"
              onClick={() => this.props.showProductModal(this.props.product)}
            >
              <img
                id={this.props.product.id}
                src={
                  typeof this.props.product.imageLinks[0] !== 'undefined'
                    ? `${this.props.product.imageLinks[0]}`
                    : '/images/products/burger.png'
                }
                alt={this.props.product.name}
              />
            </div>

            <Row className="ProductCard__textContent">
              <div className="ProductCard__title w-100" onClick={() => this.props.showProductModal(this.props.product)}>
                <h1>{this.props.product.name}</h1>
              </div>

              <div className="ProductCard__desc w-100">{this.props.product.description}</div>
            </Row>

            <div className="ProductCard__priceLine d-flex justify-content-between">
              <div className="ProductCard__prices">
                <div className="ProductCard__price d-inline-block">
                  {this.props.product.sizePrices && this.props.product.sizePrices.length > 0
                    ? this.props.product.sizePrices[0].price.currentPrice.toFixed(0).toString()
                    : this.props.product.price?.toFixed(0).toString()}{' '}
                  <span>руб</span>
                </div>
                {/* <div className="ProductCard__oldPrice d-inline-block">{oldPrice.toFixed(0).toString()}р</div> */}
              </div>

              <div className="ProductCard__button d-flex justify-content-end">
                <AddProductButton hideTextMobile={false} product={this.props.product} />
              </div>
            </div>
          </Container>
        </Container>
      </React.Fragment>
    )
  }
}

const mapDispatchToProps = {
  showProductModal,
  addOrderItemToOrder,
  setOrderItemAmount,
  deleteOrderItem,
}

const mapStateToProps = (state: RootState) => {
  const { order } = state.order
  const { menu } = state.menu
  return {
    order,
    menu,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductCard)
