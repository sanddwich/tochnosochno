import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import Category from '../../../../../Interfaces/Category'

import './LongMenuItem.scss'

interface LongMenuItemProps {
  category: Category
}

interface LongMenuItemState {}

export default class LongMenuItem extends React.Component<LongMenuItemProps, LongMenuItemState> {
  render() {
    return (
      <Container className="LongMenuItem m-0">
        <Row className="m-0 p-0">
          <Col className="m-0 p-0" xs={7}>

          </Col>
          <Col className="m-0 p-0" xs={5}>
            <img src={this.props.category.images} alt=""/>
          </Col>
        </Row>
      </Container>
    )
  }
}
