import Organization from './Organization'
import Product from './Product'
import Terminal from './Terminal'
import Category from './Category'

export default interface MenuResponse {
  products: Category[]
  terminals: Terminal[]
  recentProducts: Product[]
  organizations: Organization[]
}
