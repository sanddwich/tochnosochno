// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { Order } from '.'
import { Address } from './address.entity'

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  phone: string

  @Column()
  email: string

  @Column()
  bonus: number

  @Column()
  name: string

  @OneToMany((type) => Order, (order) => order.customer)
  orders: Order[]

  @OneToMany((type) => Address, (address) => address.customer)
  addresses: Address[]
}
