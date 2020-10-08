// 3p
import { createConnection } from 'typeorm'
import { Product } from '../app/entities'

export const schema = {
  additionalProperties: false,
  properties: {
    name: { type: 'string' },
    seoDescription: { type: 'string' },
    seoKeywords: { type: 'string' },
    seoText: { type: 'string' },
    seoTitle: { type: 'string' },
  },
  required: [],
  type: 'object',
}

export async function main(args: {
  name: string
  seoDescription: string
  seoKeywords: string
  seoText: string
  seoTitle: string
}) {
  const connection = await createConnection()

  try {
    const product = new Product()
    product.name = args.name
    product.seoDescription = args.seoDescription
    product.seoKeywords = args.seoKeywords
    product.seoText = args.seoText
    product.seoTitle = args.seoTitle
    product.isDeleted = false

    console.log(await connection.manager.save(product))
  } catch (error) {
    console.error(error)
  } finally {
    await connection.close()
  }
}
