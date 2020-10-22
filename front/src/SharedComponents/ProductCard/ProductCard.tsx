import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import Product from '../../Interfaces/Product'
import RoundButton from '../RoundButton/RoundButton'
import Sticker from '../Sticker/Sticker'
import { showProductModal } from '../../Redux/actions/app'
import { addOrderItemToOrder } from '../../Redux/actions/order'

import './ProductCard.scss'
import ActionButton from '../ActionButton/ActionButton'
import { connect } from 'react-redux'
import OrderItem from '../../Interfaces/OrderItem'
// import { NavLink } from 'react-router-dom'

interface ProductCardProps {
  product: Product
  showProductModal: (product: Product) => void
  addOrderItemToOrder: (orderItem: OrderItem) => void
}

interface ProductCardState {
  showProductModal: boolean
}

const newPrice: number = 200
const oldPrice: number = 300

class ProductCard extends React.Component<ProductCardProps, ProductCardState> {
  constructor(props: ProductCardProps) {
    super(props)
    this.state = {
      showProductModal: false,
    }
  }

  componentDidMount() {
    // console.log(this.props.product)
  }

  favoriteClick = (): void => {
    console.log('favoriteClick')
  }

  addToCartButton = (product: Product): void => {
    this.props.addOrderItemToOrder({
      product: product,
      amount: 1,
      orderItemModifiers: [],
      value: product.sizePrices[0].price.currentPrice,
    })
  }

  toggleModal = (): void => {
    const showProductModal: boolean = !this.state.showProductModal
    this.setState({ showProductModal })
  }

  render() {
    return (
      <React.Fragment>
        {/* {this.state.showProductModal ? (
          <ProductModal product={this.props.product} toggleModal={this.toggleModal} />
        ) : null} */}

        <Container className="ProductCard p-3 m-0">
          <Container className="ProductCard__container p-0 m-0">
            <Row className="ProductCard__firstLine p-0 m-0 d-flex justify-content-between">
              <div className="ProductCard__favoriteButton">
                <RoundButton icon="favorite.svg" backgroundColor="##F2F2F2" onClick={() => this.favoriteClick()} />
              </div>
              <div className="ProductCard__stickerCont">
                <Sticker title="Новинка" backgroundColor="#FFD74B" />
                <Sticker title="Акция" backgroundColor="#FF371C" />
              </div>
            </Row>

            <Row
              className="ProductCard__img d-flex justify-content-center"
              onClick={() => this.props.showProductModal(this.props.product)}
            >
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

            <Row className="ProductCard__textContent">
              <div className="ProductCard__title w-100" onClick={() => this.props.showProductModal(this.props.product)}>
                <h1>{this.props.product.name}</h1>
              </div>

              <div className="ProductCard__desc w-100">{this.props.product.description}</div>
            </Row>

            <Row className="ProductCard__priceLine d-flex justify-content-between">
              <div className="ProductCard__prices">
                <div className="ProductCard__price d-inline-block">
                  {this.props.product.sizePrices.length > 0
                    ? this.props.product.sizePrices[0].price.currentPrice.toFixed(0).toString()
                    : newPrice.toFixed(0).toString()}{' '}
                  <span>руб</span>
                </div>
                <div className="ProductCard__oldPrice d-inline-block">{oldPrice.toFixed(0).toString()}р</div>
              </div>

              <div className="ProductCard__button d-flex justify-content-end">
                <ActionButton
                  backgroundColor="#303030"
                  icon="cart_dark.svg"
                  text="В корзину"
                  width="180px"
                  textColor="#ffffff"
                  onClick={() => this.addToCartButton(this.props.product)}
                />
              </div>
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
}

export default connect(null, mapDispatchToProps)(ProductCard)
