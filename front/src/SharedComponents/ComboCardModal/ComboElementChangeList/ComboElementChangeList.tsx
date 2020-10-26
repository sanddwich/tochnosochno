import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import Product from '../../../Interfaces/Product'

import './ComboElementChangeList.scss'

interface ComboElementChangeListProps {
  products: Product[]
  comboConsist: Product[]
  addNewProductAtCombo: (newProductId: number) => void
}

interface ComboElementChangeListState {}

export default class ComboElementChangeList extends React.Component<
  ComboElementChangeListProps,
  ComboElementChangeListState
> {
  render() {
    return (
      <Container className="ComboElementChangeList p-0 m-0 h-100 d-flex align-items-center">
        <Container fluid className="ComboElementChangeList__cont p-0 m-0">
          <Row className="p-0 m-0 d-flex justify-content-center">
            {this.props.products.map((product, index) => {
              if (!this.props.comboConsist.find((ccproduct) => product.id === ccproduct.id)) {
                return (
                  <Col
                    xs={4}
                    key={product.id + index}
                    className="ComboElementChangeList_element p-0 m-0"
                    onClick={() => this.props.addNewProductAtCombo(product.id)}
                  >
                    <div className="ComboElementChangeList_elementImg p-0 m-0">
                      <img src={product.imageLinks[0] ? `${product.imageLinks[0]}` : '/images/products/no-photo.png'} className="img-fluid" alt="" />
                    </div>
                    <div className="ComboElementChangeList_elementTitle p-0 m-0">{product.name}</div>
                  </Col>
                )
              }
            })}
          </Row>
        </Container>
      </Container>
    )
  }
}
