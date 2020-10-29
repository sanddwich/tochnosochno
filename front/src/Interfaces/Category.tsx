import Product from './Product'

export default interface Category {
  additionalInfo: string
  description: string
  comboProductsCount?: number
  id: string
  images: string
  imageLinks: String[]
  isDeleted: boolean
  isIncludedInMenu: boolean
  isSiteDisplay: boolean
  isCombo: boolean
  name: string
  order: number
  products: Product[]
  seoDescription: string
  seoKeywords: string
  seoText: string
  seoTitle: string
  tags: string
  active?: boolean
  parentGroup: string
}
