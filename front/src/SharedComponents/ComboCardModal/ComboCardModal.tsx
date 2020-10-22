import React from 'react'
import { Container } from 'react-bootstrap'
import './ComboCardModal.scss'

interface ComboCardModalProps {}

interface ComboCardModalState {}

class ComboCardModal extends React.Component<ComboCardModalProps, ComboCardModalState> {
  render() {
    return (
      <React.Fragment>
        
        <Container fluid className="ComboCardModal p-0 m-0 d-flex align-items-center">
          <Container className="ComboCardModal__body pt-2 pb-2"></Container>
        </Container>
      </React.Fragment>
    )
  }
}

export default ComboCardModal
