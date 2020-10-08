// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Column, Entity, PrimaryGeneratedColumn, OneToMany, OneToOne, ManyToMany, PrimaryColumn } from 'typeorm'
import { ProductModifier } from './product-modifier.entity'

@Entity()
export class Modifier {
  @PrimaryColumn('varchar', { length: 200 })
  id: string

  @Column()
  name: string

  @Column()
  price: number

  @Column()
  image: string

  @OneToMany((type) => ProductModifier, (modifier) => modifier.modifier)
  productModifier: Modifier[]
}
