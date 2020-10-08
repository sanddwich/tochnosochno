// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm'
import { ProductModifier } from './product-modifier.entity'
import { Modifier, Group, Image } from '.'
import { ProductVariant } from './product-variant.entity'
import { Facet } from './facet.entity'

@Entity()
export class Product {
  @PrimaryColumn()
  id: string

  @Column()
  name: string

  @Column()
  code: string

  @Column({ nullable: true })
  seoDescription: string

  @Column({ nullable: true })
  seoKeywords: string

  @Column({ nullable: true })
  seoText: string

  @Column({ nullable: true })
  seoTitle: string

  @Column({ nullable: true })
  isDeleted: boolean

  @Column({ nullable: true })
  image: string

  @Column({ nullable: true })
  ingredients: string

  @Column({ nullable: true })
  weight: string

  @OneToMany((type) => ProductModifier, (productModifier) => productModifier.product)
  modifiers: ProductModifier[]

  @OneToMany((type) => ProductVariant, (productVariant) => productVariant.product)
  variants: ProductVariant[]

  @ManyToOne((type) => Group, (group) => group.products)
  parentGroup: Group

  @OneToMany((type) => Facet, (facet) => facet.product)
  facets: Facet[]

  @OneToMany((type) => Image, (image) => image.product)
  images: Image[]

  @JoinTable()
  groupTable: Group
}
