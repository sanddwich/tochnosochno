import {
  Context,
  Get,
  HttpResponseOK,
  HttpResponseNotFound,
  TokenRequired,
  Post,
  Session,
  ValidateBody,
  Hook,
  HttpResponseNoContent,
  Options,
  HttpResponseCreated,
  dependency,
  ApiOperation,
  ApiServer,
  ApiRequestBody,
  Config,
  Patch,
  Put,
  HttpResponseBadRequest,
  HttpResponseInternalServerError,
} from '@foal/core'
import { FindManyOptions, getConnection, getRepository, Like } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'
import {
  Product,
  Group,
  Order,
  Customer,
  Address,
  OrderItem,
  OrderItemModifier,
  Terminal,
  Street,
  City,
} from '../entities'
import { fetchUser, TypeORMStore } from '@foal/typeorm'
import * as _ from 'lodash'
import { GeoCoder, Iiko, LoggerService, MenuService, OrderService, PaymentService, SmsService } from '../services'
import getClientIp from '../utils/utils'

@Hook(() => (response) => {
  response.setHeader('Access-Control-Allow-Credentials', 'true')
  response.setHeader('Access-Control-Allow-Origin', Config.get('host'))
})
export class ApiController {
  @dependency
  bank: PaymentService

  @dependency
  geoCoder: GeoCoder

  @dependency
  orderService: OrderService

  @dependency
  iiko: Iiko

  @dependency
  menuService: MenuService

  @dependency
  sender: SmsService

  @dependency
  logger: LoggerService

  @Options('*')
  options(ctx: Context) {
    const response = new HttpResponseNoContent()
    response.setHeader('Access-Control-Allow-Methods', 'HEAD, GET, POST, PUT, PATCH, DELETE, OPTIONS')
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, csrf-token')

    return response
  }

  @Get('/menu')
  async getMenu(ctx: Context) {
    /*
    Время начала обработки запроса. Нужно чтобы считать общее время обработки запроса.
    */
    const startTime = Date.now()

    try {
      let products = await getRepository(Group).find({
        where: {
          isGroupModifier: false,
        },

        relations: [
          'products',
          'products.parentGroup',
          'products.groupModifiers',
          'products.groupModifiers.group',
          'products.groupModifiers.childModifiers',
          'products.groupModifiers.childModifiers.product',
          'products.modifiers',
          'products.modifiers.product',
          'products.modifiers.modifier',
        ],
      })

      products.map((rootGroup) => {
        /*
         * Формирование массива рекомендованных товаров для каждого товара
         */
        rootGroup.products.map(async (product) => {
          if (product) {
            product.recomended = []
            product.recomended.push(...(await this.menuService.getRecomendedProducts(product, 3, products)))
          }
        })

        /*
         * Добавление товаров из подкатегорий в корневую категорию
         */
        if (!rootGroup.parentGroup) {
          products.map((group) => {
            if (group.parentGroup === rootGroup.id && !group.isCombo) {
              rootGroup.products.push(...group.products)
            }
          })
        }
      })
      products = _.orderBy(products, ['menuOrder'], ['asc'])

      /*
       * Вывод терминалов доставки
       */

      const terminals = await getRepository(Terminal).find({ isAlive: true })

      let recentProducts = await getRepository(Product).find({
        where: {
          type: 'Dish',
          parentGroup: { id: !' ', isService: false },
        },

        order: {
          createdAt: 'DESC',
        },
        take: 5,
        relations: [
          'parentGroup',
          'groupModifiers',
          'groupModifiers.group',
          'groupModifiers.childModifiers',
          'groupModifiers.childModifiers.product',
          'modifiers',
          'modifiers.product',
          'modifiers.modifier',
        ],
      })

      this.logger.info(`${getClientIp(ctx)} - ${ctx.request.method} ${ctx.request.url}  ${Date.now() - startTime} ms`)

      return new HttpResponseOK({ products, terminals, recentProducts })
    } catch (error) {
      this.logger.error(
        `${getClientIp(ctx)} - ${ctx.request.method} ${ctx.request.url}  ${Date.now() - startTime} ms`,
        error
      )
      return new HttpResponseBadRequest(error)
    }
  }

