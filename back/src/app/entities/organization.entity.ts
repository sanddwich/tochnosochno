// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'
import { Terminal } from './terminal.entity'

@Entity()
export class Organization {
  @PrimaryColumn('varchar', { length: 200 })
  id: string
  @Column()
  name: string
  @Column()
  country: string
  @Column()
  restaurantAddress: string
  @Column()
  useUaeAddressingSystem: boolean
  @Column()
  city: string
  @Column()
  delivery_phones: string
  @Column()
  restraunt_phones: string
  @Column()
  area: string
  @Column()
  email: string
  @Column()
  iiko: boolean
  @OneToMany((type) => Terminal, (terminal) => terminal.organization)
  terminals: Terminal[]
}
