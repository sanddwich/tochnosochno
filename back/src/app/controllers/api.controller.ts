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
  HttpResponseSuccess,
} from '@foal/core'
import { getRepository } from 'typeorm'

import { Product, Group, Order, Customer, Address, OrderItem, OrderItemModifier } from '../entities'
import { fetchUser, TypeORMStore } from '@foal/typeorm'
import * as _ from 'lodash'
import { Aiiko, OrderService } from '../services'
import { CsrfTokenRequired } from '@foal/csrf'

@Hook(() => (response) => {
  response.setHeader('Access-Control-Allow-Credentials', 'true')
  response.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
})
export class ApiController {
  @dependency
  orderService: OrderService

  @dependency
  aiiko: Aiiko

  @Options('*')
  options(ctx: Context) {
    const response = new HttpResponseNoContent()
    response.setHeader('Access-Control-Allow-Methods', 'HEAD, GET, POST, PUT, PATCH, DELETE, OPTIONS')
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, csrf-token')

    return response
  }

  @Get('/menu')
  async getMenu() {
    await this.aiiko.getMenu()
    const products = await getRepository(Group).find({
      relations: [
        'products',
        'products.modifiers',
        'products.variants',
        'products.modifiers.modifier',
        'products.facets',
      ],
    })

    return new HttpResponseOK(products)
  }

  @Post('/customer')
  @TokenRequired({
    user: fetchUser(Customer),
    store: TypeORMStore,
  })
  @CsrfTokenRequired()
  async getCustomer(ctx: Context<Customer, Session>) {
    const customer = await getRepository(Customer).findOne(
      { id: ctx.user.id },
      {
        relations: [
          'orders',
          'addresses',
          'orders.address',
          'orders.orderItems',
          'orders.orderItems.productVariant.product',
          'orders.orderItems.productVariant',
          'orders.orderItems.orderItemModifiers',
          'orders.orderItems.orderItemModifiers.productModifier',
          'orders.orderItems.orderItemModifiers.productModifier.modifier',
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
            await repositoryOrderItem.save(orderDb.orderItems)
            order.orderItems.map(async (orderItem) => {
              await repositoryOrderItemModifier.save(orderItem.orderItemModifiers)
            })
          } else {
            return new HttpResponseNotFound({ error: true, message: `Customer with id=${ctx.user.id} not found.` })
          }
        } catch (error) {
          return new HttpResponseNotFound({ error: true, message: error.message })
        }
      }
    }

    return new HttpResponseCreated({ order })
  }

  @Post('/address')
  @TokenRequired({
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
  async addAddress(ctx: Context<Customer, Session>) {
    const addressData: Address = ctx.request.body.address
    console.log(addressData)
    const repositoryAddress = getRepository(Address)
    const customer = await getRepository(Customer).findOne({ id: ctx.user.id })
    if (customer) {
      addressData.customer = customer
    }

    const address = await repositoryAddress.save(addressData)
    return new HttpResponseCreated(address)
  }
}
