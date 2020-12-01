import { Config, dependency } from '@foal/core'
import { LoggerService } from './logger.service'
const fetch = require('node-fetch')

export class PaymentService {
  @dependency
  logger: LoggerService

  async sendOrderToBank(phone: string, orderNumber: string, amount: string) {
    this.logger.info(`paymnet.service.sendOrderToBank()`)
    const apiUrl = Config.get('bank.apiUrl') || 'https://3dsec.sberbank.ru/payment/rest'
    const userName = Config.get('bank.userName')
    const password = Config.get('bank.password')
    const returnUrl = `${Config.get('host')}/paymentSuccess`
    const failUrl = `${Config.get('host')}/paymentError`
    try {
      const res = await fetch(`${apiUrl}/register.do`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: `userName=${userName}&password=${password}&orderNumber=${orderNumber}&amount=${amount}&phone=${phone}&returnUrl=${returnUrl}&failUrl=${failUrl}`,
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(`${res.status} ${res.statusText}. ${typeof error}. Ошибка на сервере IIKO.`)
      }
      const json = await res.json()
      return json
    } catch (error) {
      this.logger.error(`paymnet.service.sendOrderToBank() `, error)
    }
  }

  async checkOrderPayment(orderId: string) {
    this.logger.info(`paymnet.service.checkOrderPayment()`)
    const apiUrl = Config.get('bank.apiUrl') || 'https://3dsec.sberbank.ru/payment/rest'
    const userName = Config.get('bank.userName')
    const password = Config.get('bank.password')
    try {
      const res = await fetch(`${apiUrl}/getOrderStatusExtended.do`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: `userName=${userName}&password=${password}&orderNumber=${orderId}`,
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(`${res.status} ${res.statusText}. ${typeof error}. Ошибка на сервере сбербанка.`)
      }
      const json = await res.json()
      return json
    } catch (error) {
      this.logger.error(`paymnet.service.checkOrderPayment()`, error)
    }
  }
}
