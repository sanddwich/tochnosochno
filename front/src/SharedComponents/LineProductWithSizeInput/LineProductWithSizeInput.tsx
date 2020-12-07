import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import Product from '../../Interfaces/Product'
import ActionButton from '../ActionButton/ActionButton'
import AddProductButton from '../AddProductButton/AddProductButton'

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
        {/* Размеры продукта на мобильных устройствах */}
        <Row className="d-flex d-md-none justify-content-start pt-3 pl-3 pr-3">
          {/* <div id="active" className="LineProductWithSizeInput__size">
            30 см
          </div>
          <div className="LineProductWithSizeInput__size">45 см</div> */}
        </Row>

        <Row className="m-0 p-0 d-flex align-items-center pl-3 pr-3">
          <Col className="p-1" xs={6} md={4}>
            <Row className="d-flex justify-content-start">
              <div className="LineProductWithSizeInput__price">
                {(this.props.product.sizePrices && this.props.product.sizePrices[0].price.currentPrice) ||
                  this.props.product.price}
                <span>руб</span>
              </div>
              {/* <div className="LineProductWithSizeInput__priceOld">200р</div> */}
            </Row>
          </Col>
          <Col className="p-1 d-none d-md-block pr-4" md={4}>
            {/* Размеры продукта на десктопных устройствах */}
            <Row className="d-flex justify-content-center"></Row>
          </Col>
          <Col className="p-0 p-md-1" xs={6} md={4}>
            <Row className="LineProductWithSizeInput__action d-flex justify-content-end">
              <AddProductButton hideTextMobile={false} product={this.props.product} />
            </Row>
          </Col>
        </Row>
      </Container>
    )
  }
}
