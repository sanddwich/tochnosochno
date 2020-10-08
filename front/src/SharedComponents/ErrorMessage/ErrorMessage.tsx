import React from 'react'
import './ErrorMessage'
import { Container } from 'react-bootstrap'

interface ErrorMessageProps {
  errorMessage: string
}

interface ErrorMessageState {}

export default class ErrorMessage extends React.Component<ErrorMessageProps, ErrorMessageState> {
  render() {
    return (
      <Container fluid className=" d-flex justify-content-center align-items-center text-danger" style={{height:'100%'}} >
        {this.props.errorMessage}
      </Container>
    )
  }
}