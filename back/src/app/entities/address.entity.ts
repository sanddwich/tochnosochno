// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm'
import { Customer } from '.'
import { Order } from './order.entity'

@Entity()
export class Address {
  @PrimaryColumn('varchar', { length: 200 })
  id: number

  @Column()
  name: string

  @Column()
  city: string

  @Column()
  street: string

  @Column()
  house: string

  @Column()
  building: string

  @Column()
  apartment: string

  @Column()
  entrance: string

  @Column()
  floor: string

  @Column()
  comment: string

  @ManyToOne((type) => Customer, (customer) => customer.addresses)
  customer: Customer

  @OneToMany((type) => Order, (order) => order.address)
  orders: Order[]
}
