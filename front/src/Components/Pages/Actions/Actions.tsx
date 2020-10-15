import React from 'react'
import { Container } from 'react-bootstrap'

import './Actions.scss'

interface ActionsProps {}

interface ActionsState {}

export default class Actions extends React.Component<ActionsProps, ActionsState> {
  render() {
    return (
      <Container className="Actions p-0 m-0 mt-4">
        <h1>Actions</h1>
      </Container>
    )
  }
}
