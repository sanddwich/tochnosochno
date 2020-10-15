import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import SliderContainer from '../../../SharedComponents/SliderContainer/SliderContainer'
import CategoriesContainer from './CategoriesContainer/CategoriesContainer'
import NewItems from './NewItems/NewItems'

import './Main.scss'

interface MainProps {}

interface MainState {}

export default class Main extends React.Component<MainProps, MainState> {
  render() {
    return (
      <Container fluid className="Main p-0 m-0">
        <SliderContainer />
        <CategoriesContainer />
        <NewItems />
      </Container>
    )
  }
}
