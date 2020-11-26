import { getRepository } from 'typeorm'
import { Group, Product } from '../entities'

export class MenuService {
  getRecomendedProducts(product: Product, groups: Group[], count: number) {
    let i
    const recomendedProducts: string[] = []
    for (i = 1; i <= count; i++) {
      const randomGroup = groups[Math.floor(Math.random() * groups.length)]
      const randomProduct = randomGroup.products[Math.floor(Math.random() * randomGroup.products.length)]

      if (
        randomProduct &&
        randomProduct.id != product.id &&
        randomProduct.type === 'Dish' &&
        !randomGroup.isCombo &&
        !randomGroup.isService &&
        randomProduct.sizePrices[0].price.currentPrice > 200
      ) {
        recomendedProducts.push(randomProduct.id)
      } else {
        i--
      }
    }
    return recomendedProducts
  }
}
