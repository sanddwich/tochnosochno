// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinTable, OneToOne, ManyToMany, OneToMany } from 'typeorm'
import { Product, OrderItemModifier } from '.'
import { Modifier } from './modifier.entity'

@Entity()
export class ProductModifier {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  maxAmount: number

  @Column()
  minAmount: number

  @Column()
  required: boolean

  @Column()
  defaultAmount: number

  @ManyToOne((type) => Product, (product) => product.modifiers)
  product: Product

  @ManyToOne((type) => Modifier, (modifier) => modifier.productModifier)
  modifier: Modifier

  @OneToMany((type) => OrderItemModifier, (orderItemModifier) => orderItemModifier.productModifier)
  orderItemModifiers: OrderItemModifier[]
}
