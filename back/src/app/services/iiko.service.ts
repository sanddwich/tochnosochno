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
import DeliveryRestrictionsAllowed from '../interfaces/Iiko/DeliveryRestrictionsAllowed'
import IIkoErrorResponse from '../interfaces/Iiko/IIkoErrorResponse'
import OrderResponse from '../interfaces/Iiko/OrderResponse'
import IIkoOrder from '../interfaces/IIkoOrder'
import IIkoOrderItem from '../interfaces/IIkoOrderItem'
import IIkoOrderItemModifier from '../interfaces/IIkoOrderItemModifier'
import IIkoOrderItemType from '../interfaces/IIkoOrderItemType'
import OrderServiceType from '../interfaces/OrderServiceType'
import { GeoCoder } from './geo-coder.service'
import { LoggerService } from './logger.service'

const fetch = require('node-fetch')

const API_SERVER = Config.get('iiko.apiUrl')
const IIKO_PASSWORD = Config.get('iiko.iikoPassword')

const TOKEN_URL = `${API_SERVER}/access_token`
const ORGANIZATION_URL = `${API_SERVER}/organizations`
const TERMINALS_URL = `${API_SERVER}/terminal_groups`
const PAYMENT_TYPE_URL = `${API_SERVER}/payment_types`
const STREET_URL = `${API_SERVER}/streets/by_city`
const CREATE_ORDER_URL = `${API_SERVER}/deliveries/create`
const CUSTOMER_URL = `${API_SERVER}/loyalty/iiko/get_customer`
const MENU_URL = `${API_SERVER}/nomenclature`
const CHECK_ORDER_URL = `${API_SERVER}/deliveries/check_create`
const ORDER_STATUS_URL = `${API_SERVER}/deliveries/by_id`
const CITIES_URL = `${API_SERVER}/cities`
const DELIVERY_RESTRICTIONS_URL = `${API_SERVER}/delivery_restrictions/allowed`

export class Iiko {
  // private readonly apiServer = Config.get('iiko.apiUrl')
  // private readonly iikoUser = Config.get('iiko.iikoUser')
  // private readonly iikoPassword = Config.get('iiko.iikoPassword')

  private static instance: Iiko
  private token = ''
  private tokenTimeStamp: number
  private organizations: Organization[]

  // private tokenUrl = `${this.apiServer}/access_token`
  // private organizationUrl = `${this.apiServer}/organizations`
  // private terminalsUrl = `${this.apiServer}/terminal_groups`
  // private paymnetTypeUrl = `${this.apiServer}/payment_types`
  // private cityUrl = `${this.apiServer}/cities`
  // private streetUrl = `${this.apiServer}/streets/by_city`
  // private createOrderUrl = `${this.apiServer}/deliveries/create`
  // private customerUrl = `${this.apiServer}/loyalty/iiko/get_customer`
  // private menuUrl = `${this.apiServer}/nomenclature`
  // private checkOrderUrl = `${this.apiServer}/deliveries/check_create`
  // private orderStatusUrl = `${this.apiServer}/deliveries/by_id`
  // private deliveryResctrictionsUrl = `${this.apiServer}/delivery_restrictions/allowed`

  private async init() {
    const tokenAge = (Date.now() - this.tokenTimeStamp) / 60000
    if (!this.token || tokenAge > 20) {
      await this.getToken()
      await this.getOrganization()
    }
  }

  async getInstance(): Promise<Iiko> {
    if (!Iiko.instance) {
      Iiko.instance = new Iiko()
    }
    await Iiko.instance.init()

    return Iiko.instance
  }

  async checkOrderIiko(order: Order) {
    const organization = await getRepository(Organization).findOne()
    const iikoOrder = this.formatOrderForIiko(order)
    try {
      if (organization) {
        const res = await fetch(CHECK_ORDER_URL, {
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

    const organization = await getRepository(Organization).findOne()
    const iikoOrder = this.formatOrderForIiko(order)

    // const coordinates = await this.geo.getCoordinates(order.address)
    // if (iikoOrder.deliveryPoint) {
    //   iikoOrder.deliveryPoint.coordinates = coordinates
    // }

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
    } catch (error) {}
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
    } catch (error) {}
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
    } catch (error) {}
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
    } catch (error) {}
  }

