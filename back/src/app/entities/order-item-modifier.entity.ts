// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm'
import { OrderItem } from './order-item.entity'
import { ProductModifier } from './product-modifier.entity'

@Entity()
export class OrderItemModifier {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  amount: number

  @ManyToOne((type) => OrderItem, (orderItem) => orderItem.orderItemModifiers)
  orderItem: OrderItem

  @ManyToOne((type) => ProductModifier, (productModifier) => productModifier.orderItemModifiers)
  productModifier: ProductModifier
}
