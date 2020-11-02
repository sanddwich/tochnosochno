import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import SliderContainer from '../../../SharedComponents/SliderContainer/SliderContainer'
import CategoriesContainer from './CategoriesContainer/CategoriesContainer'
import NewItems from './NewItems/NewItems'

import './Main.scss'
import Banners from './Banners/Banners'
import PopularProducts from './PopularProducts/PopularProducts'
import FullBanner from './FullBanner/FullBanner'
import { RootState } from '../../../Redux'
import { connect } from 'react-redux'

interface MainProps {
  loading: boolean
}

interface MainState {}

class Main extends React.Component<MainProps, MainState> {
  render() {
    return (
      <Container fluid className="Main p-0 m-0">
        <SliderContainer />
        <CategoriesContainer />
        {this.props.loading ? null : <NewItems />}

        <Banners />
        {this.props.loading ? null : <PopularProducts />}

        <FullBanner />
      </Container>
    )
  }
}

const mapDispatchToProps = {}

const mapStateToProps = (state: RootState) => {
  const { loading } = state.menu
  return {
    loading,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)
