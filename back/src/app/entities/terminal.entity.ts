// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'
import { Order } from './order.entity'
import { Organization } from './organization.entity'

@Entity()
export class Terminal {
  @PrimaryColumn('varchar', { length: 200 })
  id: string

  @Column()
  name: string

  @Column()
  address: string

  @Column({ nullable: true })
  latitude: string

  @Column({ nullable: true })
  longitude: string

  @Column()
  isAlive: boolean

  @Column()
  isCheckAlive: boolean

  @ManyToOne((type) => Organization, (organization) => organization.terminals)
  organization: Organization

  @OneToMany((type) => Order, (order) => order.terminalId)
  orders: Order[]
}
