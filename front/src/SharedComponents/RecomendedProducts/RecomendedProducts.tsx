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
  title: string
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
      group.products &&
        group.products.map((product) => {
          if (this.props.product.recomended) {
            this.props.product.recomended.map((productId) => {
              if (product.id === productId) {
                const recProduct = recomendedProducts.filter((product) => {
                  return product.id === productId
                })
                if (recProduct.length === 0) {
                  recomendedProducts.push(product)
                }
              }
            })
          }
        })
    })

    return recomendedProducts
  }

  componentDidMount() {}

  render() {
    return (
      <div className="RecomendedProducts">
        {this.props.title ? <BlockName name={this.props.title} /> : null}

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
