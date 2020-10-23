// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Customer } from './customer.entity'
import { Product } from './product.entity'

@Entity()
export class FavoriteProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne((type) => Product, (product) => product.favoriteProducts)
  product: Product

  @ManyToOne((type) => Customer, (customer) => customer.favoriteProducts)
  customer: Customer
}
