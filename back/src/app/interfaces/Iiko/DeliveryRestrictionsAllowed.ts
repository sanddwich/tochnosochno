import Coordinate from '../Coordinate'
import TerminalGroup from './TerminalGroup'

export default interface DeliveryRestrictionsAllowed {
  isAllowed: boolean
  rejectCause: string
  addressExternalId: string
  location: Coordinate
  allowedItems: TerminalGroup
  errorDescription?: string
}
