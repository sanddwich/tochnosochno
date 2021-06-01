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
import { RouteComponentProps } from 'react-router-dom'
import { setOrganization } from '../../../Redux/actions/app'

interface MatchParams {
  organizationId: string
}

interface MainProps extends RouteComponentProps<MatchParams> {
  loading: boolean
  setOrganization: (organizationId: string) => void
}

interface MainState {}

class Main extends React.Component<MainProps, MainState> {
  componentDidMount() {
    if (this.props.match.params.organizationId) this.props.setOrganization(this.props.match.params.organizationId)
  }

  render() {
    return (
      <Container fluid className="Main p-0 m-0">
        {/* <ScrollAnimation duration={1} animateOnce={true} animateIn="animate__backInLeft"> */}
        <SliderContainer />
        {/* </ScrollAnimation> */}

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

const mapDispatchToProps = {
  setOrganization,
}

const mapStateToProps = (state: RootState) => {
  const { loading } = state.menu
  return {
    loading,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)
