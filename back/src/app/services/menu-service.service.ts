import { getConnection, getRepository, MoreThan, Raw } from 'typeorm'
import { Group, Product } from '../entities'

export class MenuService {
  async getRecomendedProducts(product: Product, count: number, groups?: Group[]) {
    let i
    let recomendedProducts: string[] = []
    if (groups) {
      for (i = 1; i <= count; i++) {
        const randomGroup = groups[Math.floor(Math.random() * groups.length)]
        const randomProduct = randomGroup.products[Math.floor(Math.random() * randomGroup.products.length)]

        if (
          randomProduct &&
          randomProduct.id != product.id &&
          randomProduct.type === 'Dish' &&
          !randomGroup.isCombo &&
          !randomGroup.isService &&
          randomProduct.price > 200
        ) {
          recomendedProducts.push(randomProduct.id)
        } else {
          i--
        }
      }
    } else {
      const randomProducts = await getConnection()
        .getRepository(Product)
        .createQueryBuilder('product')
        .orderBy('RAND()')
        .limit(count)
        .where('`price` > 200')
        .andWhere('`isDeleted = false`')
        .getMany()

      randomProducts.map((product) => {
        recomendedProducts.push(product.id)
      })
    }

    return recomendedProducts
  }
}
