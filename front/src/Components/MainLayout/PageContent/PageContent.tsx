import React from 'react'
import { Container } from 'react-bootstrap'

import './PageContent.scss'

interface PageContentProps {}

interface PageContentState {}

export default class PageContent extends React.Component<PageContentProps, PageContentState> {
  render() {
    return (
      <Container fluid className="PageContent p-0 m-0">
        {this.props.children}
      </Container>
    )
  }
}
