import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { Product } from '.'

@Entity()
export class Facet {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string
  @Column()
  image: string

  @ManyToOne((type) => Product, (product) => product.facets)
  product: Product
}
