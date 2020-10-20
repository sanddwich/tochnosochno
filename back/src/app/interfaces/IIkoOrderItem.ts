import { Product } from '../entities'
import ComboInformation from './ComboInformation'
import IIkoOrderItemModifier from './IIkoOrderItemModifier'
import IIkoOrderItemType from './IIkoOrderItemType'

export default class IIkoOrderItem {
  type: string
  productId: string
  amount: number
  modifiers?: IIkoOrderItemModifier[]
  price?: number
  productSizeId?: string
  comment?: string
  positionId?: string
  comboInformation?: ComboInformation
}
