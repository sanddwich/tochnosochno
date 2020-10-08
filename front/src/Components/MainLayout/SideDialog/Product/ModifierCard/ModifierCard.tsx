import React, { Component } from 'react'
import { connect } from 'react-redux'
import Modifier from '../../../../../Interfaces/Modifier'
import OrderItem from '../../../../../Interfaces/OrderItem'
import OrderItemModifier from '../../../../../Interfaces/OrderItemModifier'

import './ModifierCard.scss'

type ModifierCardState = {
  amount: number
}

type ModifierCardProps = {
  orderItemProductModifier: OrderItemModifier | undefined
  modifier: Modifier
  amount: number
  changeModifiers: (productModifier: Modifier, amount: number) => void
}

class ModifierCard extends Component<ModifierCardProps, ModifierCardState> {
  constructor(props: ModifierCardProps) {
    super(props)
    this.state = {
      amount: this.props.amount,
    }
  }

  increment = () => {
    let amount = this.props.orderItemProductModifier?.amount || 0
    if (amount < this.props.modifier.maxAmount) {
      amount += 1
    }
    this.setState({ amount })
    this.props.changeModifiers(this.props.modifier, amount)
  }

  decrement = () => {
    let amount = this.props.orderItemProductModifier?.amount || 0
    if (amount > this.props.modifier.minAmount) {
      amount -= 1
    }

    this.setState({ amount })
    this.props.changeModifiers(this.props.modifier, amount)
  }

  render() {
    return (
      <div className="modifier-card">
        <div className="modifier-card__image">
          <img src={`images/modifiers/${this.props.modifier.modifier.image}`} alt={this.props.modifier.modifier.name} />
        </div>
        <div className="modifier-card__buttons">
          <div onClick={this.decrement} className="modifier-card__remove-btn">
            -
          </div>
          <div onClick={this.increment} className="modifier-card__add-btn">
            +
          </div>
          <div className="modifier-card__amount">{this.props.orderItemProductModifier?.amount || 0}</div>
        </div>

        <div className="modifier-card__name">{this.props.modifier.modifier.name}</div>
      </div>
    )
  }
}

export default ModifierCard
