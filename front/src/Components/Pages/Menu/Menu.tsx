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
import { getGroupProducts } from '../../../Redux/actions/menu'
// import BreadCrumbs from '../../../SharedComponents/BreadCrumbs/BreadCrumbs'
import ScrollAnimation from 'react-animate-on-scroll'
import 'animate.css/animate.min.css'
import Loader from '../../../SharedComponents/Loader/Loader'
import OverlayLoader from '../../../SharedComponents/OverlayLoader/OverlayLoader'

interface MatchParams {
  id: string
}

interface MenuProps extends RouteComponentProps<MatchParams> {
  menu: Category[]
  getGroupProducts: any
  productsLoading: boolean
  loading: boolean
}

interface MenuState {}

class Menu extends React.Component<MenuProps, MenuState> {
  constructor(props: MenuProps) {
    super(props)
  }

  componentDidMount() {
    this.scrollTo('menuScroller', 250)
    this.props.getGroupProducts(this.props.match.params.id)
    console.log(123213123)
  }

  checkMenuId = (): boolean => {
    if (this.props.menu.find((cat) => cat.id === this.props.match.params.id)) {
      return true
    } else {
      return false
    }
  }

  componentDidUpdate(prevProps: MenuProps) {
    if (this.props.location !== prevProps.location) {
      this.checkGroupProduct(this.props.match.params.id)
    }
  }

  checkGroupProduct = (groupId: string) => {
    const group = this.props.menu.filter((group) => {
      if (group.id === groupId) return group
    })
    if (group && group[0].products && group[0].products[0] && !group[0].products[0].sizePrices) {
      this.props.getGroupProducts(groupId)
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
        <React.Fragment>
          <Container fluid className="Menu p-0 m-0">
            <ScrollAnimation duration={1} animateOnce={true} animateIn="animate__backInLeft">
              <SliderContainer />
            </ScrollAnimation>

            <React.Fragment>
              {this.props.productsLoading || this.props.loading ? (
                <OverlayLoader />
              ) : (
                <React.Fragment>
                  <ScrollAnimation duration={1} animateOnce={true} animateIn="animate__backInRight">
                    <NewItemsCategory
                      key={this.props.match.params.id + Math.random().toString()}
                      categoryId={this.props.match.params.id}
                    />
                  </ScrollAnimation>
                  <ScrollAnimation duration={1} animateOnce={true} animateIn="animate__bounceInLeft">
                    <Element name="menuScroller"></Element>
                    <ProductList
                      key={this.props.match.params.id + Math.random().toString()}
                      productsPerPage={6}
                      categoryId={this.props.match.params.id}
                    />
                  </ScrollAnimation>
                </React.Fragment>
              )}
            </React.Fragment>
            {this.scrollTo('menuScroller', -220)}
          </Container>
          )
        </React.Fragment>
      )
    } else {
      this.props.history.push('/')
      return null
    }
  }
}

const mapDispatchToProps = {
  getGroupProducts,
}

const mapStateToProps = (state: RootState) => {
  const { menu, productsLoading, loading } = state.menu
  return {
    productsLoading,
    menu: menu,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu)
