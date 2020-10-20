import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import Product from '../../Interfaces/Product'
import RoundButton from '../RoundButton/RoundButton'
import Sticker from '../Sticker/Sticker'

import './ProductCard.scss'
import ActionButton from '../ActionButton/ActionButton'
import { NavLink } from 'react-router-dom'

interface ProductCardProps {
  product: Product
}

interface ProductCardState {}

const newPrice: number = 200
const oldPrice: number = 300

export default class ProductCard extends React.Component<ProductCardProps, ProductCardState> {
  componentDidMount() {
    // console.log(this.props.product)
  }

  favoriteClick = (): void => {
    console.log('favoriteClick')
  }

  addToCartButton = (id: number): void => {
    console.log('addToCartButton ' + id.toString())
  }

  render() {
    return (
      <React.Fragment>
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

            <NavLink to={`/product/${this.props.product.id}`}>
              <Row className="ProductCard__img d-flex justify-content-center">
                <img
                  className="img-fluid"
                  // src={this.props.product.imageLinks[0]}
                  // src={this.props.product.image !== null ? this.props.product.image : '/images/products/no-photo.png'}
                  alt={this.props.product.name}
                />
              </Row>
            </NavLink>

            <Row className="ProductCard__textContent">
              <NavLink to={`/product/${this.props.product.id}`}>
                <div className="ProductCard__title w-100">
                  <h1>{this.props.product.name}</h1>
                </div>
              </NavLink>

              <div className="ProductCard__desc w-100">{this.props.product.description}</div>
            </Row>

            <Row className="ProductCard__priceLine d-flex justify-content-between">
              <div className="ProductCard__prices">
                <div className="ProductCard__price d-inline-block">
                  {newPrice.toFixed(0).toString()} <span>руб</span>
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
                  onClick={() => this.addToCartButton(this.props.product.id)}
                />
              </div>
            </Row>
          </Container>
        </Container>
      </React.Fragment>
    )
  }
}
