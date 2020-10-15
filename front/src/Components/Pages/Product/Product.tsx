import React from 'react'
import { Container } from 'react-bootstrap'

import './Product.scss'

interface ProductProps {}

interface ProductState {}

export default class Product extends React.Component<ProductProps, ProductState> {
  render() {
    return (
      <Container className="Product m-0 p-0 mt-4">
        <h1>Product</h1>
      </Container>
    )
  }
}
