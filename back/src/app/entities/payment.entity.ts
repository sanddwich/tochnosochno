// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'
import { Order } from './order.entity'

@Entity()
export class Payment {
  @PrimaryColumn('varchar', { length: 200 })
  paymentTypeId: string

  @Column()
  sum: number

  @Column({ nullable: true })
  isProcessedExternally: boolean

  @ManyToOne((type) => Order, (order) => order.payments)
  order: Order
}
