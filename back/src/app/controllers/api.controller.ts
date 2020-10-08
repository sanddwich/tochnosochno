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
} from '@foal/core'
import { FindManyOptions, getRepository, Like } from 'typeorm'

import { Product, Group, Order, Customer, Address, OrderItem, OrderItemModifier, Terminal, Street } from '../entities'
import { fetchUser, TypeORMStore } from '@foal/typeorm'
import * as _ from 'lodash'
import { GeoCoder, Iiko, OrderService } from '../services'
import { CsrfTokenRequired } from '@foal/csrf'
import { ApiInfo } from '@foal/core'
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
  response.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
})
export class ApiController {
  @dependency
  geoCoder: GeoCoder

  @dependency
  orderService: OrderService

  @dependency
  iiko: Iiko

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
    const products = await getRepository(Group).find({
      relations: [
        'products',
        'products.modifiers',
        'products.variants',
        'products.modifiers.modifier',
        'products.facets',
      ],
    })

    const terminals = await getRepository(Terminal).find({ isAlive: true })

    return new HttpResponseOK({ products, terminals })
  }

  @Post('/customer')
  @TokenRequired({
    openapi: true,
    user: fetchUser(Customer),
    store: TypeORMStore,
  })
  @CsrfTokenRequired()
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
          'addresses.street',
          'orders.address',
          'orders.address.street',
          'orders.items',
          'orders.items.productVariant.product',
          'orders.items.productVariant',
          'orders.items.orderItemModifiers',
          'orders.items.orderItemModifiers.productModifier',
          'orders.items.orderItemModifiers.productModifier.modifier',
        ],
      }
    )
    if (customer) {
      customer.orders = _.orderBy(customer.orders, ['id'], ['desc'])
      customer.addresses = _.orderBy(customer.addresses, ['id'], ['desc'])
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
  @CsrfTokenRequired()
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
    const repositoryOrderItem = getRepository(OrderItem)
    const repositoryOrderItemModifier = getRepository(OrderItemModifier)
    const checkOrder = await this.orderService.checkOrder(order, ctx.user.id)

    if (checkOrder.error) {
      return new HttpResponseNotFound(checkOrder)
    } else {
      if (order.payment === 'online') {
        return new HttpResponseOK(checkOrder)
      }

      if (order.payment === 'cash' || order.payment === 'credit') {
        const customer = await getRepository(Customer).findOne({ id: ctx.user.id })
        try {
          if (customer) {
            order.customer = customer
            const orderDb = await repositoryOrder.save(order)
            await repositoryOrderItem.save(orderDb.items)
            order.items.map(async (orderItem) => {
              await repositoryOrderItemModifier.save(orderItem.orderItemModifiers)
            })
          } else {
            return new HttpResponseNotFound({ error: true, message: `Customer with id=${ctx.user.id} not found.` })
          }
        } catch (error) {
          console.log(error)
          return new HttpResponseNotFound({ error: true, message: error.message })
        }
      }
    }

    return new HttpResponseCreated({ order })
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
  @CsrfTokenRequired()
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
  @TokenRequired({
    openapi: true,
    user: fetchUser(Customer),
    store: TypeORMStore,
  })
  @ValidateBody({
    additionalProperties: false,
    properties: {
      street: { type: 'string' },
    },
    required: ['street'],
    type: 'object',
  })
  @CsrfTokenRequired()
  @ApiServer({ url: '/api', description: 'Main API URL' })
  async getStreets(ctx: Context<Customer, Session>) {
    const street: string = ctx.request.body.street
    const streets = await getRepository(Street).find({ where: { name: Like(`%${street}%`) }, order: { name: 'ASC' } })
    return new HttpResponseOK(streets)
  }
}
