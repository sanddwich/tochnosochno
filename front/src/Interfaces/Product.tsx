import Facet from './Facet'
import Modifier from './Modifier'
import Variant from './Variant'

export default interface Product {
  facets: Facet[]
  id: number
  image: string
  ingredients: string
  isDeleted: boolean
  modifiers: Modifier[]
  name: string
  seoDescription: string
  seoKeywords: string
  seoText: string
  seoTitle: string
  variants: Variant[]
  weight: number
  price?: number
}
