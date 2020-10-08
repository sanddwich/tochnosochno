// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Column, Entity, PrimaryGeneratedColumn, OneToMany, PrimaryColumn } from 'typeorm'
import { Order } from '.'
import { Address } from './address.entity'
import { Card } from './card.entity'
import { WalletBalance } from './wallet-balance.entity'

@Entity()
export class Customer {
  @PrimaryColumn('varchar', { length: 200 })
  id: string

  @Column({ unique: true })
  phone: string

  @Column({ nullable: true })
  email: string

  @Column({ nullable: true })
  referrerId: string

  @Column({ nullable: true })
  bonus: number

  @Column({ nullable: true })
  name: string

  @Column({ nullable: true })
  surname: string

  @Column({ nullable: true })
  middleName: string

  @Column({ nullable: true })
  comment: string

  @Column({ nullable: true })
  cultureName: string

  @Column({ nullable: true })
  birthday: string

  @Column({ nullable: true })
  sex: number

  @Column({ nullable: true })
  consentStatus: number

  @Column({ nullable: true })
  anonymized: boolean

  @OneToMany((type) => Order, (order) => order.customer)
  orders: Order[]

  @OneToMany((type) => Address, (address) => address.customer)
  addresses: Address[]

  @OneToMany((type) => WalletBalance, (walletBalance) => walletBalance.customer, { cascade: true })
  walletBalances: WalletBalance[]

  @OneToMany((type) => Card, (card) => card.customer, { cascade: true })
  cards: Card[]
}
