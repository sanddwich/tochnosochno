import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import Category from '../../../../../../Interfaces/Category'

import './LongMenuItemMob.scss'

interface LongMenuItemMobProps {
  category: Category
}

interface LongMenuItemMobState {}

export default class LongMenuItemMob extends React.Component<LongMenuItemMobProps, LongMenuItemMobState> {
  componentDidMount() {}

  suffixGen = (num: number): string => {
    // console.log(num % 10)
    if (num >= 10 && num <=20) {
      return 'ых'
    }
    if ((num % 10) === 1) {
      return 'ая'
    }
    if ((num % 10) >= 2 && (num % 10) <= 4) {
      return 'ые'
    }
    return 'ых'
  }

  render() {
    return (
      <React.Fragment>
        <NavLink to={`/menu/${this.props.category.id}`}>
          <Container
            className="LongMenuItemMob p-0"
            style={{
              background: "url('/images/background/bg.png')",
              backgroundRepeat: 'no-repeat',
              // backgroundAttachment: 'fixed',
              backgroundPosition: 'center',
              // backgroundSize: 'cover',
            }}
          >
            <Container
              className="LongMenuItemMob__cont m-0 p-0"
              style={{
                background:
                  this.props.category.images !== null && this.props.category.images !== ''
                    ? `url(${this.props.category.images})`
                    : `url(/images/categories/rolls.png)`,
                backgroundRepeat: 'no-repeat',
                // backgroundAttachment: 'fixed',
                backgroundPosition: 'right',
                // backgroundSize: 'cover',
              }}
            >
              <Row className="m-0 p-0">
                <Col className="LongMenuItemMob__content m-0 p-0 pl-5 d-flex align-items-center">
                  <div>
                    <div className="LongMenuItemMob__suggestion w-100">
                      <span>Выгодное предложение</span>
                    </div>
                    <div className="LongMenuItemMob__title">
                      <h1>{this.props.category.name}</h1>
                    </div>
                    <div className="LongMenuItemMob__desc">
                      {this.props.category.products.length} сочн{this.suffixGen(this.props.category.products.length)}{' '}
                      позиций
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          </Container>
          <Container className="showCat__mobile p-0 d-flex justify-content-start">
            <div className="showCat__cont">
              <div>Посмотреть категорию</div>
              <div>
                <img src="/images/other_icons/arrow_right.svg" alt="" />
              </div>
            </div>
          </Container>
        </NavLink>
      </React.Fragment>
    )
  }
}