  /*
   *Получение ограничений доставки из IIKO.
   */

  async getDeliveryRestirctions(
    streetId: string,
    house: string,
    deliverySum: number,
    isCourierDelivery: boolean,
    latitude: number,
    longitude: number
  ): Promise<DeliveryRestrictionsAllowed | undefined> {
    const deliveryAddress = { streetId, house }
    const orderLocation = { latitude, longitude }

    const body = JSON.stringify({
      organizationIds: [this.organizations[0].id],
      deliverySum,
      orderLocation,
      deliveryAddress,
      isCourierDelivery,
    })
    const deliveryRestrictions: DeliveryRestrictionsAllowed = await this.fetchApi(
      DELIVERY_RESTRICTIONS_URL,
      body,
      true,
      'POST'
    )
    return deliveryRestrictions
  }

  /*
   *Получение клиента из IIKO.
   */

  async getCustomer(phone: string): Promise<Customer> {
    const body = JSON.stringify({ organizationId: this.organizations[0].id, type: 'phone', phone })
    const customer: Customer = await this.fetchApi(CUSTOMER_URL, body, true, 'POST')

    return customer
  }

  /*
   *Получение статусов заказов из IIKO.
   */

  async getOrders(orderIds: string[]): Promise<OrderResponse[]> {
    const body = JSON.stringify({ organizationId: this.organizations[0].id, orderIds })

    const { correlationId, orders } = await this.fetchApi<{
      correlationId: string
      orders: OrderResponse[]
    }>(ORDER_STATUS_URL, body, true, 'POST')
    return orders
  }

  /*
   *Методы для администрирования
   */

  /*
   * Выгрузка меню из IIKO в базу данных сайта.
   */
  async getMenu() {
    const body = JSON.stringify({ organizationId: this.organizations[0].id })
    const { correlationId, groups, productCategories, products, sizes, revision } = await this.fetchApi<{
      correlationId: string
      groups: Group[]
      productCategories: ProductCategory[]
      products: Product[]
      sizes: Size[]
      revision: number
    }>(MENU_URL, body, true, 'POST')

    try {
      const connection = getConnection()
      const productRepository = getRepository(Product)

      await getRepository(Group).save(groups)
      await getRepository(ProductCategory).save(productCategories)

      products.map(async (prod: Product) => {
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
      throw new Error(error)
    }
  }

  /*
   *Получаем список организаций API IIKO.
   */

  private async getOrganization() {
    /*
     *Получаем список организаций из базы данных.
     *Если в БД нет органзиаций, получаем список от API.
     */
    const organizations = await getRepository(Organization).find()
    if (organizations.length > 0) {
      this.organizations = organizations
    } else {
      const body = JSON.stringify({ returnAdditionalInfo: true })

      const { correlationId, organizations } = await this.fetchApi<{
        correlationId: string
        organizations: Organization[]
      }>(ORGANIZATION_URL, body, true, 'POST')

      this.organizations = organizations
    }
  }

  /*
   *Получаем токен API IIKO.
   */

  private async getToken() {
    this.tokenTimeStamp = Date.now()
    const body = JSON.stringify({ apiLogin: IIKO_PASSWORD })

    const { correlationId, token } = await this.fetchApi<{ correlationId: string; token: string }>(
      TOKEN_URL,
      body,
      false,
      'POST'
    )

    this.token = token
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
      const iikoOrderItemModifers: IIkoOrderItemModifier[] = []

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

  private async fetchApi<T>(url: string, body: string, auth: boolean, method: string): Promise<T> {
    const res: Response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${auth ? `Bearer ${this.token}` : ''}`,
      },
      body,
    })
    if (!res.ok && (res.status === 400 || res.status === 401 || res.status === 500 || res.status === 504)) {
      const error: IIkoErrorResponse = await res.json()
      throw new Error(
        `Error ${res.status}. ${res.statusText}. ${error.errorDescription}. Ошибка на сервере IIKO. ${url} `
      )
    } else if (!res.ok) {
      throw new Error(`Error ${res.status}. ${res.statusText} ${url}`)
    }

    return await res.json()
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
