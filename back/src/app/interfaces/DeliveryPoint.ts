import { Address } from '../entities'
import Coordinate from './Coordinate'
import IikoAddress from './Iiko/IikoAddress'

export default interface DeliveryPoint {
  address?: IikoAddress
  externalCartographyId?: string
  comment?: string
  coordinates?: Coordinate
}
