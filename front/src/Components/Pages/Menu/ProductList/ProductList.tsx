import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { connect } from 'react-redux'
import Category from '../../../../Interfaces/Category'
import Product from '../../../../Interfaces/Product'
import { RootState } from '../../../../Redux'
import BlockName from '../../../../SharedComponents/BlockName/BlockName'
import ProductCard from '../../../../SharedComponents/ProductCard/ProductCard'
import { scroller, Element } from 'react-scroll'

import './ProductList.scss'
import NoRecords from '../../../../SharedComponents/NoRecords/NoRecords'
import _ from 'lodash'
import order from '../../../../Redux/reducers/order'

interface Filter {
  id: number
  title: string
  active: boolean
}

interface ProductListProps {
  menu: Category[]
  categoryId: string
  productsPerPage: number
}

interface ProductListState {
  sortProducts: Product[]
  productsAtPage: Product[]
  pages: number
  activePage: number
  filters: Filter[]
}

class ProductList extends React.Component<ProductListProps, ProductListState> {
  constructor(props: ProductListProps) {
    super(props)
    this.state = {
      sortProducts: [],
      productsAtPage: [],
      pages: 1,
      activePage: 1,
      filters: [
        {
          id: 0,
          title: 'Все',
          active: true,
        },
        {
          id: 1,
          title: 'Сначала дешевые',
          active: false,
        },
        {
          id: 2,
          title: 'Сначала дорогие',
          active: false,
        },
        {
          id: 3,
          title: 'Сначала популярные',
          active: false,
        },
      ],
    }
  }

  componentDidMount() {
    // console.log(this.props.menu)
    this.getProducts()
  }

  getPageProducts(sortProducts: Product[], activePage: number, productsPerPage: number): Product[] {
    const productsAtPage: Product[] = []
    for (let i = (activePage - 1) * productsPerPage; i < activePage * productsPerPage; i++) {
      productsAtPage.push(sortProducts[i])
    }

    // return productsAtPage.length>0 ? productsAtPage : []
    return productsAtPage
  }

  getProducts = (): void => {
    const category = this.props.menu.find((cat) => cat.id === this.props.categoryId) as Category

    const sortProducts: Product[] = typeof category.products !== 'undefined' ? category?.products : []

    // const sortProducts: Product[] = []

    const pages = Math.ceil(sortProducts.length / this.props.productsPerPage)
    const productsAtPage: Product[] = this.getPageProducts(
      sortProducts,
      this.state.activePage,
      this.props.productsPerPage
    )

    this.setState({ sortProducts, pages, productsAtPage })
  }

  getFilter = (): number => {
    return this.state.filters.find((filter) => filter.active === true)?.id as number
  }

  scrollTo = (name: string): void => {
    scroller.scrollTo(name, {
      duration: 500,
      delay: 0,
      smooth: true,
      offset: -220, // Scrolls to element + 50 pixels down the page
    })
  }

  changeFilter = (filterId: number): void => {
    const activePage: number = 1
    let productsAtPage: Product[] = []

    try {
      if (filterId === 0) {
        this.getProducts()
      }
      if (filterId === 1) {
        let sortPriceUp: Product[] = _.orderBy(
          this.state.sortProducts,
          (product) => {
            return (product.sizePrices && product.sizePrices[0].price.currentPrice) || product.price
          },
          ['asc']
        )
        productsAtPage = this.getPageProducts(sortPriceUp, activePage, this.props.productsPerPage)

        this.setState({ sortProducts: sortPriceUp, productsAtPage, activePage })
        // console.log(sortPriceUp)
      }
      if (filterId === 2) {
        let sortPriceDown: Product[] = _.orderBy(
          this.state.sortProducts,
          (product) => {
            return (product.sizePrices && product.sizePrices[0].price.currentPrice) || product.price
          },
          ['desc']
        )
        productsAtPage = this.getPageProducts(sortPriceDown, activePage, this.props.productsPerPage)

        this.setState({ sortProducts: sortPriceDown, productsAtPage, activePage })
        // console.log(sortPriceDown)
      }
      if (filterId === 3) {
        let sortPopular: Product[] = _.shuffle(this.state.sortProducts) // Перемешивание случайным образом
        productsAtPage = this.getPageProducts(sortPopular, activePage, this.props.productsPerPage)

        this.setState({ sortProducts: sortPopular, productsAtPage, activePage })
        // console.log(sortPPopular)
      }

      // Обновление акивного фильтра
      let filters: Filter[] = this.state.filters.map((filter) => {
        if (filter.id === filterId) {
          filter.active = true
          return filter
        } else {
          filter.active = false
          return filter
        }
      })
      this.setState({ filters })
    } catch (e) {
      console.log(e)
    }
  }

  setPage = (activePage: number): void => {
    const productsAtPage = this.getPageProducts(this.state.sortProducts, activePage, this.props.productsPerPage)
    this.setState({ activePage, productsAtPage })
    this.scrollTo('productListBegin')
  }

  getPagesStringArray = (pages: number): number[] => {
    let pagesStringArray: number[] = []
    for (let i = 1; i <= pages; i++) {
      pagesStringArray.push(i)
    }
    return pagesStringArray
  }

  render() {
    // console.log(this.state.sortProducts)
    const activeFilter: number = this.getFilter()
    const pagesStringArray: number[] = this.getPagesStringArray(this.state.pages)

    // console.log(activeFilter)
    return (
      <Container key={activeFilter} className="ProductList p-0">
        <Row className="p-0 m-0 mb-4 d-flex justify-content-between">
          <Element name="productListBegin">
            <Col xs={12} md={12} className="ProductList__blockName">
              <BlockName name={this.props.menu.find((cat) => cat.id === this.props.categoryId)?.name || ''} />
            </Col>
          </Element>

          <Col xs={12} md={8} className="ProductList__filters d-flex justify-content-around align-items-center">
            {this.state.filters.map((filter, index) => {
              return (
                <div
                  key={index}
                  className="ProductList__filterEl hvr-underline"
                  style={{ fontWeight: filter.active ? 500 : 400, color: filter.active ? '#000000' : '#8E8E8E' }}
                  onClick={() => this.changeFilter(filter.id)}
                >
                  {filter.title}
                </div>
              )
            })}
          </Col>
        </Row>
        {this.state.sortProducts.length > 0 ? (
          <Row key={this.state.productsAtPage[0].id} className="p-0 m-0">
            {this.state.productsAtPage.map((product, index) => {
              if (typeof product !== 'undefined') {
                return (
                  <Col key={index} className="p-0 m-0" xs={12} sm={6} lg={4}>
                    <ProductCard product={product} />
                  </Col>
                )
              }
            })}
          </Row>
        ) : (
          <Row key={this.state.activePage} className="p-0 m-0">
            <NoRecords />
          </Row>
        )}

        <Row className="ProductList__pagesCont p-0 m-0 mt-5 mb-5">
          <Col className="ProductList__pagesTitle p-0 m-0" md={4} lg={3}>
            <h1>Страница</h1>
          </Col>
          <Col className="ProductList__pagesStickers p-0 m-0 pl-4 pr-4 d-flex justify-content-start" md={8} lg={9}>
            {pagesStringArray.map((pageNumber, index) => {
              return (
                <div
                  key={index}
                  className="ProductList__pageNum"
                  style={{ backgroundColor: pageNumber === this.state.activePage ? '#FFD12D' : '#E2E2E2' }}
                  onClick={() => this.setPage(pageNumber)}
                >
                  {pageNumber}
                </div>
              )
            })}
          </Col>
        </Row>
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

export default connect(mapStateToProps, mapDispatchToProps)(ProductList)
