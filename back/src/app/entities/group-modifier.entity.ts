// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Group } from './group.entity'
import { Modifier } from './modifier.entity'
import { ProductModifier } from './product-modifier.entity'
import { Product } from './product.entity'

@Entity()
export class GroupModifier {
  @PrimaryColumn('varchar', { length: 200 })
  id: string

  @Column()
  maxAmount: number

  @Column()
  minAmount: number

  @Column()
  required: boolean

  @Column()
  hideIfDefaultAmount: boolean

  @Column()
  defaultAmount: number

  @Column()
  splittable: boolean

  @Column()
  freeOfChargeAmount: number

  @OneToOne((type) => Group, { cascade: true })
  @JoinColumn({ name: 'id', referencedColumnName: 'id' })
  group: Group

  @ManyToMany((type) => Modifier, { cascade: true })
  @JoinTable({ name: 'group_modifier_childModifiers' })
  childModifiers: Modifier[]

  @ManyToMany((type) => Product, (product) => product.groupModifiers, { cascade: false })
  products: Product[]

  // @ManyToMany((type) => Product, { cascade: true })
  // @JoinTable({ name: 'product_group_modifiers' })
  // products: Product[]
}
