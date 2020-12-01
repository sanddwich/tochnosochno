import { City } from '../../entities'
import { Iiko } from '../../services'
import IikoCity from './IikoCity'

export default interface CityResponse {
  correlationId: string
  cities: IikoCity[]
}