  @Post('/customer')
  @TokenRequired({
    openapi: true,
    user: fetchUser(Customer),
    store: TypeORMStore,
  })
  // @CsrfTokenRequired()
  async getCustomer(ctx: Context<Customer, Session>) {
    /*
    Время начала обработки запроса. Нужно чтобы считать общее время обработки запроса.
    */
    const startTime = Date.now()

    try {
      const customer = await getRepository(Customer).findOne(
        { id: ctx.user.id },

        {
          relations: [
            'orders',
            'favoriteProducts',
            'favoriteProducts.product',
            'orders.terminalId',
            'orders.items',
            'orders.items.product',
            'orders.items.product.parentGroup',
            'orders.items.product.groupModifiers',
            'orders.items.product.groupModifiers.group',
            'orders.items.product.groupModifiers.childModifiers',
            'orders.items.product.groupModifiers.childModifiers.product',
            'orders.items.product.modifiers',
            'orders.items.product.modifiers.product',
            'orders.items.product.modifiers.modifier',
          ],
        }
      )
      if (customer) {
        customer.orders = _.orderBy(customer.orders, ['id'], ['desc'])
        customer.addresses = _.orderBy(customer.addresses, ['id'], ['desc'])

        const groups = await getRepository(Group).find({
          where: {
            isGroupModifier: false,
            // isSiteDisplay: true,
          },
          // relations: ['products', 'products.sizePrices', 'products.sizePrices.price', 'products.parentGroup'],
          relations: ['products', 'products.parentGroup'],
        })

        customer.orders.map((order: Order) => {
          order.items.map(async (orderItem: OrderItem) => {
            orderItem.product.recomended = []
            orderItem.product.recomended.push(
              ...(await this.menuService.getRecomendedProducts(orderItem.product, 3, groups))
            )
          })
        })

        //Если в истории заказов нужны заказы, которые добавились в iiko
        // customer.orders = _.filter(customer.orders, 'orderIikoId')

        const orderIds: string[] = []
        customer.orders.map((order: Order) => {
          if (order.orderIikoId) orderIds.push(order.orderIikoId)
        })
        const iiko = await this.iiko.getInstance()
        const iikoOrders = await iiko.getOrders(orderIds)

        iikoOrders.map((iikoOrder) => {
          customer.orders.map((customerOrder) => {
            if (customerOrder.orderIikoId === iikoOrder.id) {
              if (iikoOrder.order) {
                customerOrder.status = iikoOrder.order.status
              } else {
                customerOrder.status = iikoOrder.creationStatus
              }
            }
          })
        })
      }
      this.logger.info(`${getClientIp(ctx)} - ${ctx.request.method} ${ctx.request.url}  ${Date.now() - startTime} ms`)
      return new HttpResponseOK(customer)
    } catch (error) {
      this.logger.error(
        `${getClientIp(ctx)} - ${ctx.request.method} ${ctx.request.url}  ${Date.now() - startTime} ms`,
        error
      )
      return new HttpResponseBadRequest(error)
    }
  }

  /*
   * Обработка нового заказа
   */

