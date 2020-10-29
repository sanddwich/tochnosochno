import { Group, Product } from '../entities'

export class MenuService {
  getRecomendedProducts(product: Product, groups: Group[], count: number): string[] {
    let i
    const recomendedProducts: string[] = []
    for (i = 1; i <= count; i++) {
      const randomGroup = groups[Math.floor(Math.random() * groups.length)]
      const randomProduct = randomGroup.products[Math.floor(Math.random() * randomGroup.products.length)]
      //   console.log(ra)
      //   if (randomProduct.id != product.id) {
      //     recomendedProducts.push(randomProduct)
      //   }
      if (randomProduct) {
        recomendedProducts.push(randomProduct.id)
      } else {
        i--
      }
    }
    return recomendedProducts
  }
}
