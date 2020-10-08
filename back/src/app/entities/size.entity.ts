// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'
import { Product } from './product.entity'

@Entity()
export class Size {
  @PrimaryColumn('varchar', { length: 200 })
  id: string
  @Column()
  name: string
}
