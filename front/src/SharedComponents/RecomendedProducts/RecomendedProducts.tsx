import React from 'react'
import { connect } from 'react-redux'
import Category from '../../Interfaces/Category'
import Group from '../../Interfaces/Group'
import Product from '../../Interfaces/Product'
import { RootState } from '../../Redux'
import BlockName from '../BlockName/BlockName'
import LineProductWithCart from '../LineProductWithCart/LineProductWithCart'

import './RecomendedProducts.scss'

interface RecomendedProductsProps {
  product: Product
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

  getRecomendedProducts = (): Product[] => {
    const recomendedProducts: Product[] = []
    this.props.menu.map((group: Category) => {
      group.products.map((product) => {
        this.props.product.recomended.map((productId) => {
          if (product.id === productId) {
            recomendedProducts.push(product)
          }
        })
      })
    })

    return recomendedProducts
  }

  componentDidMount() {}

  render() {
    return (
      <div className="RecomendedProducts">
        <BlockName name="C этим заказывают" />
        <div className="RecomendedProducts__products">
          {this.getRecomendedProducts().map((product: Product) => {
            return <LineProductWithCart key={product.id} product={product} />
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
