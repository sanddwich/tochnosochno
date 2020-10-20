import React from 'react'
import { connect } from 'react-redux'
import Category from '../../Interfaces/Category'
import Product from '../../Interfaces/Product'
import { RootState } from '../../Redux'
import BlockName from '../BlockName/BlockName'
import LineProductWithNumberInput from '../LineProductWithNumberInput/LineProductWithNumberInput'
import NumberInput from '../NumberInput/NumberInput'

import './CartOrder.scss'

interface CartOrderProps {
  menu: Category[]
}

interface CartOrderState {
  cartProducts: Product[]
}

class CartOrder extends React.Component<CartOrderProps, CartOrderState> {
  constructor(props: CartOrderProps) {
    super(props)
    this.state = {
      cartProducts: [],
    }
  }

  componentDidMount() {
    let cartProducts: Product[] = []
    this.props.menu.map((category) => {
      cartProducts.push(category.products[category.products.length - 1])
    })
    this.setState({ cartProducts })
    // console.log(lastProducts)
  }

  render() {
    return (
      <div className="CartOrder">
        <div className="CartOrder__banner-mob">
          <img className="img-fluid" src="/images/banners/full_banner.jpg" alt="" />
        </div>
        <div className="CartOrder__left">
          <BlockName name="Ваш заказ" />
          <div className="CartOrder__products">
            {this.state.cartProducts.map((cartProduct: Product) => {
              return <LineProductWithNumberInput key={cartProduct.id} product={cartProduct} />
            })}
          </div>

          <div className="CartOrder__guests">
            <NumberInput label="Количество персон" hideLabel={false} />
          </div>

          <div className="CartOrder__total">
            <div className="CartOrder__total__label">Общая сумма</div>
            <div className="CartOrder__total__amount">2940 р</div>
          </div>
        </div>

        <div className="CartOrder__banner">
          <img className="img-fluid" src="/images/banners/cart-banner.png" alt="" />
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

export default connect(mapStateToProps, mapDispatchToProps)(CartOrder)
