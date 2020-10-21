import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import Product from '../../Interfaces/Product'
import ActionButton from '../ActionButton/ActionButton'

import './LineProductWithSizeInput.scss'

interface LineProductWithSizeInputProps {
  product: Product
}

interface LineProductWithSizeInputState {}

export default class LineProductWithSizeInput extends React.Component<
  LineProductWithSizeInputProps,
  LineProductWithSizeInputState
> {
  render() {
    return (
      <Container fluid className="LineProductWithSizeInput m-0 p-0">
        <Row className="m-0 p-0 d-flex align-items-center">
          <Col className="p-1">
            <Row className="d-flex justify-content-start">
              <div className="LineProductWithSizeInput__price">
                {this.props.product.sizePrices[0].price.currentPrice}
                <span>руб</span>
              </div>
              <div className="LineProductWithSizeInput__priceOld">200р</div>
            </Row>
          </Col>
          <Col className="p-1">
            <Row className="d-flex justify-content-center">
              <div id="active" className="LineProductWithSizeInput__size">
                30 см
              </div>
              <div className="LineProductWithSizeInput__size">45 см</div>
            </Row>
          </Col>
          <Col className="p-1">
            <Row className="LineProductWithSizeInput__action d-flex justify-content-end">
              <ActionButton
                onClick={() => console.log('add to cart')}
                textColor="white"
                width="180px"
                text="В корзину"
                backgroundColor="#303030"
                icon="cart_dark.svg"
                hideTextMobile={true}
              />
            </Row>
          </Col>
        </Row>
      </Container>

      // <div className="LineProductWithSizeInput d-flex justify-content-between ">
      //   <div className="LineProductWithSizeInput__product">
      //     <div className="d-flex justify-content-between ">
      //       <div className="LineProductWithSizeInput__product__image  ">
      //         <img src={`${this.props.product.imageLinks[0]}`} alt="" />
      //       </div>

      //       <div className="LineProductWithSizeInput__product__name ">{this.props.product.name}</div>

      //       <div className="LineProductWithSizeInput__product__price">
      //         <div className="LineProductWithSizeInput__product__newPrice col-sm-6 m-0 p-0">
      //           <span className="bold">980</span>руб
      //         </div>
      //         <div className="LineProductWithSizeInput__product__oldPrice col-sm-6 m-0 p-0"> 1170р</div>
      //       </div>
      //     </div>
      //   </div>

      //   <ActionButton
      //     onClick={() => console.log('add to cart')}
      //     textColor="white"
      //     width="180px"
      //     text="В корзину"
      //     backgroundColor="#303030"
      //     icon="cart_dark.svg"
      //     hideTextMobile={true}
      //   />
      // </div>
    )
  }
}
