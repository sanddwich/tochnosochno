import ModifierDetail from './ModifierDetail'

export default interface Modifier {
  defaultAmount?: number
  id: number
  maxAmount: number
  minAmount: number
  modifier: ModifierDetail
  required?: boolean
}
