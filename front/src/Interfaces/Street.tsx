import City from './City'

export default interface Street {
  id?: string
  name: string
  externalRevision?: number
  isDeleted?: boolean
  classifierId?: string
  city?: string
}
