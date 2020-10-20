// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm'
import { Product } from '.'

@Entity()
export class Group {
  @PrimaryColumn('varchar', { length: 200 })
  id: string

  @Column()
  name: string

  @Column({ nullable: true })
  additionalInfo: string

  @Column({ nullable: true })
  description: string

  @Column()
  isDeleted: boolean
  @Column({ nullable: true })
  code: string

  @Column({ nullable: true })
  seoDescription: string

  @Column({ nullable: true })
  seoKeywords: string

  @Column({ nullable: true })
  seoText: string

  @Column({ nullable: true })
  seoTitle: string

  // @Column({ nullable: true })
  // tags: string

  @Column({ nullable: true })
  images: string

  @Column({ nullable: true })
  isIncludedInMenu: boolean

  @Column({ nullable: true })
  isGroupModifier: boolean

  @Column({ nullable: true })
  order: number

  // @ManyToOne((type) => Group, (group) => group.id)
  // parentGroup: Group
  @Column({ nullable: true })
  parentGroup: string

  @OneToMany((type) => Product, (product) => product.parentGroup)
  products: Product[]
}
