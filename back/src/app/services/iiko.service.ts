import { Config, dependency, HttpResponseBadRequest } from '@foal/core'
import { getConnection, getRepository } from 'typeorm'
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
  Size,
  ProductCategory,
  SizePrice,
  OrderItemModifier,
  ProductModifier,
  Terminal,
  GroupModifier,
  Modifier,
} from '../entities'
import { Organization } from '../entities/organization.entity'
import DeliveryPoint from '../interfaces/DeliveryPoint'
import IIkoOrder from '../interfaces/IIkoOrder'
import IIkoOrderItem from '../interfaces/IIkoOrderItem'
import IIkoOrderItemModifier from '../interfaces/IIkoOrderItemModifier'
import IIkoOrderItemType from '../interfaces/IIkoOrderItemType'
import OrderServiceType from '../interfaces/OrderServiceType'
import { GeoCoder } from './geo-coder.service'
import { LoggerService } from './logger.service'

const fetch = require('node-fetch')

interface Menu {
  groups: Group[]
  products: Product[]
  revision: number
  correlationId: string
  sizes: Size[]
  productCategories: ProductCategory[]
}

export class Iiko {
  @dependency
  logger: LoggerService

  @dependency
  geo: GeoCoder

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
  private cityUrl = `${this.apiServer}/cities`
  private streetUrl = `${this.apiServer}/streets/by_city`
  private createOrderUrl = `${this.apiServer}/deliveries/create`
  private customerUrl = `${this.apiServer}/loyalty/iiko/customers/get_customer`
  private menuUrl = `${this.apiServer}/nomenclature`
  private checkOrderUrl = `${this.apiServer}/deliveries/check_create`
  private orderStatusUrl = `${this.apiServer}/deliveries/by_id`

  public async init() {
    const tokenAge = (Date.now() - this.tokenTimeStamp) / 60000
    if (!this.token || tokenAge > 20) {
      await this.getToken()
      await this.getOrganization()
    }
  }

