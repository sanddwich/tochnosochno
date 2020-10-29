import Product from "./Product";

export default interface ComboItemOrder {
  comboId: string
  pickDate: number
  name: String
  products: Product[]
  image?: String[] | undefined
}