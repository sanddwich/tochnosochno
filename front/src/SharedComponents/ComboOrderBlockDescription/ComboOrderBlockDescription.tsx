import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { connect } from 'react-redux'
import ComboItemOrder from '../../Interfaces/ComboItemOrder'
import RoundButton from '../RoundButton/RoundButton'
import { showComboModal, appUpdateKey } from '../../Redux/actions/app'
import { deleteOrderItem } from '../../Redux/actions/order'
import './ComboOrderBlockDescription.scss'
import Category from '../../Interfaces/Category'
import OrderItem from '../../Interfaces/OrderItem'
import { RootState } from '../../Redux'
import Order from '../../Interfaces/Order'
import COBDItem from './COBDItem/COBDItem'

interface ComboOrderBlockDescriptionProps {
  order: Order
  category: Category
  comboItem: ComboItemOrder
  appUpdateKey: () => void
  showComboModal: (combo: Category, comboItemOrder?: ComboItemOrder) => void
  deleteOrderItem: (orderItem: OrderItem) => void
}

interface ComboOrderBlockDescriptionState {
  combosDropList: boolean
}

class ComboOrderBlockDescription extends React.Component<
  ComboOrderBlockDescriptionProps,
  ComboOrderBlockDescriptionState
> {
  constructor(props: ComboOrderBlockDescriptionProps) {
    super(props)
    this.state = {
      combosDropList: false,
    }
  }

  componentDidMount() {
    // console.log(this.props)
  }

  deleteOrderComboItem = (comboId: string, pickDate: number) => {
    if (this.props.order.items) {
      this.props.order.items.map((item) => {
        // console.log(item.comboId + " / " + this.props.comboId + " ====== " + item.pickDate + " / " + this.props.pickDate)
        if (item.comboId === comboId && item.pickDate === pickDate) {
          // console.log('Deleted: ' + item.comboId)
          this.props.deleteOrderItem(item)
        }
      })

      this.props.appUpdateKey()
    }
  }

  toggleDropList = ():void => {
    const combosDropList = !this.state.combosDropList
    this.setState({combosDropList})
  }

  render() {
    let price = 0
    this.props.comboItem.products.map((product) => {
      price = price + product.sizePrices[0].price.currentPrice
    })
    return (
      <Container fluid className="ComboOrderBlockDescription m-0 p-0">
        <Row className="ComboOrderBlockDescription__actionLine m-0 p-0">
          <Col
            sm={2}
            xs={12}
            className="ComboOrderBlockDescription__actionLineImg d-flex justify-content-center align-items-center mt-2"
            // onClick={() => this.props.showComboModal(this.props.category, this.props.comboItem)}
            onClick={() => this.toggleDropList()}
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
          <Col
            sm={5}
            xs={12}
            className="ComboOrderBlockDescription__actionLineName d-flex align-items-center justify-content-center mt-2"
            // onClick={() => this.props.showComboModal(this.props.category, this.props.comboItem)}
            onClick={() => this.toggleDropList()}
          >
            {this.props.comboItem.name}
          </Col>
          <Col
            sm={2}
            xs={4}
            className="ComboOrderBlockDescription__actionLinePrice d-flex justify-content-end align-items-center mt-2"
          >
            {price.toFixed(0)} <span>руб.</span>
          </Col>
          <Col
            sm={3}
            xs={8}
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
              onClick={() => this.deleteOrderComboItem(this.props.comboItem.comboId, this.props.comboItem.pickDate)}
            />
          </Col>
        </Row>

        {this.state.combosDropList ? (
          <React.Fragment>
            <Row className="ComboOrderBlockDescription__separate w-100"></Row>
            {this.props.comboItem.products && this.props.comboItem.products.length > 0 ? (
              <Row className="ComboOrderBlockDescription__productList p-0 m-0 mt-3">
                {this.props.comboItem.products.map((product, index) => {
                  return <COBDItem key={index} product={product} />
                })}
              </Row>
            ) : null}
          </React.Fragment>
        ) : null}

      </Container>
    )
  }
}

const mapDispatchToProps = {
  showComboModal,
  deleteOrderItem,
  appUpdateKey,
}

const mapStateToProps = (state: RootState) => {
  const { order } = state.order
  return {
    order,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ComboOrderBlockDescription)
