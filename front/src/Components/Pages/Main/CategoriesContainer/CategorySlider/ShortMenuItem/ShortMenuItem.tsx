import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import Category from '../../../../../../Interfaces/Category'

import './ShortMenuItem.scss'

interface ShortMenuItemProps {
  category: Category
}

interface ShortMenuItemState {}

export default class ShortMenuItem extends React.Component<ShortMenuItemProps, ShortMenuItemState> {
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
          className="ShortMenuItem m-0 p-0"
          style={{
            background: "url('/images/background/bg.png')",
          }}
        >
          <Row className="m-0 p-0">
            <Col className="LongMenuItem__content m-0 p-0 pl-5 d-flex align-items-center" lg={7} md={8}>
              <div>
                <div className="LongMenuItem__title">
                  <h1>{this.props.category.name}</h1>
                </div>
                <div className="LongMenuItem__desc">
                  {this.props.category.products.length} сочн{this.suffixGen(this.props.category.products.length)}{' '}
                  позиций
                </div>
              </div>
            </Col>
            <Col
              className="LongMenuItem__imgCont m-0 p-0"
              lg={5}
              md={4}
              style={{
                background:
                  this.props.category.imageLinks && this.props.category.imageLinks.length > 0
                    ? `url(${this.props.category.imageLinks[0]})`
                    : `url(/images/categories/rolls.png)`,
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
              <img src="/images/other_icons/arrow_right.svg" alt="" />
            </div>
          </div>
        </Container>
      </React.Fragment>
    )
  }
}
