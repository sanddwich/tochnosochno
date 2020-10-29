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
  Unique,
} from 'typeorm'
import { ProductModifier } from './product-modifier.entity'
import { Modifier, Group, Image, GroupModifier } from '.'
import { ProductVariant } from './product-variant.entity'
import { Facet } from './facet.entity'
import { Size } from './size.entity'
import { SizePrice } from './size-price.entity'
import { ProductCategory } from './product-category.entity'
import { OrderItem } from './order-item.entity'
import { OrderItemModifier } from './order-item-modifier.entity'
import { FavoriteProduct } from './favorite-product.entity'

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

  @Column({ type: 'float', nullable: true })
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

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date

  @OneToMany((type) => SizePrice, (sizePrice) => sizePrice.product, {
    cascade: true,
  })
  sizePrices: SizePrice[]

  // @OneToMany((type) => ProductModifier, (productModifier) => productModifier.product, { cascade: true })
  // modifiers: ProductModifier[]

  @ManyToMany((type) => ProductModifier, { cascade: true })
  @JoinTable({ name: 'product_modifiers' })
  modifiers: ProductModifier[]

  @OneToMany((type) => ProductVariant, (productVariant) => productVariant.product)
  variants: ProductVariant[]

  @OneToMany((type) => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[]

  @ManyToOne((type) => Group, (group) => group.products, { cascade: true })
  parentGroup: Group

  @OneToMany((type) => Facet, (facet) => facet.product)
  facets: Facet[]

  @OneToMany((type) => Image, (image) => image.product, { cascade: true })
  images: Image[]

  @OneToMany((type) => OrderItemModifier, (orderItemModifier) => orderItemModifier.product)
  orderItemModifiers: OrderItemModifier[]

  @Column('simple-array')
  imageLinks: string[]

  @ManyToOne((type) => ProductCategory, (productCategory) => productCategory.products, { cascade: true })
  productCategory: ProductCategory

  @ManyToMany((type) => GroupModifier, (groupModifier) => groupModifier.products, { cascade: true })
  @JoinTable({ name: 'product_group_modifiers' })
  groupModifiers: GroupModifier[]

  @OneToMany((type) => FavoriteProduct, (favoriteProduct) => favoriteProduct.product)
  favoriteProducts: FavoriteProduct[]

  recomended: string[]
}
