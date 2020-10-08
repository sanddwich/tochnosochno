// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Column, Entity, ManyToMany, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'
import { Address } from './address.entity'

@Entity()
export class Street {
  @PrimaryColumn('varchar', { length: 200 })
  id: string

  @Column()
  name: string

  @Column()
  externalRevision: number

  @Column({ nullable: true })
  classifierId: string

  @Column()
  isDeleted: boolean

  @OneToMany((type) => Address, (address) => address.street)
  addresses: Address[]
}
