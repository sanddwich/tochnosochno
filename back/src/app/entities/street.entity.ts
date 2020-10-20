// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Column, Entity, ManyToMany, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'
import { Address } from './address.entity'

@Entity()
export class Street {
  @PrimaryColumn('varchar', { length: 200 })
  id?: string

  @Column({ nullable: true })
  name?: string

  @Column({ nullable: true })
  externalRevision?: number

  @Column({ nullable: true })
  classifierId?: string

  @Column({ nullable: true })
  isDeleted?: boolean

  @OneToMany((type) => Address, (address) => address.street)
  addresses?: Address[]
}
