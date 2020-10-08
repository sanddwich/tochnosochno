import { Config, dependency, HttpResponseBadRequest } from '@foal/core'
import { getRepository } from 'typeorm'
import {
  Group,
  Product,
  ProductVariant,
  Image,
  Customer,
  Order,
  City,
  Street,
  PaymentType,
  OrderItem,
} from '../entities'
import { Organization } from '../entities/organization.entity'
import DeliveryPoint from '../interfaces/DeliveryPoint'
import IIkoOrder from '../interfaces/IIkoOrder'
import IIkoOrderItem from '../interfaces/IIkoOrderItem'
import IIkoOrderItemType from '../interfaces/IIkoOrderItemType'
import { LoggerService } from './logger.service'

const fetch = require('node-fetch')

interface Menu {
  groups: Group[]
  products: Product[]
  revision: number
}

export class Iiko {
  @dependency
  logger: LoggerService

  private readonly apiServer = Config.get('iiko.apiUrl')
  private readonly iikoUser = Config.get('iiko.iikoUser')
  private readonly iikoPassword = Config.get('iiko.iikoPassword')

  private token = ''
  private tokenTimeStamp: number
  private organizations: Organization[]

  private tokenUrl = `${this.apiServer}/access_token`
  private organizationUrl = `${this.apiServer}/organizations`
  private terminalsUrl = `${this.apiServer}/terminal_groups`
  private paymnetTypeUrl = `${this.apiServer}/payment_types`
  private streetUrl = `${this.apiServer}/streets/by_city`
  private createOrderUrl = `${this.apiServer}/deliveries/create`
  private customerUrl = `${this.apiServer}/loyalty/iiko/customers/get_customer`
  private menuUrl = `${this.apiServer}/nomenclature`

  public async init() {
    const tokenAge = (Date.now() - this.tokenTimeStamp) / 60000
    if (!this.token || tokenAge > 20) {
      await this.getToken()
      await this.getOrganization()
    }
  }

  async sendOrderToIiko(order: Order, terminalGroupId?: string | null) {
    const organization = await getRepository(Organization).findOne()

    const iikoOrder: IIkoOrder = this.formatOrderForIiko(order)
    return iikoOrder

    // const city = await getRepository(City).findOne({ name: 'Астрахань' })
    // if (city && organization) {
    //   const res = await fetch(this.createOrderUrl, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       Authorization: `Bearer ${this.token}`,
    //     },
    //     body: JSON.stringify({ organizationId: organization.id, terminalGroupId, order }),
    //   })

    //   const iikoOrder = await res.json()
    // }
  }

