import React from 'react'
import { connect } from 'react-redux'
import Product from '../../Interfaces/Product'
import { RootState } from '../../Redux'
import RoundButton from '../RoundButton/RoundButton'
import { changeFavorite } from '../../Redux/actions/auth'
import { showLoginModal } from '../../Redux/actions/app'
import Customer from '../../Interfaces/Customer'

interface FavouriteRoundButtonProps {
  product: Product
  changeFavorite: any
  customer: Customer
  loading: boolean
  showLoginModal: () => void
}

interface FavouriteRoundButtonState {
  loading: boolean
}

class FavouriteRoundButton extends React.Component<FavouriteRoundButtonProps, FavouriteRoundButtonState> {
  _isMounted = false
  constructor(props: FavouriteRoundButtonProps) {
    super(props)
    this.state = {
      loading: false,
    }
  }
  componentDidMount() {
    this._isMounted = true
  }
  componentWillUnmount() {
    this._isMounted = false
  }

  favoriteClick = async () => {
    this.setState({ loading: true })
    if (
      this.props.customer.favoriteProducts?.filter((favProduct) => this.props.product.id === favProduct.product.id)
        .length > 0
    ) {
      await this.props.changeFavorite(this.props.product.id, true, this.props.product)
    } else {
      await this.props.changeFavorite(this.props.product.id, false, this.props.product)
    }
    if (this._isMounted) {
      this.setState({ loading: false })
    }
  }

  render() {
    return (
      <React.Fragment>
        {this.props.customer ? (
          <RoundButton
            loading={this.state.loading}
            icon="favorite.svg"
            backgroundColor={
              this.props.customer.favoriteProducts?.filter(
                (favProduct) => this.props.product.id === favProduct.product.id
              ).length > 0
                ? '#ffd12d'
                : 'white'
            }
            onClick={() => this.favoriteClick()}
          />
        ) : (
          <RoundButton
            loading={this.state.loading}
            icon="favorite.svg"
            backgroundColor="white"
            onClick={() => this.props.showLoginModal()}
          />
        )}
      </React.Fragment>
    )
  }
}

const mapDispatchToProps = {
  changeFavorite,
  showLoginModal,
}

const mapStateToProps = (state: RootState) => {
  const { order } = state.order
  const { customer, loading } = state.auth

  return {
    customer,
    loading,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FavouriteRoundButton)
