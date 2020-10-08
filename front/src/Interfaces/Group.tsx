export default interface Group {
  id: string
  code?: string
  name: string
  description?: string
  parentGroup?: string
  order: number
  isIncludedInMenu: boolean
  additionalInfo?: string
  tags?: String[]
  isDeleted?: boolean
  seoDescription?: string
  seoText?: string
  seoKeywords?: string
  seoTitle?: string
  isGroupModifier?: boolean
  imageLinks: String[]
}
