import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import Product from '../../Interfaces/Product'
import RoundButton from '../RoundButton/RoundButton'

import './ProductCardMobile.scss'
import ActionButton from '../ActionButton/ActionButton'
import { NavLink } from 'react-router-dom'
import Sticker from '../Sticker/Sticker'

interface ProductCardMobileProps {
  product: Product
}

interface ProductCardMobileState {}

const newPrice: number = 200
const oldPrice: number = 300

export default class ProductCardMobile extends React.Component<ProductCardMobileProps, ProductCardMobileState> {
  favoriteClick = (): void => {
    console.log('favoriteClick')
  }

  addToCartButton = (id: number): void => {
    console.log('addToCartButton ' + id.toString())
  }

  render() {
    return (
      <React.Fragment>
        <Container className="ProductCardMobile p-3 m-0 mt-4">
          <Container className="ProductCardMobile__container p-0 m-0">
            <Row className="ProductCardMobile__firstLine p-0 m-0 d-flex justify-content-between">
              <div className="ProductCardMobile__favoriteButton">
                <RoundButton icon="favorite.svg" backgroundColor="##F2F2F2" onClick={() => this.favoriteClick()} />
              </div>
              <div className="ProductCardMobile__stickerCont">
                <Sticker title="Новинка" backgroundColor="#FFD74B" />
                <Sticker title="Акция" backgroundColor="#FF371C" />
              </div>
            </Row>

            <NavLink to={`/product/${this.props.product.id}`}>
              <Row className="ProductCardMobile__img">
                <img
                  className="img-fluid"
                  src={this.props.product.image !== null ? this.props.product.image : 'images/products/no-photo.png'}
                  alt={this.props.product.name}
                />
              </Row>
            </NavLink>

            <Row className="ProductCardMobile__textContent">
              <NavLink to={`/product/${this.props.product.id}`}>
                <div className="ProductCardMobile__title w-100">
                  <h1>{this.props.product.name}</h1>
                </div>
              </NavLink>

              <div className="ProductCardMobile__desc w-100">{this.props.product.description}</div>
            </Row>

            <Row className="ProductCardMobile__priceLine d-flex justify-content-between">
              <div className="ProductCardMobile__prices">
                <div className="ProductCardMobile__price d-inline-block">
                  {newPrice.toFixed(0).toString()} <span>руб</span>
                </div>
                <div className="ProductCardMobile__oldPrice d-inline-block">{oldPrice.toFixed(0).toString()}р</div>
              </div>

              <div className="ProductCardMobile__button d-flex justify-content-end">
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
