import { Address } from '../entities'
import Coordinate from './Coordinate'

export default interface DeliveryPoint {
  address?: Address
  externalCartographyId?: string
  comment?: string
  coordinates?: Coordinate
}
