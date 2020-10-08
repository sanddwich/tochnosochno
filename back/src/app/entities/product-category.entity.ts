// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class ProductCategory {
  @PrimaryColumn('varchar', { length: 200 })
  id: string

  @Column()
  name: string
}
