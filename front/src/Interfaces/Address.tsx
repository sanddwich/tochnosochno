import City from './City'
import Street from './Street'

export default interface Address {
  id?: string
  name?: string
  street: Street
  house: string
  flat?: string
  entrance?: string
  floor?: string
  comment?: string
  index?: string
  building?: string
  doorphone?: string
  latitude?: string
  longitude?: string
  city?: City
}
