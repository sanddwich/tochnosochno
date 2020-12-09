import { Street } from '../../entities'
import IikoStreet from './IikoStreet'

export default interface IikoAddress {
  street: IikoStreet
  index?: string
  house: string
  building?: string
  flat?: string
  entrance?: string
  floor?: string
  doorphone?: string
}
