// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'
import { Customer } from './customer.entity'

@Entity()
export class Card {
  @PrimaryColumn('varchar', { length: 200 })
  id: string

  @Column({ nullable: true })
  track: string

  @Column({ nullable: true })
  number: string

  @Column({ nullable: true })
  validToDate: string

  @ManyToOne((type) => Customer, (customer) => customer.cards)
  customer: Customer
}
