import Facet from './Facet'
import Modifier from './Modifier'
import SizePrice from './SizePrice'
import Variant from './Variant'

export default interface Product {
  facets: Facet[]
  id: string
  image: string
  ingredients: string
  isDeleted: boolean

  name: string
  seoDescription: string
  seoKeywords: string
  seoText: string
  seoTitle: string
  variants: Variant[]
  weight: number
  price?: number

  fatAmount?: number
  proteinsAmount?: number
  carbohydratesAmount?: number
  energyAmount?: number
  fatFullAmount?: number
  proteinsFullAmount?: number
  carbohydratesFullAmount?: number
  energyFullAmount?: number
  groupId?: string
  productCategoryId?: string
  type?: string
  orderItemType?: string
  modifierSchemaName?: string
  measureUnit?: string

  sizePrices: SizePrice[]
  modifiers: Modifier[]
  imageLinks: String[]
  doNotPrintInCheque: boolean
  parentGroup: string
  order: number
  code?: string
  description?: string
  additionalInfo: string
  tags: String[]
  fullNameEnglish: string
  recomended: string[]
}
