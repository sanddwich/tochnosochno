// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'
import { Product } from '.'

@Entity()
export class Image {
  @PrimaryColumn()
  imageId: string
  @Column({ nullable: true })
  imageUrl: string

  @ManyToOne((type) => Product, (product) => product.images)
  product: Product
}
