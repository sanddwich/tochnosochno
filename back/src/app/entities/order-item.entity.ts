// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToOne, OneToMany, PrimaryColumn } from 'typeorm'
import { Order } from './order.entity'
import { ProductVariant } from './product-variant.entity'
import { OrderItemModifier } from './order-item-modifier.entity'

@Entity()
export class OrderItem {
  @PrimaryColumn('varchar', { length: 200 })
  id: number

  @Column()
  amount: number

  @ManyToOne((type) => Order, (order) => order.orderItems)
  order: Order

  @ManyToOne((type) => ProductVariant, (productVariant) => productVariant.orderItems)
  productVariant: ProductVariant

  @OneToMany((type) => OrderItemModifier, (orderItemModifier) => orderItemModifier.orderItem)
  orderItemModifiers: OrderItemModifier[]
}
