// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm'
import { Product } from './product.entity'
import { OrderItem } from './order-item.entity'

@Entity()
export class ProductVariant {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  size: string

  @Column()
  weight: number

  @Column()
  price: number

  @ManyToOne((type) => Product, (product) => product.variants)
  product: Product

  @OneToMany((type) => OrderItem, (orderItem) => orderItem.productVariant)
  orderItems: OrderItem[]
}
