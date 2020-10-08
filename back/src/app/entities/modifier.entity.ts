// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Column, Entity, PrimaryGeneratedColumn, OneToMany, OneToOne, ManyToMany } from 'typeorm'
import { ProductModifier } from './product-modifier.entity'

@Entity()
export class Modifier {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  price: number

  @Column()
  image: string

  @OneToMany((type) => ProductModifier, (modifier) => modifier.modifier)
  productModifier: Modifier[]
}
