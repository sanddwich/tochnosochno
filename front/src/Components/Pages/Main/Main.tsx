import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import SliderContainer from '../../../SharedComponents/SliderContainer/SliderContainer'

import './Main.scss'

interface MainProps {}

interface MainState {}

export default class Main extends React.Component<MainProps, MainState> {
  render() {
    return (
      <Container fluid className="p-0 m-0">
        <SliderContainer />
        <Container fluid className="nextCont p-0 m-0">
          <Container>213341312</Container>
        </Container>
      </Container>
    )
  }
}
