import { getRepository } from 'typeorm'
import { Customer, Modifier, Order, OrderItem, OrderItemModifier, ProductVariant } from '../entities'

export class OrderService {
  private error = ''

  async checkOrder(order: Order, customerId: string) {
    const customerRepository = getRepository(Customer)
    const productVariantRepository = getRepository(ProductVariant)
    const modifierRepository = getRepository(Modifier)

    let { items, amount, bonus } = order
    bonus = bonus ? bonus : 0

    let productValue = 0
    let modifiersValue = 0

    const customer = await customerRepository.findOne({ id: customerId })

    if (items.length === 0) {
      this.error = `Ошибка в заказе нет ни одной поизиции.`
      return { error: true, message: this.error }
    }

    if (!customer) {
      this.error = `Клиент не найден в базе данных. Повторите свой заказ.`
      return { error: true, message: this.error }
    } else {
      if (bonus > customer.bonus) {
        this.error = `Неверное количество бонусов. Ошибка заказа.`
        return { error: true, message: this.error }
      }
    }

    await Promise.all(
      items.map(async (orderItem: OrderItem) => {
        const productVariant = await productVariantRepository.findOne({ id: orderItem.productVariant.id })

        if (!productVariant) {
          this.error = `Продукт ${productVariant} не найден в базе данных. Повторите свой заказ.`
          return { error: true, message: this.error }
        } else {
          productValue += productVariant.price * orderItem.amount
        }

        await Promise.all(
          orderItem.orderItemModifiers.map(async (modifier: OrderItemModifier) => {
            const orderModifier = await modifierRepository.findOne({ id: modifier.productModifier.modifier.id })
            if (!orderModifier) {
              this.error = `Топинг ${orderModifier} не найден в базе данных. Повторите свой заказ.`
              return { error: true, message: this.error }
            } else {
              modifiersValue += orderModifier.price * modifier.amount * orderItem.amount
            }
          })
        )
      })
    )

    let orderSum = modifiersValue + productValue - bonus

    if (orderSum !== amount) {
      this.error = `Неверная сумма заказа. Повторите свой заказ.`
      return { error: true, message: this.error }
    }
    return { error: false, message: 'Заказ прошел проверку' }
  }
}
