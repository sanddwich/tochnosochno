import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { connect } from 'react-redux'
import Category from '../../../../Interfaces/Category'
import Product from '../../../../Interfaces/Product'
import { RootState } from '../../../../Redux'
import BlockName from '../../../../SharedComponents/BlockName/BlockName'

import './ProductList.scss'

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
    this.getProducts()
  }

  getPageProducts(sortProducts: Product[], activePage: number, productsPerPage: number):void {
    const productsAtPage: Product[] = []
    for (let i = (activePage - 1)*productsPerPage; i < activePage*productsPerPage; i++) {
      productsAtPage.push(sortProducts[i])
    }
    this.setState({productsAtPage})
  }

  getProducts = (): void => {
    const category = this.props.menu.find((cat) => cat.id === this.props.categoryId) as Category || []
    const sortProducts: Product[] = category?.products
    const pages = Math.ceil(sortProducts.length/this.props.productsPerPage)
    this.getPageProducts(sortProducts, this.state.activePage, this.props.productsPerPage)

    this.setState({ sortProducts, pages })
  }

  getFilter = (): number => {
    return this.state.filters.find((filter) => filter.active === true)?.id as number
  }

  changeFilter = (filterId: number): void => {}

  render() {
    const activeFilter: number = this.getFilter()
    // console.log(activeFilter)
    return (
      <Container key={activeFilter} className="ProductList p-0">
        <Row className="p-0 m-0 d-flex justify-content-between">
          <Col xs={4} className="ProductList__blockName">
            <BlockName name={this.props.menu.find((cat) => cat.id === this.props.categoryId)?.name || ''} />
          </Col>
          <Col xs={8} className="ProductList__filters d-flex justify-content-around align-items-center">
            {this.state.filters.map((filter, index) => {
              return (
                <div
                  key={index}
                  className="ProductList__filterEl"
                  style={{ fontWeight: filter.active ? 500 : 400 }}
                  onClick={() => this.changeFilter(filter.id)}
                >
                  {filter.title}
                </div>
              )
            })}
          </Col>
        </Row>
        <Row key={this.state.activePage} className="p-0 m-0">
          {this.state.sortProducts.map((product, index) => {

          })}
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