  @Post('/order')
  @TokenRequired({
    openapi: true,
    user: fetchUser(Customer),
    store: TypeORMStore,
  })
  @ValidateBody({
    additionalProperties: false,
    properties: {
      order: { type: 'object' },
    },
    required: ['order'],
    type: 'object',
  })
  // @CsrfTokenRequired()
  async addOrder(ctx: Context<Customer, Session>) {
    /*
    Время начала обработки запроса. Нужно чтобы считать общее время обработки запроса.
    */
    const startTime = Date.now()

    const order: Order = ctx.request.body.order
    const repositoryOrder = getRepository(Order)

    /*
     * Проверка корректности заказа.
     * Отключил, т.к Iiko сама проверяет заказ на коректность.
     * const checkOrder = await this.orderService.checkOrder(order, ctx.user.id)
     */
    const customer = await getRepository(Customer).findOne({ id: ctx.user.id })

    if (customer) {
      order.customer = customer
    } else {
      this.logger.error(
        `${getClientIp(ctx)} - ${ctx.request.method} ${ctx.request.url}  ${Date.now() - startTime} ms`,
        'Customer not found'
      )
      return new HttpResponseNotFound({ error: true, message: `Customer with id=${ctx.user.id} not found.` })
    }

    try {
      /*
      Онлайн-оплата
      */
      if (order.payment === 'online') {
        /*
        Банку требуется сумма в копейках
        */
        const orderAmount = (order.amount * 100).toString()
        /*
         * Отправляем заказ в банк.
         * Получаем id заказа в банке и ссылку на форму оплаты.
         * Сохраняем заказ в БД.
         * Возращаеи ответ банка с id и ссылкой на оплату.
         */
        const bankResponse = await this.bank.sendOrderToBank(order.phone, order.id, orderAmount)
        order.bankOrderId = bankResponse.orderId
        const orderDb = await repositoryOrder.save(order)
        this.logger.info(`${getClientIp(ctx)} - ${ctx.request.method} ${ctx.request.url}  ${Date.now() - startTime} ms`)
        return new HttpResponseOK(bankResponse)

        /*
         * Оплата курьеру
         */
      } else if (order.payment === 'cash' || order.payment === 'credit') {
        /*
         * Отправляем заказ в Iiko,
         */

        const iiko = await this.iiko.getInstance()

        this.logger.info(
          `${getClientIp(ctx)} - ${ctx.request.method} ${ctx.request.url}  ${
            Date.now() - startTime
          } ms - iikoOrder${JSON.stringify(await iiko.formatOrderForIiko(order))}`
        )
        // const errorInfo = await iiko.checkOrderToIiko(order, order.terminalId)
        // console.log(errorInfo)
        // return
        const iikoOrder = await iiko.sendOrderToIiko(order, order.terminalId)

        /*
         * Произошла ошибка в Iiko при создании заказа
         */

        if (iikoOrder.errorInfo) {
          const { code, message, description } = iikoOrder.errorInfo
          throw new Error(`${code}. ${message}. ${description}`)
        }
        order.orderIikoId = iikoOrder.id

        if (order.address && !order.address.id) {
          order.address.id = uuidv4()
        }
        if (!order.isDelivery) {
          delete order.address
        }

        //Отправка заказа на email
        await this.sender.sendOrderEmail(order)

        await repositoryOrder.save(order)
        this.logger.info(`${getClientIp(ctx)} - ${ctx.request.method} ${ctx.request.url}  ${Date.now() - startTime} ms`)
        return new HttpResponseCreated({ order })
      }
    } catch (error) {
      this.logger.error(
        `${getClientIp(ctx)} - ${ctx.request.method} ${ctx.request.url}  ${Date.now() - startTime} ms`,
        error
      )
      return new HttpResponseInternalServerError({ error: true, message: error.message })
    }
  }

