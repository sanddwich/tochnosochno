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
  JoinColumn,
  OneToOne,
} from 'typeorm'
import { ProductModifier } from './product-modifier.entity'
import { Modifier, Group, Image } from '.'
import { ProductVariant } from './product-variant.entity'
import { Facet } from './facet.entity'
import { Size } from './size.entity'
import { SizePrice } from './size-price.entity'
import { ProductCategory } from './product-category.entity'

@Entity()
export class Product {
  @PrimaryColumn('varchar', { length: 200 })
  id: string

  @Column()
  name: string

  @Column()
  code: string

  @Column({ nullable: true })
  description: string

  @Column({ nullable: true })
  additionalInfo: string

  @Column({ nullable: true })
  seoDescription: string

  @Column({ nullable: true })
  seoKeywords: string

  @Column({ nullable: true })
  seoText: string

  @Column({ nullable: true })
  seoTitle: string

  @Column({ nullable: true })
  fullNameEnglish: string

  @Column({ nullable: true })
  isDeleted: boolean

  @Column({ nullable: true })
  image: string

  @Column({ nullable: true })
  ingredients: string

  @Column({ nullable: true })
  weight: number

  @Column({ nullable: true })
  fatAmount: number

  @Column({ nullable: true })
  proteinsAmount: number

  @Column({ nullable: true })
  carbohydratesAmount: number

  @Column({ nullable: true })
  energyAmount: number

  @Column({ nullable: true })
  fatFullAmount: number

  @Column({ nullable: true })
  proteinsFullAmount: number

  @Column({ nullable: true })
  carbohydratesFullAmount: number

  @Column({ nullable: true })
  energyFullAmount: number

  @Column({ nullable: true })
  groupId: string

  @Column({ nullable: true })
  type: string

  @Column({ nullable: true })
  productCategoryId: string

  @Column({ nullable: true })
  order: number

  @Column({ nullable: true })
  orderItemType: string

  @Column({ nullable: true })
  modifierSchemaName: string

  @Column({ nullable: true })
  doNotPrintInCheque: boolean

  @Column({ nullable: true })
  measureUnit: string

  @Column({ nullable: true })
  useBalanceForSell: boolean

  @Column({ nullable: true })
  canSetOpenPrice: boolean

  @OneToMany((type) => SizePrice, (sizePrice) => sizePrice.product)
  sizePrices: SizePrice[]

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

  @OneToOne((type) => ProductCategory)
  @JoinColumn()
  productCategory: ProductCategory

  @JoinTable()
  groupTable: Group
}
