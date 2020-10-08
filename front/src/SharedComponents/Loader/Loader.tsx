import React from 'react'
import './Loader.scss'
import { Container } from 'react-bootstrap'

interface LoaderState {}

interface LoaderProps {}

export default class Loader extends React.Component<LoaderProps, LoaderState> {
  render() {
    return (
      <Container fluid className="Loader mt-2 mb-2">
        <span></span>
        <span></span>
        <span></span>
      </Container>
    )
  }
}
