import Modifier from './Modifier'

export default interface GroupModifier {
  defaultAmount?: number
  id: string
  maxAmount: number
  minAmount: number
  required?: boolean
  hideIfDefaultAmount: boolean
  splittable: boolean
  freeOfChargeAmount: number
  childModifiersHaveMinMaxRestrictions: boolean
  childModifiers: Modifier[]
}
