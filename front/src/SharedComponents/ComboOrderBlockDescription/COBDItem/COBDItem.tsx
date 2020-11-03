import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import Product from '../../../Interfaces/Product'
import './COBDItem.scss'

interface COBDItemProps {
  product: Product
}

interface COBDItemState {}

export default class COBDItem extends React.Component<COBDItemProps, COBDItemState> {
  componentDidMount() {
    // console.log(this.props.product)
  }

  render() {
    return (
      <Container fluid className="COBDItem p-0 m-0">
        <Row className="COBDItem__productLine p-0 m-0">
          <Col xs={3} sm={4} className="COBDItem__productLine_img p-0 m-0 pr-1">
            <Row className="m-0 p-0">
              <Col sm={6} className="m-0 p-0 d-flex justify-content-center align-items-center">
                <img
                  src={`${
                    this.props.product.imageLinks && this.props.product.imageLinks.length > 0
                      ? this.props.product.imageLinks[0]
                      : '/images/products/no-photo.png'
                  }`}
                  alt={`${this.props.product.name}`}
                />
              </Col>
              <Col sm={6} className="COBDItem__weight p-0 m-0 d-flex justify-content-center align-items-center">
                <span>{this.props.product.weight ? (this.props.product.weight * 1000).toFixed(0) + 'гр.' : '-'}</span>
              </Col>
            </Row>
          </Col>

          <Col xs={9} sm={8} className="p-0 m-0">
            <div className="COBDItem__title w-100 d-flex justify-content-start align-items-center">
              {this.props.product.name}
            </div>
            <div className="COBDItem__desc w-100 d-flex justify-content-start align-items-center pr-2">
              {this.props.product.description}
            </div>
          </Col>
        </Row>
      </Container>
    )
  }
}
