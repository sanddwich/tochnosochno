import Product from "./Product";

export default interface ComboItemOrder {
  comboId: number
  pickData: number
  name: String
  products: Product[]
  image?: String[] | undefined
}