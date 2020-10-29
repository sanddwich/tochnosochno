import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { connect } from 'react-redux'
import ComboItemOrder from '../../Interfaces/ComboItemOrder'
import RoundButton from '../RoundButton/RoundButton'
import { showComboModal } from '../../Redux/actions/app'
import './ComboOrderBlockDescription.scss'
import Category from '../../Interfaces/Category'

interface ComboOrderBlockDescriptionProps {
  category: Category
  comboItem: ComboItemOrder
  showComboModal: (combo: Category, comboItemOrder?: ComboItemOrder ) => void
}

interface ComboOrderBlockDescriptionState {}

class ComboOrderBlockDescription extends React.Component<
  ComboOrderBlockDescriptionProps,
  ComboOrderBlockDescriptionState
> {
  deleteOrderComboItem = (comboId: string, pickData: number) => {
    console.log('deleteOrderComboItem')
  }

  updateOrderComboItem = (comboId: string, pickData: number) => {
    console.log('updateOrderComboItem')
  }

  render() {
    let price = 0
    this.props.comboItem.products.map(product => {
      price = price + product.sizePrices[0].price.currentPrice
    })
    return (
      <Container fluid className="ComboOrderBlockDescription m-0 p-0">
        <Row className="ComboOrderBlockDescription__actionLine m-0 p-0">
          <Col
            sm={2} xs={12}
            className="ComboOrderBlockDescription__actionLineImg d-flex justify-content-center align-items-center"
          >
            <img
              src={`${
                typeof this.props.comboItem.image !== 'undefined' && this.props.comboItem.image.length > 0
                  ? this.props.comboItem.image[0]
                  : '/images/products/no-photo.png'
              }`}
              className="img-fluid"
              alt={`${this.props.comboItem.name}`}
            />
          </Col>
          <Col sm={5} xs={12} className="ComboOrderBlockDescription__actionLineName d-flex align-items-center justify-content-center">
            {this.props.comboItem.name}
          </Col>
          <Col
            sm={2} xs={4}
            className="ComboOrderBlockDescription__actionLinePrice d-flex justify-content-end align-items-center mt-2"
          >
            {price.toFixed(0)} <span>руб.</span> 
          </Col>
          <Col
            sm={3} xs={8}
            className="ComboOrderBlockDescription__actionLineButtons d-flex justify-content-end align-items-center mt-2"
          >
            <RoundButton
              width="50px"
              height="50px"
              backgroundColor="#ffcf25"
              icon="edit-icon.svg"
              onClick={() => this.props.showComboModal(this.props.category, this.props.comboItem)}
            />
            <RoundButton
              width="50px"
              height="50px"
              backgroundColor="#F2F2F2"
              icon="trash.svg"
              onClick={() => this.deleteOrderComboItem(this.props.comboItem.comboId, this.props.comboItem.pickData)}
            />
          </Col>
        </Row>
      </Container>
    )
  }
}

const mapDispatchToProps = {
  showComboModal,
}

export default connect(null, mapDispatchToProps)(ComboOrderBlockDescription)