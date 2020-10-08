import React, { Component } from 'react'
import { connect } from 'react-redux'
import './Bonus.scss'
import { applyBonusOrder } from '../../../../../../Redux/actions/order'
import Order from '../../../../../../Interfaces/Order'
import Customer from '../../../../../../Interfaces/Customer'

type BonusState = {
  isChecked: boolean
}

type BonusProps = {
  customer: Customer
  order: Order
  value: number
  showCheck: boolean
  applyBonusOrder: () => {}
}
class Bonus extends Component<BonusProps, BonusState> {
  constructor(props: any) {
    super(props)
    this.state = {
      isChecked: !!this.props.order.bonus,
    }
  }

  clickHandler = () => {
    this.setState({
      isChecked: !this.state.isChecked,
    })
    this.props.applyBonusOrder()
  }

  render() {
    // console.log(this.props.customer)
    return (
      <div className="bonus">
        Бонусов доступно:
        <span hidden={this.state.isChecked} className="bonus__value">
          {this.props.customer.bonus}
        </span>
        <span hidden={!this.state.isChecked} className="bonus__value">
          {this.props.customer.bonus - (this.props.order.bonus || 0)}
        </span>
        <img src="images/gold.svg" alt="gold" />
        <div
          hidden={!this.props.showCheck || this.props.customer.bonus === 0}
          className="bonus__checkbox"
          onClick={this.clickHandler}
        >
          <div className="bonus__checkbox__img">
            <img hidden={this.state.isChecked} src="images/checkbox.svg" alt="check" />
            <img hidden={!this.state.isChecked} src="images/checkbox-checked.svg" alt="check" />
          </div>

          <div> Списать бонусы?</div>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = {
  applyBonusOrder,
}

const mapStateToProps = (state: any) => {
  const { order, auth } = state
  return {
    order: order.order,
    customer: auth.customer,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Bonus)