  async setStreets() {
    this.logger.info(`iiko.service.setStreets()`)
    const organization = await getRepository(Organization).findOne()
    const city = await getRepository(City).findOne({ name: 'Астрахань' })

    try {
      if (city && organization) {
        const res = await fetch(this.streetUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`,
          },
          body: JSON.stringify({ organizationId: organization.id, cityId: city.id }),
        })

        const { streets } = await res.json()
        streets.map(async (street: Street) => {
          await getRepository(Street).save(street)
        })

        return true
      } else {
        return new HttpResponseBadRequest({ error: true, message: 'Организация не найдена.' })
      }
    } catch (error) {
      this.logger.iiko('iiko.service.setStreets()', error)
      this.logger.error(`iiko.service.setStreets() ${error}`)
    }
  }

  async setTerminals() {
    this.logger.info(`iiko.service.setTerminals()`)
    try {
      const res = await fetch(this.terminalsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify({ organizationIds: [this.organizations[0].id] }),
      })
    } catch (error) {
      this.logger.iiko('iiko.service.setTerminals()', error)
      this.logger.error(`iiko.service.setTerminals() ${error}`)
    }
  }

  async getPaymentTypes() {
    this.logger.info(`iiko.service.getPaymentTypes()`)
    try {
      const res = await fetch(this.paymnetTypeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify({ organizationIds: [this.organizations[0].id] }),
      })

      const { paymentTypes } = await res.json()
      await getRepository(PaymentType).save(paymentTypes)
      return paymentTypes
    } catch (error) {
      this.logger.iiko('iiko.service.getPaymentTypes()', error)
      this.logger.error(`iiko.service.getPaymentTypes() ${error}`)
    }
  }

  async getCustomer(phone: string) {
    this.logger.info(`iiko.service.getCustomer()`)
    try {
      const res = await fetch(this.customerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify({ organizationId: this.organizations[0].id, type: 'phone', phone: phone }),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(`${res.status} ${res.statusText}. ${typeof error}. Ошибка на сервере IIKO.`)
      }
      const customer: Customer = await res.json()
      return customer
    } catch (error) {
      this.logger.iiko('iiko.service.getCustomer()', error)
      this.logger.error(`iiko.service.getCustomer() ${error}`)
    }
  }

  async getMenu() {
    this.logger.info(`iiko.service.getMenu()`)

    try {
      const res = await fetch(this.menuUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify({ organizationId: this.organizations[0].id }),
      })

      if (!res.ok) {
        throw new Error(`${res.status} ошибка на сервере IIKO.`)
      }

      const menu: Menu = await res.json()
      return menu

      // const formattedGroups = menu.groups.map((group: Group) => {
      //   group.images = ''
      //   if (group.additionalInfo) {
      //     group.additionalInfo = group.additionalInfo.replace(/"([^"]+(?="))"/g, '$1')
      //   }
      //   group.isIcludedInMenu = true
      //   group.name = group.name.replace(/"([^"]+(?="))"/g, '$1')
      //   return group
      // })

      // const groups = await getRepository(Group).save(formattedGroups)

      // menu.products.map(async (product: Product) => {
      //   if (product.id === '8842b207-1546-483b-945a-5eed6279139d') {
      //     product.id = '8842b207-1546-483b-945a-5eed6279139d' + Math.random().toString()
      //   }
      //   if (product.id === ' 961cbaf2-dee6-4905-a83e-77a0c4385687') {
      //     product.id = ' 961cbaf2-dee6-4905-a83e-77a0c4385687' + Math.random().toString()
      //   }
      //   if (product) product.image = ''
      //   product.name = product.name.replace(/"([^"]+(?="))"/g, '$1')
      //   if (product.images) {
      //     if (product.images.length > 0) {
      //       product.image = product.images[0].imageUrl
      //       await getRepository(Image).save(product.images)
      //     }
      //   }
      //   await getRepository(Product).save(product)
      // })
    } catch (error) {
      this.logger.iiko('iiko.service.getMenu()', error)
      this.logger.error(`iiko.service.getMenu() ${error}`)
    }
  }

  private async getOrganization() {
    this.logger.info(`iiko.service.getOrganization()`)
    const organizations = await getRepository(Organization).find()
    if (organizations) {
      this.organizations = organizations
    } else {
      try {
        const res = await fetch(this.organizationUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`,
          },
          body: JSON.stringify({ organizationIds: null, returnAdditionalInfo: false, includeDisabled: false }),
        })
        if (!res.ok) {
          throw new Error(`${res.status} ошибка на сервере IIKO.`)
        }
        const json = await res.json()
        this.logger.iiko('iiko.service.getToken()', json)
        this.organizations = json.organizations
      } catch (error) {
        this.logger.iiko('iiko.service.getOrganization()', error)
        this.logger.error(`iiko.service.getOrganization() ${error}`)
      }
    }
  }

  private async getToken() {
    this.tokenTimeStamp = Date.now()
    this.logger.info(`iiko.service.getToken()`)
    try {
      const res = await fetch(this.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiLogin: this.iikoPassword }),
      })
      if (!res.ok) {
        throw new Error(`${res.status} ошибка на сервере IIKO.`)
      }
      const json = await res.json()
      this.logger.iiko('iiko.service.getToken()', json)
      this.token = json.token
    } catch (error) {
      this.logger.iiko('iiko.service.getToken()', error)
      this.logger.error(`iiko.service.getToken() ${error}`)
    }
  }

  private formatOrderForIiko(order: Order): IIkoOrder {
    const iikoOrderItems: IIkoOrderItem[] = []
    let comment = ''
    let deliveryPoint: DeliveryPoint = {}

    if (order.payment === 'cash') comment = 'Оплата наличными курьеру'
    if (order.payment === 'credit') comment = 'Оплата кредитной картой курьеру'
    if (order.payment === 'online') comment = 'Оплата онлайн'

    order.items.map((item: OrderItem) => {
      iikoOrderItems.push({
        type: 'Product',
        amount: item.amount,
        productId: 'dsadsd',
      })
    })

    if (order.isDelivery) {
      deliveryPoint = {
        address: order.address,
        coordinates: { latitude: order.address.latitude, longitude: order.address.longitude },
        comment: order.address.comment,
      }
    }

    console.log(order)

    const iikoOrder: IIkoOrder = {
      phone: order.phone,
      completeBefore: order.completeBefore,
      customer: order.customer,
      items: iikoOrderItems,
      comment: comment,
      deliveryPoint: deliveryPoint,
    }

    return iikoOrder
  }
}
