import Category from './Category'
import Facet from './Facet'
import GroupModifier from './GroupModifier'
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
  price: number

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
  createdAt?: string

  sizePrices: SizePrice[]
  modifiers: Modifier[]
  groupModifiers: GroupModifier[]
  imageLinks: String[]
  doNotPrintInCheque: boolean
  parentGroup?: Category
  order: number
  code?: string
  description?: string
  additionalInfo: string
  tags: String[]
  fullNameEnglish: string
  recomended: string[]
}
