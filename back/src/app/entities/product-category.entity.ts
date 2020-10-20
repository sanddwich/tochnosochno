// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'
import { Product } from './product.entity'

@Entity()
export class ProductCategory {
  @PrimaryColumn('varchar', { length: 200 })
  id: string

  @Column()
  name: string

  @OneToMany((type) => Product, (product) => product.productCategory)
  products: ProductCategory[]
}
