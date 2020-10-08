import ModifierDetail from './ModifierDetail'

export default interface Modifier {
  id: string
  defaultAmount?: number
  maxAmount: number
  minAmount: number
  modifier: ModifierDetail
  required?: boolean
  hideIfDefaultAmount: boolean
  splittable: boolean
  freeOfChargeAmount: number
}
