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
import { FindManyOptions, getRepository, Like } from 'typeorm'
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
import { GeoCoder, Iiko, MenuService, OrderService, PaymentService, SmsService } from '../services'
import { CsrfTokenRequired } from '@foal/csrf'
import { ApiInfo } from '@foal/core'
import { get } from 'https'
@ApiInfo({
  title: 'Food Delivery Site API',
  version: '1.0.0',
  contact: {
    name: 'Denis Mehtahudinov',
    url: 'https://deedesign.ru',
    email: 'denristun@gmail.com',
  },
})
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

  @Options('*')
  options(ctx: Context) {
    const response = new HttpResponseNoContent()
    response.setHeader('Access-Control-Allow-Methods', 'HEAD, GET, POST, PUT, PATCH, DELETE, OPTIONS')
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, csrf-token')

    return response
  }

  @Get('/menu')
  @ApiServer({ url: '/api', description: 'Main API URL' })
  @ApiOperation({
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              items: {
                properties: {
                  name: { type: 'string' },
                  id: { type: 'string' },
                  additionalInfo: { type: 'string' },
                  description: { type: 'string' },
                  isDeleted: { type: 'boolean' },
                  seoDescription: { type: 'string' },
                  seoKeywords: { type: 'string' },
                  seoText: { type: 'string' },
                  seoTitle: { type: 'string' },
                  tags: { type: 'string' },
                  images: { type: 'string' },
                  isIcludedInMenu: { type: 'boolean' },
                  order: { type: 'number' },
                  parentGroup: { type: 'string' },
                  products: {
                    items: {
                      properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        code: { type: 'string' },
                        seoDescription: { type: 'string' },
                        seoKeywords: { type: 'string' },
                        seoText: { type: 'string' },
                        seoTitle: { type: 'string' },
                        isDeleted: { type: 'boolean' },
                        image: { type: 'string' },
                        ingredients: { type: 'string' },
                        weight: { type: 'string' },
                        modifiers: {
                          items: {
                            properties: {
                              id: { type: 'string' },
                              maxAmount: { type: 'number' },
                              minAmount: { type: 'number' },
                              required: { type: 'boolean' },
                              defaultAmount: { type: 'number' },
                              modifier: {
                                properties: {
                                  id: { type: 'string' },
                                  name: { type: 'string' },
                                  price: { type: 'number' },
                                  image: { type: 'string' },
                                },
                                type: 'object',
                              },
                            },
                            type: 'object',
                          },
                          type: 'array',
                        },
                        variants: {
                          items: {
                            properties: {
                              id: { type: 'string' },
                              name: { type: 'string' },
                              size: { type: 'string' },
                              weight: { type: 'string' },
                              price: { type: 'number' },
                            },
                            type: 'object',
                          },
                          type: 'array',
                        },
                        facets: {
                          items: {
                            properties: {
                              id: { type: 'string' },
                              name: { type: 'string' },
                              iamge: { type: 'string' },
                            },
                            type: 'object',
                          },
                          type: 'array',
                        },
                      },
                      type: 'object',
                    },
                    type: 'array',
                  },
                },
                type: 'object',
              },
              type: 'array',
            },
          },
        },
        description: 'Возвращает действующее меню',
      },
    },
    summary: 'Возвращает действующее меню',
  })
  async getMenu() {
    await this.iiko.init()
    await this.iiko.getMenu()
    let products = await getRepository(Group).find({
      where: {
        isGroupModifier: false,
        // isSiteDisplay: true,
      },

      relations: [
        'products',
        'products.sizePrices',
        'products.sizePrices.price',
        'products.parentGroup',
        'products.groupModifiers',
        'products.groupModifiers.group',
        'products.groupModifiers.childModifiers',
        'products.groupModifiers.childModifiers.product',
        'products.groupModifiers.childModifiers.product.sizePrices',
        'products.groupModifiers.childModifiers.product.sizePrices.price',
        'products.modifiers',
        'products.modifiers.product',
        'products.modifiers.modifier',
        'products.variants',
        'products.facets',
      ],
    })

    products.map((rootGroup) => {
      rootGroup.products.map(async (product) => {
        if (product) {
          product.recomended = []
          product.recomended.push(...this.menuService.getRecomendedProducts(product, products, 3))
        }
      })

      if (!rootGroup.parentGroup) {
        products.map((group) => {
          if (group.parentGroup === rootGroup.id && !group.isCombo) {
            rootGroup.products.push(...group.products)
          }
        })
      }
    })
    products = _.orderBy(products, ['order'], ['desc'])
    const terminals = await getRepository(Terminal).find({ isAlive: true })

    return new HttpResponseOK({ products, terminals })
  }

  @Post('/customer')
  @TokenRequired({
    openapi: true,
    user: fetchUser(Customer),
    store: TypeORMStore,
  })
  // @CsrfTokenRequired()
  @ApiOperation({
    servers: [{ url: '/api', description: 'Main API URL' }],
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              properties: {
                id: { type: 'string' },
                phone: { type: 'string' },
                email: { type: 'string' },
                bonus: { type: 'number' },
                name: { type: 'string' },
              },
              type: 'object',
            },
          },
        },
        description: 'Возвращает данные по авторизованному клиенту',
      },
      400: {
        content: {
          'application/json': {
            schema: {
              properties: {
                code: { type: 'string' },
                description: { type: 'string' },
              },
              type: 'object',
            },
          },
        },
        description: 'Authorization header not found.',
      },
      403: {
        content: {
          'text/html': {},
        },
        description: 'Bad csrf token.',
      },
    },
    summary: 'Возвращает данные по авторизованному клиенту',
  })
  async getCustomer(ctx: Context<Customer, Session>) {
    const customer = await getRepository(Customer).findOne(
      { id: ctx.user.id },
      {
        relations: [
          'orders',
          'addresses',
          'favoriteProducts',
          'favoriteProducts.product',
          'favoriteProducts.product.sizePrices',
          'favoriteProducts.product.sizePrices.price',
          'addresses.street',
          'orders.terminalId',
          'orders.address',
          'orders.address.street',
          'orders.items',
          'orders.items.productVariant.product',
          'orders.items.productVariant',
          'orders.items.product',
          'orders.items.product.sizePrices',
          'orders.items.product.sizePrices.price',
          'orders.items.orderItemModifiers',
          'orders.items.orderItemModifiers.productModifier',
          'orders.items.orderItemModifiers.productModifier.product',
          'orders.items.orderItemModifiers.productModifier.product.sizePrices',
          'orders.items.orderItemModifiers.productModifier.product.sizePrices.price',
          'orders.items.orderItemModifiers.productModifier.modifier',
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
        relations: ['products', 'products.sizePrices', 'products.sizePrices.price', 'products.parentGroup'],
      })

      customer.orders.map((order: Order) => {
        order.items.map((orderItem: OrderItem) => {
          orderItem.product.recomended = []
          orderItem.product.recomended.push(...this.menuService.getRecomendedProducts(orderItem.product, groups, 3))
        })
      })

      //Если в истории заказов нужны заказы, которые добавились в iiko
      // customer.orders = _.filter(customer.orders, 'orderIikoId')

      await this.iiko.init()
      const orderIds: string[] = []
      customer.orders.map((order: Order) => {
        if (order.orderIikoId) orderIds.push(order.orderIikoId)
      })
      const iikoOrders = await this.iiko.getOrders(orderIds)

      iikoOrders.orders.map((iikoOrder) => {
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

    return new HttpResponseOK(customer)
  }

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
  @ApiServer({ url: '/api', description: 'Main API URL' })
  @ApiRequestBody({
    required: true,
    content: {
      'application/json': {
        schema: {
          properties: {
            order: { type: 'object' },
          },
        },
      },
    },
  })
  @ApiOperation({
    responses: {
      200: {
        description: 'OK',
      },
    },
    summary: 'Добавление нового заказа клиента',
  })
  async addOrder(ctx: Context<Customer, Session>) {
    const order: Order = ctx.request.body.order
    const repositoryOrder = getRepository(Order)

    if (!order.isDelivery && order.terminalId) {
    }

    // const repositoryOrderItem = getRepository(OrderItem)
    // const repositoryOrderItemModifier = getRepository(OrderItemModifier)

    // Проверка корректности заказа.
    // Отключил, т.к Iiko сама проверяет заказ на коректность.
    // const checkOrder = await this.orderService.checkOrder(order, ctx.user.id)
    const customer = await getRepository(Customer).findOne({ id: ctx.user.id })

    if (customer) {
      order.customer = customer
    } else {
      return new HttpResponseNotFound({ error: true, message: `Customer with id=${ctx.user.id} not found.` })
    }

    try {
      //Если оплата через сбербанк
      if (order.payment === 'online') {
        const orderAmount = (order.amount * 100).toString()
        const bankResponse = await this.bank.sendOrderToBank(order.phone, order.id, orderAmount)
        order.bankOrderId = bankResponse.orderId

        const orderDb = await repositoryOrder.save(order)
        // Отправка в iiko ответ от iiko и отправка заказа в банк
        console.log(bankResponse)
        return new HttpResponseOK(bankResponse)
      } else if (order.payment === 'cash' || order.payment === 'credit') {
        // await this.iiko.init()
        // const iikoOrder = await this.iiko.sendOrderToIiko(order, order.terminalId)
        // if (iikoOrder.error) {
        //   throw new Error(iikoOrder.message)
        // }
        // order.orderIikoId = iikoOrder.orderInfo.id

        if (!order.isDelivery) {
          order.address.id = '1df16367-fc70-4bfc-016b-a8d0a76ce24b'
          order.address.street = { id: '8df16367-fc70-4bfc-016b-a8d0a76ce24b', name: 'Кирова' }
          order.address.house = '27'
        }
        if (!order.address.id) {
          order.address.id = uuidv4()
        }

        const orderDb = await repositoryOrder.save(order)
        await this.sender.sendOrderEmail(order)
      }
    } catch (error) {
      console.log(error)
      return new HttpResponseInternalServerError({ error: true, message: error.message })
    }

    return new HttpResponseCreated({ order })
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
  @ApiServer({ url: '/api', description: 'Main API URL' })
  async setOrderPayment(ctx: Context<Customer, Session>) {
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
        order.isPayment = true
        await this.iiko.init()
        const iikoOrder = await this.iiko.sendOrderToIiko(order, order.terminalId)
        if (iikoOrder.error) {
          throw new Error(iikoOrder.message)
        }
        order.orderIikoId = iikoOrder.orderInfo.id
        const orderDb = await orderRepository.save(order)
      } else {
        return new HttpResponseNotFound({ error: true, message: 'Заказ не найден.' })
      }
    } catch (error) {
      console.log(error)
      return new HttpResponseBadRequest({ error: true, message: error.message })
    }

    return new HttpResponseOK(orderId)
  }

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
    return new HttpResponseCreated(address)
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
  @ApiServer({ url: '/api', description: 'Main API URL' })
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
    },
    required: ['deliverySum', 'house', 'isCourierDelivery', 'longitude', 'latitude'],
    type: 'object',
  })
  @ApiServer({ url: '/api', description: 'Main API URL' })
  async getDeliveryRestirctions(ctx: Context<Customer, Session>) {
    const streetId: string = ctx.request.body.streetId
    const deliverySum: number = ctx.request.body.deliverySum
    const house: string = ctx.request.body.house
    const isCourierDelivery: boolean = ctx.request.body.isCourierDelivery
    const latitude: number = ctx.request.body.latitude
    const longitude: number = ctx.request.body.longitude
    try {
      await this.iiko.init()
      const deliveryRestriction = await this.iiko.getDeliveryRestirctions(
        streetId,
        house,
        deliverySum,
        isCourierDelivery,
        latitude,
        longitude
      )

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
      return new HttpResponseInternalServerError('Iiko error')
    }
  }
}
