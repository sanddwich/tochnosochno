import React, { Component, SyntheticEvent } from 'react'
import { connect } from 'react-redux'
import OrderItem from '../../../../../Interfaces/OrderItem'
import Variant from '../../../../../Interfaces/Variant'
import { changeOrderItemSize } from '../../../../../Redux/actions/orderItem'

import './SizeComboBox.scss'

type SizeComboBoxState = {}

type SizeComboBoxProps = {
  orderItem: OrderItem
  variants: Variant[]
  changeOrderItemSize: any
}

class SizeComboBox extends Component<SizeComboBoxProps, SizeComboBoxState> {
  constructor(props: SizeComboBoxProps) {
    super(props)

    this.state = {}
  }

  render() {
    return (
      <div className="size-combobox">
        {this.props.variants.map((size: Variant, index) => {
          return (
            <div
              onClick={() => this.props.changeOrderItemSize(size)}
              key={size.id}
              className={`size-combobox__item ${size.id === this.props.orderItem.productVariant.id ? 'selected' : ''}`}
            >
              {size.name}
            </div>
          )
        })}
      </div>
    )
  }
}

const mapDispatchToProps = {
  changeOrderItemSize,
}

const mapStateToProps = (state: any) => {
  const { orderItem } = state
  return {
    orderItem: orderItem.orderItem,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SizeComboBox)
