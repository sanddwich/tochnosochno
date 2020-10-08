// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'
import { Terminal } from './terminal.entity'

@Entity()
export class PaymentType {
  @PrimaryColumn('varchar', { length: 200 })
  id: string

  @Column()
  code: string

  @Column()
  name: string

  @Column({ nullable: true })
  comment: string

  @Column()
  combinable: boolean

  @Column()
  externalRevision: number

  @Column()
  isDeleted: boolean

  @Column()
  printCheque: boolean

  @Column()
  paymentProcessingType: string

  @Column()
  paymentTypeKind: string

  @ManyToMany((type) => Terminal)
  @JoinTable()
  terminalGroups: Terminal[]
}
