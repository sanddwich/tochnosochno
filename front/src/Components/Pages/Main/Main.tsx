import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import Slider from '../../../SharedComponents/Slider/Slider'

import './Main.scss'

interface MainProps {}

interface MainState {}

export default class Main extends React.Component<MainProps, MainState> {
  render() {
    return (
      <Container className="Main p-0">
        <Row className="sliderBanner p-0 m-0">
          <Col md={8} className="p-0 m-0">
            <Slider />
          </Col>
          <Col md={4} className="p-0 m-0 sliderBanner__img">
            <img className="img-fluid" src="images/banners/banner.jpg"/>
          </Col>
        </Row>


      </Container>
    )
  }
}
