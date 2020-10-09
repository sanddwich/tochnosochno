import React from 'react'
import { Container } from 'react-bootstrap'

import './Main.scss'

interface MainProps {}

interface MainState {}

export default class Main extends React.Component<MainProps, MainState> {
  render() {
    return (
      <Container className="Main p-0 m-0">
        <h1>Main</h1>
      </Container>
    )
  }
}
