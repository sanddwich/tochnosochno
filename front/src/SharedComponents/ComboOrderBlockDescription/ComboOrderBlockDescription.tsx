import React from 'react'
import { Container, Row } from 'react-bootstrap'
import ComboItemOrder from '../../Interfaces/ComboItemOrder'
import './ComboOrderBlockDescription.scss'

interface ComboOrderBlockDescriptionProps {
  comboItem: ComboItemOrder
}

interface ComboOrderBlockDescriptionState {}

class ComboOrderBlockDescription extends React.Component<
  ComboOrderBlockDescriptionProps,
  ComboOrderBlockDescriptionState
> {
  render() {
    return (
      <Container fluid className="ComboOrderBlockDescription m-0 p-0">
        <Row className="ComboOrderBlockDescription__actionLine m-0 p-0 d-flex justify-content-between align-items-center">
          <div className="ComboOrderBlockDescription__actionLineImg ">
            <img
              src={`${
                typeof this.props.comboItem.image !== 'undefined' && this.props.comboItem.image.length > 0
                  ? this.props.comboItem.image[0]
                  : '/images/products/no-photo.png'
              }`}
              alt={`${this.props.comboItem.name}`}
            />
          </div>
          <div className="ComboOrderBlockDescription__actionLineName">{this.props.comboItem.name}</div>
          <div className="ComboOrderBlockDescription__actionLineRedact"></div>
          <div className="ComboOrderBlockDescription__actionLineDelete"></div>
        </Row>
      </Container>
    )
  }
}

export default ComboOrderBlockDescription
