import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import MobSlider from './MobSlider/MobSlider'
import Slider from './Slider/Slider'

import './SliderContainer.scss'

interface SliderContainerProps {}

interface SliderContainerState {}

export default class SliderContainer extends React.Component<SliderContainerProps, SliderContainerState> {
  render() {
    return (
      <React.Fragment>
        <Container className="SliderContainer p-0 d-none d-md-block">
          <Row className="sliderBanner p-0 m-0">
            <Col md={8} className="p-0 m-0">
              <Slider />
            </Col>
            <Col md={4} className="p-0 m-0 sliderBanner__img">
              <img className="img-fluid" src="images/banners/banner.jpg" />
            </Col>
          </Row>
        </Container>

        <Container fluid className="SliderContainer p-0 m-0 d-flex d-md-none">
          <MobSlider />
        </Container>

        <Container fluid className="p-0 m-0 mb-4 d-flex d-md-none justify-content-center">
          <img className="img-fluid" src="images/banners/banner_mob.jpg" alt="" />
        </Container>
      </React.Fragment>
    )
  }
}
