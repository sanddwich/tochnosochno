import React from 'react'
import { connect } from 'react-redux'
import Category from '../../Interfaces/Category'
import Product from '../../Interfaces/Product'
import { RootState } from '../../Redux'
import BlockName from '../BlockName/BlockName'
import LineProductWithCart from '../LineProductWithCart/LineProductWithCart'

import './RecomendedProducts.scss'

interface RecomendedProductsProps {
  menu: Category[]
}

interface RecomendedProductsState {
  cartProducts: Product[]
}

class RecomendedProducts extends React.Component<RecomendedProductsProps, RecomendedProductsState> {
  constructor(props: RecomendedProductsProps) {
    super(props)
    this.state = {
      cartProducts: [],
    }
  }

  componentDidMount() {
    let cartProducts: Product[] = []
    this.props.menu.map((category) => {
      if (category.products[category.products.length - 1]) {
        cartProducts.push(category.products[category.products.length - 1])
      }
    })
    this.setState({ cartProducts })
    // console.log(lastProducts)
  }

  render() {
    return (
      <div className="RecomendedProducts">
        <BlockName name="C этим заказывают" />
        <div className="RecomendedProducts__products">
          {this.state.cartProducts.map((cartProduct: Product) => {
            return <LineProductWithCart key={cartProduct.id} product={cartProduct} />
          })}
        </div>
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(RecomendedProducts)
