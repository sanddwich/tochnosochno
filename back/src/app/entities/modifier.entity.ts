// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Group } from '@foal/typeorm/lib/entities/group.entity'
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  ManyToMany,
  PrimaryColumn,
  JoinTable,
  JoinColumn,
  ManyToOne,
} from 'typeorm'
import { GroupModifier } from './group-modifier.entity'
import { ProductModifier } from './product-modifier.entity'
import { Product } from './product.entity'

@Entity()
export class Modifier {
  @PrimaryColumn('varchar', { length: 200 })
  id: string
  // @OneToOne((type) => Product, (product) => product.id, { cascade: false, primary: true })
  // @JoinColumn({ name: 'id', referencedColumnName: 'id' })
  // id: Product

  @Column()
  name: string

  @Column()
  price: number

  @Column()
  maxAmount: number

  @Column()
  minAmount: number

  @Column()
  required: boolean

  @Column()
  defaultAmount: number

  @Column()
  hideIfDefaultAmount: boolean

  @Column()
  splittable: boolean

  @Column()
  freeOfChargeAmount: number

  @OneToMany((type) => ProductModifier, (modifier) => modifier.modifier)
  productModifier: ProductModifier[]

  // @ManyToOne((type) => GroupModifier, (groupModifier) => groupModifier.childModifiers)
  // @JoinTable()
  // groupModifier: GroupModifier

  @OneToOne((type) => Product, (product) => product.id, { cascade: true })
  @JoinColumn({ name: 'id', referencedColumnName: 'id' })
  product: Product

  // @ManyToOne((type) => GroupModifier, (groupModifier) => groupModifier.childModifiers)
  // groupModifier: GroupModifier
}
