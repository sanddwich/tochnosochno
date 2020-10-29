import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
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
        <Row className="ComboOrderBlockDescription__actionLine m-0 p-0 d-flex justify-content-between">
          <Col xs={2} className="ComboOrderBlockDescription__actionLineImg">
            <img
              src={`${
                typeof this.props.comboItem.image !== 'undefined' && this.props.comboItem.image.length > 0
                  ? this.props.comboItem.image[0]
                  : '/images/products/no-photo.png'
              }`}
              alt={`${this.props.comboItem.name}`}
            />
          </Col>
          <Col xs={6} className="ComboOrderBlockDescription__actionLineName">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum quam earum explicabo dolores qui at quis
            pariatur, sed enim iste, facere hic, nesciunt magnam fuga tempore possimus voluptate aspernatur molestias.
          </Col>
          <Col xs={2} className="ComboOrderBlockDescription__actionLineRedact"></Col>
          <Col xs={2} className="ComboOrderBlockDescription__actionLineDelete"></Col>
        </Row>
      </Container>
    )
  }
}

export default ComboOrderBlockDescription