  @Patch('/order')
  @TokenRequired({
    openapi: true,
    user: fetchUser(Customer),
    store: TypeORMStore,
  })
  @ValidateBody({
    additionalProperties: false,
    properties: {
      orderId: { type: 'string' },
      order: { type: 'object' },
      isPayment: { type: 'boolean' },
    },
    required: ['orderId'],
    type: 'object',
  })
  // @CsrfTokenRequired()
  async setOrderPayment(ctx: Context<Customer, Session>) {
    /*
    Время начала обработки запроса. Нужно чтобы считать общее время обработки запроса.
    */
    const startTime = Date.now()

    const orderId: string = ctx.request.body.orderId
    const order: Order = ctx.request.body.order
    const orderRepository = getRepository(Order)
    const orderDb = await orderRepository.findOne({ bankOrderId: orderId })
    const customer = await getRepository(Customer).findOne({ id: ctx.user.id })

    if (customer) {
      order.customer = customer
    } else {
      return new HttpResponseNotFound({ error: true, message: `Customer with id=${ctx.user.id} not found.` })
    }
    try {
      if (orderDb && order.id === orderDb.id) {
        const orderStatus = await this.bank.checkOrderPayment(order.id)

        /*
        Проверка статуса оплаты заказа
         * 0 - заказ зарегистрирован, но не оплачен;
         * 1 - предавторизованная сумма удержана (для двухстадийных платежей);
         * 2 - проведена полная авторизация суммы заказа;
         * 3 - авторизация отменена;
         * 4 - по транзакции была проведена операция возврата;
         * 5 - инициирована авторизация через сервер контроля доступа банка-эмитента;
         * 6 - авторизация отклонена
         */

        if (orderStatus.orderStatus === 2) {
          order.isPayment = true
        }

        /*
         * Отправляем заказ в Iiko,
         */
        const iiko = await this.iiko.getInstance()
        const iikoOrder = await iiko.sendOrderToIiko(order, order.terminalId)

        /*
         * Произошла ошибка в Iiko при создании заказа
         */

        if (iikoOrder.errorInfo) {
          const { code, message, description } = iikoOrder.errorInfo
          throw new Error(`${code}. ${message}. ${description}`)
        }
        order.orderIikoId = iikoOrder.id
        const orderDb = await orderRepository.save(order)
      } else {
        return new HttpResponseNotFound({ error: true, message: 'Заказ не найден.' })
      }
    } catch (error) {
      this.logger.error(
        `${getClientIp(ctx)} - ${ctx.request.method} ${ctx.request.url}  ${Date.now() - startTime} ms`,
        error
      )
      return new HttpResponseBadRequest({ error: true, message: error.message })
    }

    this.logger.info(`${getClientIp(ctx)} - ${ctx.request.method} ${ctx.request.url}  ${Date.now() - startTime} ms`)
    return new HttpResponseOK(orderId)
  }

  /*
   *Добавление нового адреса клиента
   */

  @Post('/address')
  @TokenRequired({
    openapi: true,
    user: fetchUser(Customer),
    store: TypeORMStore,
  })
  @ValidateBody({
    additionalProperties: false,
    properties: {
      address: { type: 'object' },
    },
    required: ['address'],
    type: 'object',
  })
  // @CsrfTokenRequired()
  @ApiServer({ url: '/api', description: 'Main API URL' })
  async addAddress(ctx: Context<Customer, Session>) {
    /*
    Время начала обработки запроса. Нужно чтобы считать общее время обработки запроса.
    */
    const startTime = Date.now()

    try {
      const addressData: Address = ctx.request.body.address
      const street = await getRepository(Street).findOne({ name: addressData.street.name })
      const repositoryAddress = getRepository(Address)

      const customer = await getRepository(Customer).findOne({ id: ctx.user.id })
      if (customer) {
        addressData.customer = customer
      }

      if (street) {
        const geoData = await this.geoCoder.getCoordinates(addressData)
        addressData.street = street
        if (geoData) {
          addressData.longitude = geoData.longitude
          addressData.latitude = geoData.latitude
        }
      }

      const address = await repositoryAddress.save(addressData)
      this.logger.info(`${getClientIp(ctx)} - ${ctx.request.method} ${ctx.request.url}  ${Date.now() - startTime} ms`)
      return new HttpResponseCreated(address)
    } catch (error) {
      this.logger.error(
        `${getClientIp(ctx)} - ${ctx.request.method} ${ctx.request.url}  ${Date.now() - startTime} ms`,
        error
      )
      return new HttpResponseBadRequest(error)
    }
  }

