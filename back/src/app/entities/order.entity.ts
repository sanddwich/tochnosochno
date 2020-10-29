// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToOne, OneToMany, PrimaryColumn } from 'typeorm'
import { Customer } from './customer.entity'
import { Address } from './address.entity'
import { OrderItem } from './order-item.entity'
import { Payment } from './payment.entity'
import { Terminal } from './terminal.entity'
import Guests from '../interfaces/Guests'

@Entity()
export class Order {
  @PrimaryColumn('varchar', { length: 200 })
  id: string

  @Column()
  name: string

  @Column()
  completeBefore: string

  @Column()
  phone: string

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

  @Column()
  bankOrderId: string

  @Column()
  orderIikoId: string

  @ManyToOne((type) => Customer, (customer) => customer.orders)
  customer: Customer

  //Чтобы добавлялся новый адрес нужно поставить cascade: true
  @ManyToOne((type) => Address, (address) => address.orders, { cascade: true })
  address: Address

  @OneToMany((type) => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  items: OrderItem[]

  @OneToMany((type) => Payment, (payment) => payment.order)
  payments: Payment[]

  @ManyToOne((type) => Terminal, (terminal) => terminal.orders)
  terminalId: Terminal

  guests: Guests
}
