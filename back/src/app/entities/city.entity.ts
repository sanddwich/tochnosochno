// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'
import { Street } from './street.entity'

@Entity()
export class City {
  @PrimaryColumn('varchar', { length: 200 })
  id: string

  @Column()
  name: string

  @Column()
  externalRevision: number

  @Column()
  isDeleted: boolean

  @Column()
  classifierId: string

  @Column()
  additionalInfo: string

  @OneToMany((type) => Street, (street) => street.city)
  streets: Street[]
}