  async checkOrderIiko(order: Order) {
    const organization = await getRepository(Organization).findOne()
    const iikoOrder = this.formatOrderForIiko(order)
    try {
      if (organization) {
        const res = await fetch(this.checkOrderUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`,
          },
          body: JSON.stringify({ organizationId: organization.id, order: iikoOrder }),
        })
        if (!res.ok) {
          const error = await res.json()
          throw new Error(`${res.status} ${res.statusText}. ${error.errorDescription}. Ошибка на сервере IIKO.`)
        }
        const iOrder = await res.json()
        return iOrder
      }
    } catch (error) {
      console.log(error)
    }
  }

  async sendOrderToIiko(order: Order, terminalGroupId?: Terminal | null) {
    // const terminalId = terminalGroupId ? terminalGroupId.toString() : null
    const terminalId = '121b5392-d62c-7611-0165-959330ae00c9'
    const coordinates = await this.geo.getCoordinates(order.address)

    const organization = await getRepository(Organization).findOne()
    const iikoOrder = this.formatOrderForIiko(order)

    if (iikoOrder.deliveryPoint) {
      iikoOrder.deliveryPoint.coordinates = coordinates
    }

    try {
      if (organization) {
        const res = await this.fetch_retry(
          this.createOrderUrl,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.token}`,
              Timeout: 30,
            },
            body: JSON.stringify({
              organizationId: organization.id,
              order: iikoOrder,
              terminalGroupId: terminalId,
              createOrderSettings: {
                transportToFrontTimeout: 30,
              },
            }),
          },
          5
        )
        if (!res.ok) {
          const error = await res.json()
          throw new Error(`${res.status} ${res.statusText}. ${error.errorDescription}. Ошибка на сервере IIKO.`)
        }
        const iOrder = await res.json()
        console.log(iOrder.orderInfo)
        return iOrder
      }
    } catch (error) {
      return { error: true, message: error }
    }
  }

  async setCities() {
    this.logger.info(`iiko.service.setCities()`)
    const organization = await getRepository(Organization).findOne()
    // const city = await getRepository(City).findOne({ name: 'Астрахань' })

    try {
      if (organization) {
        const res = await fetch(this.cityUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`,
          },
          body: JSON.stringify({ organizationIds: [organization.id] }),
        })

        const { cities } = await res.json()
        cities[0].items.map(async (city: City) => {
          await getRepository(City).save(city)
        })

        return true
      } else {
        return new HttpResponseBadRequest({ error: true, message: 'Организация не найдена.' })
      }
    } catch (error) {
      this.logger.iiko('iiko.service.setCities()', error)
      this.logger.error(`iiko.service.setCities() ${error}`)
    }
  }

  async setStreets() {
    this.logger.info(`iiko.service.setStreets()`)
    const organization = await getRepository(Organization).findOne()
    const cities = await getRepository(City).find({ isDeleted: false })

    try {
      if (cities && organization) {
        cities.map(async (city) => {
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
            street.city = city
            await getRepository(Street).save(street)
          })
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
      const resJson = await res.json()
      // await getRepository(Terminal).save(terminals)
      resJson.terminalGroups.map((terminalGroup) => {
        terminalGroup.items.map(async (terminal: Terminal) => {
          terminal.organization = terminalGroup.organizationId
          await getRepository(Terminal).save(terminal)
        })
      })
      return resJson
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

  async getOrders(orderIds: string[]) {
    this.logger.info(`iiko.service.getOrders()`)
    try {
      const res = await fetch(this.orderStatusUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify({ organizationId: this.organizations[0].id, orderIds }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(`${res.status} ${res.statusText}. ${error.errorDescription}. Ошибка на сервере IIKO.`)
      }
      const orders = await res.json()
      return orders
    } catch (error) {
      this.logger.iiko('iiko.service.getOrders()', error)
      this.logger.error(`iiko.service.getOrders() ${error}`)
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
      const connection = getConnection()
      const productRepository = getRepository(Product)
      const sizeRepository = getRepository(Size)
      const menu: Menu = await res.json()
      const groups = await getRepository(Group).save(menu.groups)
      const productCategories = await getRepository(ProductCategory).save(menu.productCategories)
      const sizes = await sizeRepository.save(menu.sizes)

      menu.products.map(async (prod: Product) => {
        const productModifiers = prod.modifiers
        const productGroupModifiers = prod.groupModifiers

        prod.groupModifiers = []
        prod.modifiers = []

        const product = await productRepository.save(prod)
        if (productModifiers.length > 0) {
          productModifiers.map(async (modifier) => {
            await connection
              .createQueryBuilder()
              .insert()
              .into(ProductModifier)
              .values(modifier)
              .orUpdate({ conflict_target: ['id'], overwrite: ['defaultAmount', 'minAmount', 'maxAmount', 'required'] })
              .execute()

            await connection
              .createQueryBuilder()
              .insert()
              .into('product_modifiers')
              .values({ productId: product.id, productModifierId: modifier.id })
              .orUpdate({
                conflict_target: ['productId', 'productModifierId'],
                overwrite: ['productId', 'productModifierId'],
              })
              .execute()
          })
        }

        if (productGroupModifiers.length > 0) {
          productGroupModifiers.map(async (productGroupModifier) => {
            await connection
              .createQueryBuilder()
              .insert()
              .into(GroupModifier)
              .values(productGroupModifier)
              .orUpdate({ conflict_target: ['id'], overwrite: ['defaultAmount', 'minAmount', 'maxAmount', 'required'] })
              .execute()
            await connection
              .createQueryBuilder()
              .insert()
              .into('product_group_modifiers')
              .values({ productId: product.id, groupModifierId: productGroupModifier.id })
              .orUpdate({
                conflict_target: ['productId', 'groupModifierId'],
                overwrite: ['productId', 'groupModifierId'],
              })
              .execute()

            if (productGroupModifier.childModifiers.length > 0) {
              productGroupModifier.childModifiers.map(async (childModifier) => {
                await connection
                  .createQueryBuilder()
                  .insert()
                  .into(Modifier)
                  .values(childModifier)
                  .orUpdate({
                    conflict_target: ['id'],
                    overwrite: ['defaultAmount', 'minAmount', 'maxAmount', 'required'],
                  })
                  .execute()

                await connection
                  .createQueryBuilder()
                  .insert()
                  .into('group_modifier_childModifiers')
                  .values({ modifierId: childModifier.id, groupModifierId: productGroupModifier.id })
                  .orUpdate({
                    conflict_target: [' modifierId', 'groupModifierId'],
                    overwrite: [' modifierId', 'groupModifierId'],
                  })
                  .execute()
              })
            }
          })
        }
      })

      return true
    } catch (error) {
      this.logger.iiko('iiko.service.getMenu()', error)
      this.logger.error(`iiko.service.getMenu() ${error}`)
    }
  }

  private async getDeliveryTerminalGroups() {
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
    let deliveryPoint: DeliveryPoint | undefined = undefined
    let orderServiceType: OrderServiceType = 'DeliveryByClient'

    if (order.payment === 'cash') comment = 'Оплата наличными курьеру'
    if (order.payment === 'credit') comment = 'Оплата кредитной картой курьеру'
    if (order.payment === 'online') comment = 'Оплата онлайн'

    order.items.map((item: OrderItem) => {
      const iikoOrderItemModifers: IIkoOrderItemModifier[] = [
        //БЕЗ ДОПОЛНЕНИЙ ДОЛЖНО БЫТЬ
        // {
        //   productId: '51c9c4b8-2235-480c-ada2-84fed3df300f',
        //   productGroupId: 'a062ac01-a16e-4b11-9398-c873d2b80215',
        //   amount: 1,
        // },
      ]

      item.orderItemModifiers.map((orderItemModifier: OrderItemModifier) => {
        iikoOrderItemModifers.push({
          productId: orderItemModifier.productModifier.id,
          // productGroupId: orderItemModifier.productModifier.product.groupId,
          productGroupId: orderItemModifier.product.groupId,
          amount: orderItemModifier.amount,
        })
      })

      iikoOrderItems.push({
        type: item.product.orderItemType,
        amount: item.amount,
        productId: item.product.id,
        modifiers: iikoOrderItemModifers,
      })
    })

    if (order.isDelivery) {
      const street: Street = {
        id: order.address.street.id,
      }

      order.address.street = street

      deliveryPoint = {
        address: order.address,
        // coordinates: { latitude: order.address.latitude, longitude: order.address.longitude },
        comment: order.address.comment,
      }
      orderServiceType = 'DeliveryByCourier'
    }

    const iikoOrder: IIkoOrder = {
      phone: order.phone,
      completeBefore: order.completeBefore,
      customer: order.customer,

      comment: comment,
      deliveryPoint,
      orderServiceType: orderServiceType,
      sourceKey: 'site',
      items: iikoOrderItems,
    }
    console.log(iikoOrder)
    return iikoOrder
  }

  fetch_retry = async (url, options, n) => {
    try {
      return await fetch(url, options)
    } catch (err) {
      if (n === 1) throw new Error(err)
      return await this.fetch_retry(url, options, n - 1)
    }
  }
}
