// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinTable,
  OneToOne,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
  JoinColumn,
} from 'typeorm'
import { Product, OrderItemModifier, GroupModifier } from '.'
import { Modifier } from './modifier.entity'

@Entity()
export class ProductModifier {
  @PrimaryColumn('varchar', { length: 200 })
  id: string

  @Column()
  maxAmount: number

  @Column()
  minAmount: number

  @Column()
  required: boolean

  @Column()
  defaultAmount: number

  @OneToOne((type) => Product)
  @JoinColumn({ name: 'id', referencedColumnName: 'id' })
  product: Product

  // @ManyToOne((type) => Product, (product) => product.modifiers)
  // product: Product

  @ManyToOne((type) => Modifier, (modifier) => modifier.productModifier)
  modifier: Modifier

  @OneToMany((type) => OrderItemModifier, (orderItemModifier) => orderItemModifier.product)
  orderItemModifiers: OrderItemModifier[]

  @ManyToOne((type) => GroupModifier, (groupModifier) => groupModifier.childModifiers)
  groupModifier: GroupModifier
}
