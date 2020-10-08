import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Product } from './product.entity'
import { Size } from './size.entity'

@Entity()
export class SizePrice {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  currentPrice: number

  @Column()
  nextPrice: number

  @Column()
  isIncludedInMenu: boolean

  @Column()
  nextIncludedInMenu: boolean

  @Column()
  nextDatePrice: string

  @ManyToOne((type) => Product, (product) => product.sizePrices)
  product: Product

  @OneToOne((type) => Size)
  @JoinColumn()
  size: Size
}
