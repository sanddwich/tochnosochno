import Product from "./Product";

export default interface ComboItemOrder {
  comboId: string
  pickData: number
  name: String
  products: Product[]
  image?: String[] | undefined
}