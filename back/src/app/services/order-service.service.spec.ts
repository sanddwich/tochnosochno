import { createService } from '@foal/core'
import { strictEqual, equal } from 'assert'
import { isFunction, isArray } from 'util'
import { OrderService } from './order-service.service'
import { Customer, Order } from '../entities'
import { Connection, createConnection, getRepository } from 'typeorm'

describe('OrderService', async () => {
  let connection: Connection
  before(async () => {
    connection = await createConnection()
  })

  // Close the database connection after running all the tests whether they succeed or failed.
  after(() => connection.close())
  let order: OrderService

  beforeEach(() => (order = createService(OrderService)))

  describe('has a "checkOrder" method that', () => {
    it('should be a function', () => {
      isFunction(order.checkOrder)
    })
    it('should return error Неверное количество бонусов. Ошибка заказа. ', async () => {
      const repository = getRepository(Customer)
      let error
      let customer = await getRepository(Customer).findOne({ phone: '89608618274' }, { relations: ['addresses'] })
      if (customer) {
        const orderObj: Order = {
          id: 11,
          name: '',
          date: '',
          status: 'new',
          amount: 3000,
          bonus: 300,
          device: 'sdasd',
          prepareDate: 'asd',
          isDelivery: true,
          isPayment: false,
          payment: 'credit',
          comment: 'sdsd',
          customer: customer,
          address: customer.addresses[0],
          orderItems: [],
        }
        error = await order.checkOrder(orderObj, 1)
      }
      equal(error.error, true)
      equal(error.message, 'Неверное количество бонусов. Ошибка заказа.')
    })

    it('should return error Неверная сумма заказа. Повторите свой заказ.', async () => {
      const repository = getRepository(Customer)
      let error
      let customer = await getRepository(Customer).findOne({ phone: '89608618274' }, { relations: ['addresses'] })
      if (customer) {
        const orderObj: Order = {
          id: 11,
          name: '',
          date: '',
          status: 'new',
          amount: 2000,
          bonus: 200,
          device: 'sdasd',
          prepareDate: 'asd',
          isDelivery: true,
          isPayment: false,
          payment: 'credit',
          comment: 'sdsd',
          customer: customer,
          address: customer.addresses[0],
          orderItems: [],
        }
        error = await order.checkOrder(orderObj, 1)
      }
      equal(error.error, true)
      equal(error.message, 'Неверная сумма заказа. Повторите свой заказ.')
    })

    it('should return error Неверная сумма заказа. Повторите свой заказ.', async () => {
      const repository = getRepository(Customer)
      let error
      let customer = await getRepository(Customer).findOne({ phone: '89608618274' }, { relations: ['addresses'] })
      if (customer) {
        const orderObj: Order = {
          id: 11,
          name: '',
          date: '',
          status: 'new',
          amount: 0,
          bonus: 0,
          device: 'sdasd',
          prepareDate: 'asd',
          isDelivery: true,
          isPayment: false,
          payment: 'credit',
          comment: 'sdsd',
          customer: customer,
          address: customer.addresses[0],
          orderItems: [],
        }
        error = await order.checkOrder(orderObj, 1)
      }
      equal(error.error, true)
      equal(error.message, 'Ошибка заказ пустой.')
    })
  })
})