  @Post('/street')
  // @TokenRequired({
  //   openapi: true,
  //   user: fetchUser(Customer),
  //   store: TypeORMStore,
  // })
  @ValidateBody({
    additionalProperties: false,
    properties: {
      street: { type: 'string' },
    },
    required: ['street'],
    type: 'object',
  })
  // @CsrfTokenRequired()
  @ApiServer({ url: '/api', description: 'Main API URL' })
  async getStreets(ctx: Context<Customer, Session>) {
    const street: string = ctx.request.body.street
    const streets = await getRepository(Street).find({
      where: { name: Like(`%${street}%`) },
      order: { name: 'ASC' },
      relations: ['city'],
    })
    return new HttpResponseOK(streets)
  }

  @Post('/city')
  // @TokenRequired({
  //   openapi: true,
  //   user: fetchUser(Customer),
  //   store: TypeORMStore,
  // })
  @ValidateBody({
    additionalProperties: false,
    properties: {
      city: { type: 'string' },
    },
    required: ['city'],
    type: 'object',
  })
  // @CsrfTokenRequired()
  @ApiServer({ url: '/api', description: 'Main API URL' })
  async getCities(ctx: Context<Customer, Session>) {
    const city: string = ctx.request.body.city
    const cities = await getRepository(City).find({
      where: { name: Like(`%${city}%`), isDeleted: false },
      order: { name: 'ASC' },
    })
    return new HttpResponseOK(cities)
  }

  @Post('/cities')
  async getAllCities(ctx: Context<Customer, Session>) {
    const cities = await getRepository(City).find({ where: { isDeleted: false }, order: { classifierId: 'ASC' } })
    return new HttpResponseOK(cities)
  }

  @Post('/streetsbycity')
  @ValidateBody({
    additionalProperties: false,
    properties: {
      cityId: { type: 'string' },
      street: { type: 'string' },
    },
    required: ['cityId', 'street'],
    type: 'object',
  })
  @ApiServer({ url: '/api', description: 'Main API URL' })
  async getStreetsByCity(ctx: Context<Customer, Session>) {
    const cityId: string = ctx.request.body.cityId
    const street: string = ctx.request.body.street

    const city = await getRepository(City).findOne({ id: cityId })

    const streets = await getRepository(Street).find({
      where: { isDeleted: false, city, name: Like(`%${street}%`) },
      order: { classifierId: 'ASC' },
    })
    return new HttpResponseOK(streets)
  }

  /*
Геокодирование
*/

  @Post('/geo')
  @ValidateBody({
    additionalProperties: false,
    properties: {
      coordinates: { type: 'array' },
    },
    required: ['coordinates'],
    type: 'object',
  })
  @ApiServer({ url: '/api', description: 'Main API URL' })
  async getGeoLocation(ctx: Context<Customer, Session>) {
    const coordinates: number[] = ctx.request.body.coordinates

    const address = await this.geoCoder.getDaDataGeo(coordinates)

    return new HttpResponseOK(address)
  }

  /*
Получение ограничений доставки
*/

