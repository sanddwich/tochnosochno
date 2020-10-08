// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToOne, OneToMany, PrimaryColumn } from 'typeorm'
import { Order } from './order.entity'
import { ProductVariant } from './product-variant.entity'
import { OrderItemModifier } from './order-item-modifier.entity'
import { Product } from './product.entity'

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  positionId: string

  @Column()
  comment: string

  @Column({ nullable: true })
  productSizeId: string

  @Column()
  amount: number

  @ManyToOne((type) => Order, (order) => order.items)
  order: Order

  @ManyToOne((type) => ProductVariant, (productVariant) => productVariant.orderItems)
  productVariant: ProductVariant

  @OneToMany((type) => OrderItemModifier, (orderItemModifier) => orderItemModifier.orderItem)
  orderItemModifiers: OrderItemModifier[]
}
