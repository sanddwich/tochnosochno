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
import ScrollAnimation from 'react-animate-on-scroll'
import 'animate.css/animate.min.css'

interface MainProps {
  loading: boolean
}

interface MainState {}

class Main extends React.Component<MainProps, MainState> {
  render() {
    return (
      <Container fluid className="Main p-0 m-0">
        <ScrollAnimation duration={1} animateOnce={true} animateIn="animate__backInLeft">
          <SliderContainer />
        </ScrollAnimation>

        {this.props.loading ? null : (
          <ScrollAnimation duration={1} animateOnce={true} animateIn="animate__backInRight">
            <CategoriesContainer />
          </ScrollAnimation>
        )}
        {this.props.loading ? null : (
          <ScrollAnimation duration={1} animateOnce={true} animateIn="animate__bounceInLeft">
            <NewItems />
          </ScrollAnimation>
        )}
        <ScrollAnimation duration={1} animateOnce={true} animateIn="animate__bounceInRight">
          <Banners />
        </ScrollAnimation>

        {this.props.loading ? null : (
          <ScrollAnimation duration={1} animateOnce={true} animateIn="animate__bounceInLeft">
            <PopularProducts />
          </ScrollAnimation>
        )}
        <ScrollAnimation duration={1} animateOnce={true} animateIn="animate__fadeInUp">
          <FullBanner />
        </ScrollAnimation>
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
