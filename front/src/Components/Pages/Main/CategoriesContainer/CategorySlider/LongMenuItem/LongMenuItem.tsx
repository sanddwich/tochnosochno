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

  suffixGen = (num: number): string => {
    // console.log(num % 10)
    if (num >= 10 && num <= 20) {
      return 'ых'
    }
    if (num % 10 === 1) {
      return 'ая'
    }
    if (num % 10 >= 2 && num % 10 <= 4) {
      return 'ые'
    }
    return 'ых'
  }

  render() {
    return (
      <React.Fragment>
        <Container
          className="LongMenuItem m-0 p-0"
          style={{
            background: "url('/images/background/bg.png')",
          }}
        >
          <Row className="m-0 p-0">
            <Col
              className="LongMenuItem__content m-0 p-0  pl-5 d-flex align-items-center LongMenuItem__imgCont"
              lg={12}
              md={12}
              style={{
                background:
                  this.props.category.imageLinks && this.props.category.imageLinks.length > 0
                    ? `url(${this.props.category.imageLinks[0]})`
                    : `url(/images/categories/rolls.png)`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right',
              }}
            >
              <div>
                <div className="LongMenuItem__suggestion w-100">
                  <span>Выгодное предложение</span>
                </div>
                <div className="LongMenuItem__title">
                  <h1>{this.props.category.name}</h1>
                </div>
                <div className="LongMenuItem__desc">
                  {this.props.category.products.length} сочн{this.suffixGen(this.props.category.products.length)}{' '}
                  позиций
                </div>
              </div>
            </Col>
            {/* <Col
              className="LongMenuItem__imgCont m-0 p-0"
              lg={6}
              md={6}
              style={{
                background:
                  this.props.category.imageLinks && this.props.category.imageLinks.length > 0
                    ? `url(${this.props.category.imageLinks[0]})`
                    : `url(/images/categories/rolls.png)`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right',
             
              }}
            ></Col> */}
          </Row>
        </Container>
        <Container className="showCat m-0 p-0 d-flex justify-content-start">
          <div className="showCat__cont">
            <div>Посмотреть категорию</div>
            <div>
              <img src="/images/other_icons/arrow_right.svg" alt="" />
            </div>
          </div>
        </Container>
      </React.Fragment>
    )
  }
}
