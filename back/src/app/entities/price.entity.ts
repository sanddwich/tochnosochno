// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { SizePrice } from './size-price.entity'

@Entity()
export class Price {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  currentPrice: number

  @Column({ nullable: true })
  nextPrice: number

  @Column({ nullable: true })
  isIncludedInMenu: boolean

  @Column({ nullable: true })
  nextIncludedInMenu: boolean

  @Column({ nullable: true })
  nextDatePrice: string

  @OneToMany((type) => SizePrice, (sizePrice) => sizePrice.price)
  sizePrices: SizePrice[]
}
