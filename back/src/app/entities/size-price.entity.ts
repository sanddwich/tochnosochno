import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Price } from './price.entity'
import { Product } from './product.entity'
import { Size } from './size.entity'

@Entity()
export class SizePrice {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ nullable: true })
  sizeId: string

  @ManyToOne((type) => Product, (product) => product.sizePrices)
  product: Product

  @ManyToOne((type) => Price, (price) => price.sizePrices, { cascade: true })
  price: Price

  // @OneToOne((type) => Size, { nullable: true })
  // @JoinColumn()
  // size: Size
}
