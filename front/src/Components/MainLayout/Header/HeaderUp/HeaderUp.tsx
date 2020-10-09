import React from 'react'
import { Container } from 'react-bootstrap'

import './HeaderUp.scss'

interface HeaderUpProps {}

interface HeaderUpState {}

export default class HeaderUp extends React.Component<HeaderUpProps, HeaderUpState> {
  render() {
    return (
      <Container fluid className="HeaderUp p-0 m-0 d-flex justify-content-between">
        <div className="HeaderUp__menuItem">
          Акции
        </div>
      </Container>
    )
  }
}