  @Post('/delivery')
  @ValidateBody({
    additionalProperties: false,
    properties: {
      streetId: { type: 'string' },
      house: { type: 'string' },
      deliverySum: { type: 'number' },
      longitude: { type: 'number' },
      latitude: { type: 'number' },
      isCourierDelivery: { type: 'boolean' },
      deliveryDate: { type: 'string' },
      classifierId: { type: 'string' },
    },
    required: ['deliverySum', 'house', 'isCourierDelivery', 'longitude', 'latitude', 'deliveryDate', 'classifierId'],
    type: 'object',
  })
  @ApiServer({ url: '/api', description: 'Main API URL' })
  async getDeliveryRestirctions(ctx: Context<Customer, Session>) {
    /*
    Время начала обработки запроса. Нужно чтобы считать общее время обработки запроса.
    */
    const startTime = Date.now()

    const streetId: string = ctx.request.body.streetId
    const deliverySum: number = ctx.request.body.deliverySum
    const house: string = ctx.request.body.house
    const isCourierDelivery: boolean = ctx.request.body.isCourierDelivery
    const latitude: number = ctx.request.body.latitude
    const longitude: number = ctx.request.body.longitude
    const classifierId: string = ctx.request.body.classifierId
    const deliveryDate: string = ctx.request.body.deliveryDate
    try {
      const iiko = await this.iiko.getInstance()
      const deliveryRestriction = await iiko.getDeliveryRestirctions(
        streetId,
        house,
        deliverySum,
        isCourierDelivery,
        latitude,
        longitude,
        classifierId
        // deliveryDate
      )
      this.logger.info(`${getClientIp(ctx)} - ${ctx.request.method} ${ctx.request.url}  ${Date.now() - startTime} ms`)
      if (deliveryRestriction && !deliveryRestriction.errorDescription) {
        return new HttpResponseOK({
          isAllowed: deliveryRestriction.isAllowed,
          allowedItems: deliveryRestriction.allowedItems,
          location: deliveryRestriction.location,
        })
      } else {
        return new HttpResponseInternalServerError({ error: true, message: 'Ошибка на сервере. Поробуйте ещё раз.' })
      }
    } catch (error) {
      this.logger.error(
        `${getClientIp(ctx)} - ${ctx.request.method} ${ctx.request.url}  ${Date.now() - startTime} ms`,
        error
      )
      return new HttpResponseInternalServerError('Iiko error')
    }
  }
  @Post('/group')
  @ValidateBody({
    additionalProperties: false,
    properties: {
      groupId: { type: 'string' },
    },
    required: ['groupId'],
    type: 'object',
  })
  async getGroupProducts(ctx: Context) {
    /*
    Время начала обработки запроса. Нужно чтобы считать общее время обработки запроса.
    */
    const startTime = Date.now()

    const groupId = ctx.request.body.groupId

    try {
      let group = await getRepository(Group).findOne({
        where: {
          isGroupModifier: false,
          id: groupId,
        },
        relations: [
          'products',

          'products.parentGroup',
          'products.groupModifiers',
          'products.groupModifiers.group',
          'products.groupModifiers.childModifiers',
          'products.groupModifiers.childModifiers.product',
          'products.modifiers',
          'products.modifiers.modifier',
          'products.modifiers.product',
        ],
      })
      /*
       * Добавление товаров из подкатегорий в корневую категорию
       */
      if (group && group.products && group.products.length === 0) {
        let childGroups = await getRepository(Group).find({
          where: {
            isGroupModifier: false,
            parentGroup: groupId,
          },
          relations: [
            'products',

            'products.parentGroup',
            'products.groupModifiers',
            'products.groupModifiers.group',
            'products.groupModifiers.childModifiers',
            'products.groupModifiers.childModifiers.product',
            'products.modifiers',
            'products.modifiers.modifier',
            'products.modifiers.product',
          ],
        })

        childGroups.map((childGroup) => {
          if (group && !childGroup.isCombo) {
            group.products.push(...childGroup.products)
          }
        })

        /*
         * Формирование массива рекомендованных товаров для каждого товара
         */
      }
      const recomendedProducts: string[] = []
      const randomProducts = await getConnection()
        .getRepository(Product)
        .createQueryBuilder('product')
        .orderBy('RAND()')
        .limit(3)
        .where('`price` > 200')
        .getMany()

      randomProducts.map((product) => {
        recomendedProducts.push(product.id)
      })
      group &&
        group.products.map(async (product) => {
          if (product) {
            product.recomended = []
            product.recomended.push(...recomendedProducts)
          }
        })

      this.logger.info(`${getClientIp(ctx)} - ${ctx.request.method} ${ctx.request.url}  ${Date.now() - startTime} ms`)
      return new HttpResponseOK({ products: group })
    } catch (error) {
      this.logger.error(
        `${getClientIp(ctx)} - ${ctx.request.method} ${ctx.request.url}  ${Date.now() - startTime} ms`,
        error
      )
      return new HttpResponseBadRequest(error)
    }
  }
}
