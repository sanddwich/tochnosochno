import React from 'react'
import { Container } from 'react-bootstrap'

import './BreadCrumbs.scss'

interface BreadCrumbsProps {}

interface BreadCrumbsState {}

export default class BreadCrumbs extends React.Component<BreadCrumbsProps, BreadCrumbsState> {
  render() {
    return (
      <Container className="BreadCrumbs p-0 mt-4">
        <h1>BreadCrumbs</h1>
      </Container>
    )
  }
}
