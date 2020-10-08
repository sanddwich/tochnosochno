// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'

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
}
