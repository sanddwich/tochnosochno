import _ from 'lodash'
import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import Category from '../../../../Interfaces/Category'
import { RootState } from '../../../../Redux'

import './CategoriesContainer.scss'
import CategorySlider from './CategorySlider/CategorySlider'
import LongMenuItem from './LongMenuItem/LongMenuItem'
import ShortMenuItem from './ShortMenuItem/ShortMenuItem'

interface CategoriesContainerProps {
  menu: Category[]
}

interface CategoriesContainerState {
  sortMenu: Category[]
  longMenu: Category[]
  shortMenu: Category[]
}

const includeString: string = 'сеты '

class CategoriesContainer extends React.Component<CategoriesContainerProps, CategoriesContainerState> {
  constructor(props: CategoriesContainerProps) {
    super(props)
    this.state = {
      sortMenu: [],
      longMenu: [],
      shortMenu: [],
    }
  }

  componentDidMount() {
    const sortMenu: Category[] = _.sortBy(this.props.menu, (obj) => {
      return parseInt(obj.id)
    })
    let longMenu: Category[] = []
    let shortMenu: Category[] = []
    sortMenu.map((el) => {
      el.name.toLowerCase().includes(includeString) ? longMenu.push(el) : shortMenu.push(el)
    })

    this.setState({ sortMenu, longMenu, shortMenu })
  }

  render() {
    return (
      <Container fluid className="m-0 p-0 mb-4">
        <Container fluid className="CategoriesContainer d-none d-md-block m-0 p-0">
          <Row className="p-0 m-0">
            {this.state.longMenu.map((category, index) => {
              return (
                <Col key={category.id + index} xs={6} className="CategoriesContainer__LongNavLinkItem p-0 m-0">
                  <NavLink to={`/menu/${category.id}`}>
                    <LongMenuItem category={category} />
                  </NavLink>
                </Col>
              )
            })}
          </Row>
          <Row className="p-0 m-0">
            {this.state.shortMenu.map((category, index) => {
              return (
                <Col key={category.id + index} xs={4} className="CategoriesContainer__ShortNavLinkItem p-0 m-0">
                  <NavLink to={`/menu/${category.id}`}>
                    <ShortMenuItem category={category} />
                  </NavLink>
                </Col>
              )
            })}
          </Row>
        </Container>

        <Container key={this.state.shortMenu.length} fluid className="CategoriesContainerMobile d-block d-md-none m-0 p-0">
          <CategorySlider longMenu={this.state.longMenu} shortMenu={this.state.shortMenu} />
        </Container>
      </Container>
    )
  }
}

const mapDispatchToProps = {}

const mapStateToProps = (state: RootState) => {
  const { menu } = state.menu
  return {
    menu: menu,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoriesContainer)
