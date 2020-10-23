// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Column, Entity, PrimaryGeneratedColumn, OneToMany, PrimaryColumn } from 'typeorm'
import { FavoriteProduct, Order } from '.'
import { Address } from './address.entity'
import { Card } from './card.entity'
import { WalletBalance } from './wallet-balance.entity'

@Entity()
export class Customer {
  @Column()
  id: string

  @PrimaryColumn()
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

  @OneToMany((type) => WalletBalance, (walletBalance) => walletBalance.customer)
  walletBalances: WalletBalance[]

  @OneToMany((type) => Card, (card) => card.customer)
  cards: Card[]

  @OneToMany((type) => FavoriteProduct, (favoriteProduct) => favoriteProduct.customer, {
    cascade: ['insert', 'update'],
  })
  favoriteProducts: FavoriteProduct[]
}
