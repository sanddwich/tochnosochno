import React from 'react'
import { Container } from 'react-bootstrap'
import { RouteComponentProps } from 'react-router-dom'
import NewItemsCategory from './NewItemsCategory/NewItemsCategory'
import SliderContainer from '../../../SharedComponents/SliderContainer/SliderContainer'
import { scroller, Element } from 'react-scroll'

import './Menu.scss'
import ProductList from './ProductList/ProductList'
import { connect } from 'react-redux'
import { RootState } from '../../../Redux'
import Category from '../../../Interfaces/Category'
// import BreadCrumbs from '../../../SharedComponents/BreadCrumbs/BreadCrumbs'

interface MatchParams {
  id: string
}

interface MenuProps extends RouteComponentProps<MatchParams> {
  menu: Category[]
}

interface MenuState {}

class Menu extends React.Component<MenuProps, MenuState> {
  constructor(props: MenuProps) {
    super(props)
  }

  componentDidMount() {
    this.scrollTo('menuScroller', 400)
  }

  checkMenuId = (): boolean => {
    if (this.props.menu.find((cat) => cat.id === this.props.match.params.id)) {
      return true
    } else {
      return false
    }
  }

  scrollTo = (name: string, offset: number): void => {
    scroller.scrollTo(name, {
      duration: 500,
      delay: 0,
      smooth: true,
      offset, // Scrolls to element + 50 pixels down the page
    })
  }

  render() {
    if (this.checkMenuId()) {
      return (
        <Container fluid className="Menu p-0 m-0">
          {/* <BreadCrumbs  /> */}
          {/* <SliderContainer marginTop={30} /> */}
          <SliderContainer />

          <NewItemsCategory
            key={this.props.match.params.id + Math.random().toString()}
            categoryId={this.props.match.params.id}
          />

          <Element name="menuScroller">
            <ProductList
              key={this.props.match.params.id + Math.random().toString()}
              productsPerPage={6}
              categoryId={this.props.match.params.id}
            />
          </Element>

          {this.scrollTo('menuScroller', -120)}
        </Container>
      )
    } else {
      this.props.history.push('/')
      return null
    }
  }
}

const mapDispatchToProps = {}

const mapStateToProps = (state: RootState) => {
  const { menu } = state.menu
  return {
    menu: menu,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu)
