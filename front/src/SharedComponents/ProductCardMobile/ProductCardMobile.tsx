import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import Product from '../../Interfaces/Product'
import RoundButton from '../RoundButton/RoundButton'

import './ProductCardMobile.scss'
import ActionButton from '../ActionButton/ActionButton'
import Sticker from '../Sticker/Sticker'
import { connect } from 'react-redux'

import { showProductModal } from '../../Redux/actions/app'
import { addOrderItemToOrder, setOrderItemAmount, deleteOrderItem } from '../../Redux/actions/order'
import AddProductButton from '../AddProductButton/AddProductButton'
import FavouriteRoundButton from '../FavouriteRoundButton/FavouriteRoundButton'
import { RootState } from '../../Redux'
import Category from '../../Interfaces/Category'
import Order from '../../Interfaces/Order'
import OrderItem from '../../Interfaces/OrderItem'

interface ProductCardMobileProps {
  menu: Category[]
  order: Order
  product: Product
  showProductModal: (product: Product) => void
  addOrderItemToOrder: (orderItem: OrderItem) => void
  setOrderItemAmount: (orderItem: OrderItem, amount: number) => void
  deleteOrderItem: (orderItem: OrderItem) => void
}

interface ProductCardMobileState {}

const newPrice: number = 200
const oldPrice: number = 300

class ProductCardMobile extends React.Component<ProductCardMobileProps, ProductCardMobileState> {
  favoriteClick = (): void => {
    console.log('favoriteClick')
  }

  addToCartButton = (id: number): void => {
    console.log('addToCartButton ' + id.toString())
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
        <Container className="ProductCardMobile p-3 m-0">
          <Container className="ProductCardMobile__container p-0 m-0">
            <Row className="p-0 m-0">
              <Col className="p-0 m-0" xs={6}>
                <Row className="ProductCardMobile__firstLine p-0 m-0 d-flex justify-content-between">
                  <div className="ProductCardMobile__favoriteButton">
                    <FavouriteRoundButton product={this.props.product} />
                    {/* <RoundButton icon="favorite.svg" backgroundColor="##F2F2F2" onClick={() => this.favoriteClick()} /> */}
                  </div>
                  <div className="ProductCardMobile__stickerCont">
                    {this.newItemDefine() ? <Sticker title="Новинка" backgroundColor="#FFD74B" /> : null}
                    {/* <Sticker title="Акция" backgroundColor="#FF371C" /> */}
                  </div>
                </Row>

                <Row className="ProductCardMobile__img" onClick={() => this.props.showProductModal(this.props.product)}>
                  <img
                    className="img-fluid"
                    src={
                      typeof this.props.product.imageLinks[0] !== 'undefined'
                        ? `${this.props.product.imageLinks[0]}`
                        : '/images/products/no-photo.png'
                    }
                    alt={this.props.product.name}
                  />
                </Row>
              </Col>

              <Col className="ProductCardMobile__info p-0 m-0" xs={6}>
                <Row className="ProductCardMobile__textContent">
                  <div
                    className="ProductCardMobile__title w-100"
                    onClick={() => this.props.showProductModal(this.props.product)}
                  >
                    <h1>{this.props.product.name}</h1>
                  </div>

                  <div id="description" className="ProductCardMobile__desc w-100">
                    {this.props.product.description}
                  </div>
                </Row>

                <Row className="ProductCardMobile__priceLine d-flex justify-content-between align-items-end">
                  <div className="ProductCardMobile__prices m-0">
                    <div className="ProductCardMobile__price d-inline-block">
                      {this.props.product.sizePrices.length > 0
                        ? this.props.product.sizePrices[0].price.currentPrice.toFixed(0).toString()
                        : newPrice.toFixed(0).toString()}{' '}
                      <span>руб</span>
                    </div>
                    {/* <div className="ProductCardMobile__oldPrice d-inline-block">{oldPrice.toFixed(0).toString()}р</div> */}
                  </div>

                  <div className="ProductCardMobile__button d-flex justify-content-end">
                    <AddProductButton product={this.props.product} />
                    {/* <ActionButton
                      backgroundColor="#303030"
                      icon="cart_dark.svg"
                      text="В корзину"
                      width="180px"
                      textColor="#ffffff"
                      onClick={() => this.addToCartButton(this.props.product.id)}
                    /> */}
                  </div>
                </Row>
              </Col>
            </Row>
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

export default connect(mapStateToProps, mapDispatchToProps)(ProductCardMobile)
