import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import Category from '../../../../../../Interfaces/Category'

import './LongMenuItem.scss'

interface LongMenuItemProps {
  category: Category
}

interface LongMenuItemState {}

export default class LongMenuItem extends React.Component<LongMenuItemProps, LongMenuItemState> {
  componentDidMount() {}

  render() {
    return (
      <React.Fragment>
        <Container
          className="LongMenuItem m-0 p-0"
          style={{
            background: "url('images/background/bg.png')",
          }}
        >
          <Row className="m-0 p-0">
            <Col className="LongMenuItem__content m-0 p-0 pl-5 d-flex align-items-center" lg={7} md={8}>
              <div>
                <div className="LongMenuItem__suggestion w-100">
                  <span>Выгодное предложение</span>
                </div>
                <div className="LongMenuItem__title">
                  <h1>{this.props.category.name}</h1>
                </div>
                <div className="LongMenuItem__desc">{this.props.category.products.length} сочныйх позиций</div>
              </div>
            </Col>
            <Col
              className="LongMenuItem__imgCont m-0 p-0"
              lg={5}
              md={4}
              style={{
                background: `url(${this.props.category.images})`,
                backgroundRepeat: 'no-repeat',
                // backgroundAttachment: 'fixed',
                backgroundPosition: 'center',
                // backgroundSize: 'cover',
              }}
            ></Col>
          </Row>
        </Container>
        <Container className="showCat m-0 p-0 d-flex justify-content-start">
          <div className="showCat__cont">
            <div>Посмотреть категорию</div>
            <div>
              <img src="images/other_icons/arrow_right.svg" alt="" />
            </div>
          </div>
        </Container>
      </React.Fragment>
    )
  }
}
