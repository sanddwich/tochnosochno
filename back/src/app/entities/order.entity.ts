// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToOne, OneToMany, PrimaryColumn } from 'typeorm'
import { Customer } from './customer.entity'
import { Address } from './address.entity'
import { OrderItem } from './order-item.entity'

@Entity()
export class Order {
  @PrimaryColumn('varchar', { length: 200 })
  id: number

  @Column()
  name: string

  @Column()
  date: string

  @Column()
  status: string

  @Column()
  amount: number

  @Column()
  bonus: number

  @Column()
  device: string

  @Column()
  prepareDate: string

  @Column()
  isDelivery: boolean

  @Column()
  isPayment: boolean

  @Column()
  payment: string

  @Column()
  comment: string

  @ManyToOne((type) => Customer, (customer) => customer.orders)
  customer: Customer

  @ManyToOne((type) => Address, (address) => address.orders)
  address: Address

  @OneToMany((type) => OrderItem, (orderItem) => orderItem.order)
  orderItems: OrderItem[]
}
