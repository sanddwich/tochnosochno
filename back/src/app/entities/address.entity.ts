// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm'
import { Customer, Street } from '.'
import { Order } from './order.entity'

@Entity()
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column()
  city: string

  @Column()
  house: string

  @Column()
  building: string

  @Column()
  flat: string

  @Column()
  entrance: string

  @Column()
  floor: string

  @Column()
  comment: string

  @Column()
  latitude: string

  @Column()
  longitude: string

  @ManyToOne((type) => Customer, (customer) => customer.addresses)
  customer: Customer

  @OneToMany((type) => Order, (order) => order.address)
  orders: Order[]

  @ManyToOne((type) => Street, (street) => street.addresses)
  street: Street
}
