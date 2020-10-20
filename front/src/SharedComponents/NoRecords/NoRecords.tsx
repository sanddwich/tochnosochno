import React from 'react'
import { Container } from 'react-bootstrap'

import './NoRecords.scss'

interface NoRecordsProps {}

interface NoRecordsState {}

export default class NoRecords extends React.Component<NoRecordsProps, NoRecordsState> {
  render() {
    return (
      <Container className="NoRecords p-0 d-flex justify-content-center pt-5 pb-5 text-danger">
        <h1><strong>В данном разделе отсутствуют записи</strong></h1>
      </Container>
    )
  }
}
