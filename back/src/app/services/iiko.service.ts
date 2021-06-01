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
import CardPayment from '../interfaces/Iiko/CardPayment'
import CashPayment from '../interfaces/Iiko/CashPayment'
import DeliveryRestrictionsAllowed from '../interfaces/Iiko/DeliveryRestrictionsAllowed'
import IikoCardPayment from '../interfaces/Iiko/IikoCardPayment'
import IikoCity from '../interfaces/Iiko/IikoCity'
import IIkoErrorResponse from '../interfaces/Iiko/IIkoErrorResponse'
import IikoTerminalGroup from '../interfaces/Iiko/IikoTerminalGroup'
import OrderResponse from '../interfaces/Iiko/OrderResponse'
import IIkoOrder from '../interfaces/IIkoOrder'
import IIkoOrderItem from '../interfaces/IIkoOrderItem'
import IIkoOrderItemModifier from '../interfaces/IIkoOrderItemModifier'
import IIkoOrderItemType from '../interfaces/IIkoOrderItemType'
import OrderServiceType from '../interfaces/OrderServiceType'
import { GeoCoder } from './geo-coder.service'
import { LoggerService } from './logger.service'

import fetch from 'node-fetch'

import downloadImage = require('image-downloader')
import IikoErrorInfo from '../interfaces/Iiko/IikoErrorInfo'
import IikoStreet from '../interfaces/Iiko/IikoStreet'
import TerminalGroup from '../interfaces/Iiko/TerminalGroup'

const API_SERVER = Config.get('iiko.apiUrl')
const IIKO_PASSWORD = Config.get('iiko.iikoPassword')

