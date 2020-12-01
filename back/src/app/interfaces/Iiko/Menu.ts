import { Group } from '../../entities/group.entity'
import { ProductCategory } from '../../entities/product-category.entity'
import { Product } from '../../entities/product.entity'
import { Size } from '../../entities/size.entity'

export default interface Menu {
  groups: Group[]
  products: Product[]
  revision: number
  correlationId: string
  sizes: Size[]
  productCategories: ProductCategory[]
}
