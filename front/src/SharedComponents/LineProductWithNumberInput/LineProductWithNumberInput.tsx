import React from 'react'
import Product from '../../Interfaces/Product'
import ActionButton from '../ActionButton/ActionButton'
import NumberInput from '../NumberInput/NumberInput'
import RoundButton from '../RoundButton/RoundButton'

import './LineProductWithNumberInput.scss'

interface LineProductWithNumberInputProps {
  product: Product
}

interface LineProductWithNumberInputState {}

export default class LineProductWithNumberInput extends React.Component<
  LineProductWithNumberInputProps,
  LineProductWithNumberInputState
> {
  render() {
    return (
      <div className="LineProductWithNumberInput">
        <div className="LineProductWithNumberInput__product ">
          <div className="LineProductWithNumberInput__product__image  ">
            <img src={`${this.props.product.image}`} alt="" />
          </div>

          <div className="LineProductWithNumberInput__product__name ">{this.props.product.name}</div>

          <div className="LineProductWithNumberInput__product__price">
            <div className="LineProductWithNumberInput__product__newPrice ">
              <span className="bold">980</span>руб
            </div>
            <div className="LineProductWithNumberInput__product__oldPrice "> 1170р</div>
          </div>
        </div>
        <NumberInput label="Количество" hideLabel={true} />

        <div className="LineProductWithNumberInput__delete">
          <RoundButton
            width="60px"
            height="60px"
            backgroundColor="#F2F2F2"
            icon="trash.svg"
            onClick={() => console.log('delete from cart')}
          />
        </div>
      </div>
    )
  }
}
