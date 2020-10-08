// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'
import { Customer } from './customer.entity'

@Entity()
export class WalletBalance {
  @PrimaryColumn('varchar', { length: 200 })
  id: string

  @Column({ nullable: true })
  name: string

  @Column({ nullable: true })
  type: number

  @Column({ nullable: true })
  balance: number

  @ManyToOne((type) => Customer, (customer) => customer.walletBalances)
  customer: Customer
}
