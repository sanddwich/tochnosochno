// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class PinCode {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  phone: string

  @Column()
  pinCode: number

  @Column()
  expiresIn: Date
}