const TOKEN_URL = `${API_SERVER}/access_token`
const ORGANIZATION_URL = `${API_SERVER}/organizations`
const TERMINALS_URL = `${API_SERVER}/terminal_groups`
const TERMINALS_ALIVE_URL = `${API_SERVER}/terminal_groups/is_alive`
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
  private static instance: Iiko
  private token = ''
  private tokenTimeStamp: number
  private organizations: Organization[]

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

  async checkOrderToIiko(order: Order, terminalGroupId?: Terminal | null) {
    const terminalId = terminalGroupId ? terminalGroupId.toString() : null

    const iikoOrder = await this.formatOrderForIiko(order)

    const body = JSON.stringify({
      organizationId: this.organizations[0].id,
      order: iikoOrder,
      terminalGroupId: terminalId,
      createOrderSettings: {
        transportToFrontTimeout: 30,
      },
    })

    const { errorInfo } = await this.fetchApi<{ errorInfo: IikoErrorInfo }>(CHECK_ORDER_URL, body, true, 'POST')

    return errorInfo
  }

  async sendOrderToIiko(order: Order, terminalGroupId: Terminal) {
    let terminalId = terminalGroupId.toString()
    // const terminalId = 'b3a96b03-75bc-44dd-8fcd-53c5a548a8e9' //Ахматовская
    const terminal = await getRepository(Terminal).findOne(
      { id: terminalId },
      {
        relations: ['organization'],
      }
    )
    console.log({ terminal })
    const organizationId = terminal ? terminal.organization.id : null
    const iikoOrder = await this.formatOrderForIiko(order)
    console.log(organizationId, terminalId)

    if (terminalId === '121b5392-d62c-7611-0165-959330ae00c9' && order.isDelivery) {
      terminalId = this.getTerminalGroupIdByTime(iikoOrder, 540, 1410)
    }

    const body = JSON.stringify({
      organizationId: organizationId,
      order: iikoOrder,
      terminalGroupId: terminalId,
      createOrderSettings: {
        transportToFrontTimeout: 30,
      },
    })

    const { correlationId, orderInfo } = await this.fetchApi<{ correlationId: string; orderInfo: OrderResponse }>(
      // CREATE_ORDER_URL,
      CHECK_ORDER_URL,
      body,
      true,
      'POST'
    )

    return orderInfo
  }

  /*
   * Выгрузка городов из IIKO в БД сайта.
   */
  async setCities() {
    const body = JSON.stringify({ organizationIds: [this.organizations[0].id] })
    const { correlationId, cities } = await this.fetchApi<{ correlationId: string; cities: IikoCity[] }>(
      CITIES_URL,
      body,
      true,
      'POST'
    )

    cities.map(async (city) => {
      await getRepository(City).save(city.items)
    })

    return cities
  }

  /*
   * Выгрузка улиц из IIKO в БД сайта.
   */
  async setStreets() {
    const cities = await getRepository(City).find()

    cities.map(async (city) => {
      const body = JSON.stringify({ organizationId: this.organizations[0].id, cityId: city.id })
      const { correlationId, streets } = await this.fetchApi<{
        correlationId: string
        streets: Street[]
      }>(STREET_URL, body, true, 'POST')
      await getRepository(Street).save(streets)
    })

    return true
  }

  /*
   * Выгрузка терминалов доставки из IIKO в БД сайта.
   */

  async setTerminals() {
    const organizations = await getRepository(Organization).find()
    console.log(organizations)

    organizations.map(async (organization) => {
      const body = JSON.stringify({ organizationIds: [organization.id] })
      const { correlationId, terminalGroups } = await this.fetchApi<{
        correlationId: string
        terminalGroups: IikoTerminalGroup[]
      }>(TERMINALS_URL, body, true, 'POST')

      terminalGroups.map(async (terminalGroup) => {
        await getRepository(Terminal).save(terminalGroup.items)
      })
    })

    return true
  }

  /*
   * Выгрузка доступности терминалов доставки из IIKO .
   */

  async getAliveTerminals(terminalGroupIds: string[]) {
    const body = JSON.stringify({ organizationIds: [this.organizations[0].id], terminalGroupIds })
    const { correlationId, isAliveStatus } = await this.fetchApi<{
      correlationId: string
      isAliveStatus: TerminalGroup[]
    }>(TERMINALS_ALIVE_URL, body, true, 'POST')

    return isAliveStatus
  }

  /*
   * Выгрузка типов оплат из IIKO в БД сайта.
   */

  async setPaymentTypes() {
    const body = JSON.stringify({ organizationIds: [this.organizations[0].id] })
    const { correlationId, paymentTypes } = await this.fetchApi<{ correlationId: string; paymentTypes: PaymentType[] }>(
      PAYMENT_TYPE_URL,
      body,
      true,
      'POST'
    )

    await getRepository(PaymentType).save(paymentTypes)
    return paymentTypes
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
    longitude: number,
    classifierId: string,
    deliveryDate?: string
  ): Promise<DeliveryRestrictionsAllowed | undefined> {
    const deliveryAddress = { streetId, house, classifierId }
    const orderLocation = { latitude, longitude }

    const body = JSON.stringify({
      organizationIds: [this.organizations[0].id],
      deliverySum,
      orderLocation,
      deliveryAddress,
      isCourierDelivery,
      deliveryDate,
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
    // const body = JSON.stringify({ organizationId: this.organizations[0].id })
    const body = JSON.stringify({ organizationId: 'c753337b-ccd2-4c3b-a605-0c8c23c20057' })

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
      const productsReponse = [...products]

      products.map(async (prod: Product) => {
        const productModifiers = prod.modifiers
        const productGroupModifiers = prod.groupModifiers

        prod.groupModifiers = []
        prod.modifiers = []
        prod.price = prod.sizePrices[0].price.currentPrice

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
        prod.groupModifiers = productGroupModifiers
        prod.modifiers = productModifiers
      })

      return [{ groups }, { productsReponse }, revision]
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

  async formatOrderForIiko(order: Order): Promise<IIkoOrder> {
    const iikoOrderItems: IIkoOrderItem[] = []
    let comment = ''
    let deliveryPoint: DeliveryPoint | undefined = undefined
    let orderServiceType: OrderServiceType = 'DeliveryByClient'
    let payments: CashPayment[] | CardPayment[] | IikoCardPayment[] = []

    /*
     * Формируем объекты оплаты для iiko
     */

    if (order.payment === 'cash') {
      comment = 'Оплата наличными'
      const cashPayment = await getRepository(PaymentType).findOne({ paymentTypeKind: 'Cash' })
      if (cashPayment) {
        payments.push({
          paymentTypeKind: 'Cash',
          sum: order.amount - (order.bonus || 0),
          isProcessedExternally: false,
          paymentTypeId: cashPayment.id,
          number: '',
        })
      }
    }

    if (order.payment === 'credit') {
      comment = 'Оплата кредитной картой'
      const onlinePayment = await getRepository(PaymentType).findOne({ paymentTypeKind: 'Card' })
      if (onlinePayment) {
        payments.push({
          paymentTypeKind: 'Card',
          sum: order.amount - (order.bonus || 0),
          isProcessedExternally: false,
          paymentTypeId: onlinePayment.id,
          number: '',
        })
      }
    }

    if (order.payment === 'online') {
      comment = 'Оплата онлайн'
      const onlinePayment = await getRepository(PaymentType).findOne({ paymentTypeKind: 'Card' })
      if (onlinePayment) {
        payments.push({
          paymentTypeKind: 'Card',
          sum: order.amount - (order.bonus || 0),
          isProcessedExternally: true,
          paymentTypeId: onlinePayment.id,
          number: '',
        })
      }
    }

    /*
     * Формируем массив товаров и дополнений к ним
     */

    order.items.map((item: OrderItem) => {
      const iikoOrderItemModifers: IIkoOrderItemModifier[] = []

      item.orderItemModifiers.map((orderItemModifier: OrderItemModifier) => {
        iikoOrderItemModifers.push({
          productId: orderItemModifier.productModifier.id,
          productGroupId: orderItemModifier.productModifier.product.groupId,
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

    /*
     *Формируем объект доставки, если нужна доствка курьера
     */

    if (order.isDelivery && order.address) {
      const street: IikoStreet = {}

      street.classifierId = order.address.street.classifierId

      const { flat, house, floor, building, entrance } = order.address

      deliveryPoint = {
        address: { street, flat, house, floor, building, entrance },
        // coordinates: { latitude: order.address.latitude, longitude: order.address.longitude },
        comment: order.address.comment,
      }
      orderServiceType = 'DeliveryByCourier'
    }

    /*
     *Формируем объект заказа, который отправится в iiko
     */

    if (order.address && order.address.name) {
      order.customer.name = order.address.name
    }

    const iikoOrder: IIkoOrder = {
      phone: order.phone,
      completeBefore: order.completeBefore,
      customer: order.customer,
      comment: `${order.comment}. ${comment}.  ${order.address && order.address.comment ? order.address.comment : ''}`,
      deliveryPoint,
      orderServiceType,
      sourceKey: 'sochno30.ru',
      items: iikoOrderItems,
      payments,
    }

    return iikoOrder
  }

  private async fetchApi<T>(url: string, body: string, auth: boolean, method: string): Promise<T> {
    const res = await fetch(url, {
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

  private getTerminalGroupIdByTime(order: IIkoOrder, startWork: number, endWork: number) {
    let date = new Date()
    if (order.completeBefore) {
      date = new Date(order.completeBefore)
    }

    let completeBeforeHours = date.getHours()
    let completeBeforeMinutes = date.getMinutes()

    const completeBeforeTotalMinutes = completeBeforeHours * 60 + completeBeforeMinutes + 60

    if (completeBeforeTotalMinutes >= startWork && completeBeforeTotalMinutes <= endWork) {
      return 'b3a96b03-75bc-44dd-8fcd-53c5a548a8e9' //Ахматовская
    }

    return '121b5392-d62c-7611-0165-959330ae00c9' //КИрова
  }
}
