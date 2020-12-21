import {
  Context,
  dependency,
  Post,
  removeSessionCookie,
  Session,
  TokenRequired,
  ValidateBody,
  HttpResponseOK,
  HttpResponseNotFound,
  Hook,
  Options,
  HttpResponseNoContent,
  setSessionCookie,
  ApiInfo,
  HttpResponseBadRequest,
  Config,
  Patch,
  Delete,
} from '@foal/core'
import { CsrfTokenRequired, getCsrfToken, setCsrfCookie } from '@foal/csrf'
import { TypeORMStore, fetchUser } from '@foal/typeorm'
import { getRepository } from 'typeorm'

import { Customer, FavoriteProduct, Group, Order, OrderItem, Product } from '../entities'
import { WalletBalance } from '../entities/wallet-balance.entity'
import { Iiko, CustomerService, SmsService, MenuService, LoggerService } from '../services'
import { v4 as uuidv4 } from 'uuid'
import * as _ from 'lodash'
import getClientIp from '../utils/utils'

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
export class AuthController {
  @dependency
  store: TypeORMStore

  @dependency
  iiko: Iiko

  @dependency
  logger: LoggerService

  @dependency
  sms: SmsService

  @dependency
  customerService: CustomerService

  @dependency
  menuService: MenuService

  @Options('*')
  options(ctx: Context) {
    const response = new HttpResponseNoContent()
    response.setHeader('Access-Control-Allow-Origin', '*')
    response.setHeader('Access-Control-Allow-Methods', 'HEAD, GET, POST, PUT, PATCH, DELETE')
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, csrf-token')
    return response
  }

  @Post('/login')
  @ValidateBody({
    additionalProperties: false,
    properties: {
      phone: { type: 'string' },
    },
    required: ['phone'],
    type: 'object',
  })
  async login(ctx: Context) {
    /*
    Время начала обработки запроса. Нужно чтобы считать общее время обработки запроса.
    */
    const startTime = Date.now()

    try {
      const phone = ctx.request.body.phone

      const pinCode = await this.sms.createCode(phone)

      if (pinCode.error) {
        return new HttpResponseNotFound(pinCode)
      }

      return new HttpResponseOK(pinCode)
    } catch (error) {
      this.logger.error(
        `${getClientIp(ctx)} - ${ctx.request.method} ${ctx.request.url}  ${Date.now() - startTime} ms`,
        error
      )
      return new HttpResponseBadRequest(error)
    }
  }

  @Post('/auth')
  @ValidateBody({
    additionalProperties: false,
    properties: {
      code: { type: 'string' },
      phone: { type: 'string' },
    },
    required: ['code', 'phone'],
    type: 'object',
  })
  async auth(ctx: Context) {
    /*
    Время начала обработки запроса. Нужно чтобы считать общее время обработки запроса.
    */
    const startTime = Date.now()

    try {
      let customer: Customer | undefined
      let { code, phone } = ctx.request.body

      const repositoryCustomer = getRepository(Customer)
      const repositoryWalletBalance = getRepository(WalletBalance)

      const isCodeCorrect = await this.sms.verifyCode(phone, code)
      // const isCodeCorrect = true

      if (!isCodeCorrect) {
        return new HttpResponseNotFound({ error: true, message: 'Введите коректный код' })
      }

      phone = phone.replace(/^\8/, '+7')

      // const iiko = await this.iiko.getInstance()
      // let iikoCustomer = await iiko.getCustomer(phone)

      // if (iikoCustomer) iikoCustomer = this.customerService.setBonuses(iikoCustomer)
      // if (iikoCustomer && iikoCustomer.id) {
      //   await repositoryCustomer.save(iikoCustomer)
      // } else {

      customer = await repositoryCustomer.findOne(
        { phone: phone },
        {
          relations: [
            'orders',
            'favoriteProducts',
            'favoriteProducts.product',
            'orders.items.product.parentGroup',
            'favoriteProducts.product.groupModifiers',
            'favoriteProducts.product.groupModifiers.group',
            'favoriteProducts.product.groupModifiers.childModifiers',
            'favoriteProducts.product.groupModifiers.childModifiers.product',
            'favoriteProducts.product.modifiers',
            'favoriteProducts.product.modifiers.product',
            'favoriteProducts.product.modifiers.modifier',
            'orders.terminalId',
            'orders.items',
            'orders.items.product',
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

      if (!customer) {
        customer = new Customer()
        customer.phone = phone
        customer.id = uuidv4()
        customer.addresses = []
        customer.orders = []
        customer.favoriteProducts = []
        customer.name = 'Ваше имя'
        customer = await repositoryCustomer.save(customer)
      }

      //Создаём сессию для пользователя и отправляем ему токен сессии
      if (customer) {
        customer.orders = _.orderBy(customer.orders, ['id'], ['desc'])

        const groups = await getRepository(Group).find({
          where: {
            isGroupModifier: false,
          },
          relations: ['products', 'products.parentGroup'],
        })

        customer.favoriteProducts.map(async (favouriteProduct) => {
          favouriteProduct.product.recomended = []
          favouriteProduct.product.recomended.push(
            ...(await this.menuService.getRecomendedProducts(favouriteProduct.product, 3, groups))
          )
        })

        customer.orders.map((order: Order) => {
          order.items.map(async (orderItem: OrderItem) => {
            orderItem.product.recomended = []
            orderItem.product.recomended.push(
              ...(await this.menuService.getRecomendedProducts(orderItem.product, 3, groups))
            )
          })
        })

        // Если в истории заказов нужны заказы, которые есть точно  в iiko
        // customer.orders = _.filter(customer.orders, 'orderIikoId')

        const session = await this.store.createAndSaveSessionFromUser(customer, { csrfToken: true })
        const token = session.getToken()
        const response = new HttpResponseOK({
          error: false,
          message: 'Успешная авторизация',
          token: token,
          customer: customer,
        })
        setSessionCookie(response, session.getToken())
        setCsrfCookie(response, await getCsrfToken(session))

        this.logger.info(`${getClientIp(ctx)} - ${ctx.request.method} ${ctx.request.url}  ${Date.now() - startTime} ms`)

        return response
      } else {
        return new HttpResponseBadRequest(customer)
      }
    } catch (error) {
      this.logger.error(
        `${getClientIp(ctx)} - ${ctx.request.method} ${ctx.request.url}  ${Date.now() - startTime} ms`,
        error
      )
      return new HttpResponseBadRequest(error)
    }
  }

  @Post('/logout')
  @TokenRequired({
    user: fetchUser(Customer),
    store: TypeORMStore,
  })
  // @CsrfTokenRequired()
  async logout(ctx: Context<Customer, Session>) {
    //Удаление сессии
    /*
    Время начала обработки запроса. Нужно чтобы считать общее время обработки запроса.
    */
    const startTime = Date.now()
    try {
      await this.store.destroy(ctx.session.sessionID)
      const response = new HttpResponseOK()
      removeSessionCookie(response)
      this.logger.info(`${getClientIp(ctx)} - ${ctx.request.method} ${ctx.request.url}  ${Date.now() - startTime} ms`)
      return new HttpResponseOK({ error: false, message: 'Logged out...' })
    } catch (error) {
      this.logger.error(
        `${getClientIp(ctx)} - ${ctx.request.method} ${ctx.request.url}  ${Date.now() - startTime} ms`,
        error
      )
    }
  }

  @Patch('/customer')
  @TokenRequired({
    user: fetchUser(Customer),
    store: TypeORMStore,
  })
  @ValidateBody({
    additionalProperties: false,
    properties: {
      name: { type: 'string' },
      birthday: { type: 'string' },
    },
    required: ['name', 'birthday'],
    type: 'object',
  })
  // @CsrfTokenRequired()
  async setCustomerInfo(ctx: Context<Customer, Session>) {
    /*
    Время начала обработки запроса. Нужно чтобы считать общее время обработки запроса.
    */
    const startTime = Date.now()

    try {
      const name = ctx.request.body.name
      const birthday = ctx.request.body.birthday

      const customer = await getRepository(Customer).findOne({ id: ctx.user.id })
      if (customer) {
        customer.name = name
        customer.birthday = birthday
        const customerDb = await getRepository(Customer).save(customer)
        this.logger.info(`${getClientIp(ctx)} - ${ctx.request.method} ${ctx.request.url}  ${Date.now() - startTime} ms`)
        return new HttpResponseOK({ error: false, message: 'Данные обновлены...' })
      } else {
        return new HttpResponseBadRequest('Клиент не найден')
      }
    } catch (error) {
      this.logger.error(
        `${getClientIp(ctx)} - ${ctx.request.method} ${ctx.request.url}  ${Date.now() - startTime} ms`,
        error
      )
      return new HttpResponseBadRequest(error)
    }
  }

  @Post('/favorite')
  @TokenRequired({
    user: fetchUser(Customer),
    store: TypeORMStore,
  })
  @ValidateBody({
    additionalProperties: false,
    properties: {
      productId: { type: 'string' },
    },
    required: ['productId'],
    type: 'object',
  })
  // @CsrfTokenRequired()
  async setFavoriteProduct(ctx: Context<Customer, Session>) {
    /*
    Время начала обработки запроса. Нужно чтобы считать общее время обработки запроса.
    */
    const startTime = Date.now()

    const productId = ctx.request.body.productId
    try {
      const product = await getRepository(Product).findOne({ id: productId })
      const customer = await getRepository(Customer).findOne({ id: ctx.user.id })
      if (customer && product) {
        await getRepository(FavoriteProduct).save({ product, customer })
        this.logger.info(`${getClientIp(ctx)} - ${ctx.request.method} ${ctx.request.url}  ${Date.now() - startTime} ms`)
        return new HttpResponseOK({ error: false, message: 'Данные обновлены...' })
      } else {
        return new HttpResponseBadRequest('Клиент не найден')
      }
    } catch (error) {
      this.logger.error(
        `${getClientIp(ctx)} - ${ctx.request.method} ${ctx.request.url}  ${Date.now() - startTime} ms`,
        error
      )
      return new HttpResponseBadRequest(error)
    }
  }

  @Delete('/favorite')
  @TokenRequired({
    user: fetchUser(Customer),
    store: TypeORMStore,
  })
  @ValidateBody({
    additionalProperties: false,
    properties: {
      productId: { type: 'string' },
    },
    required: ['productId'],
    type: 'object',
  })
  // @CsrfTokenRequired()
  async deleteFavoriteProduct(ctx: Context<Customer, Session>) {
    /*
    Время начала обработки запроса. Нужно чтобы считать общее время обработки запроса.
    */
    const startTime = Date.now()

    const productId = ctx.request.body.productId
    try {
      const product = await getRepository(Product).findOne({ id: productId })
      const customer = await getRepository(Customer).findOne({ id: ctx.user.id })
      const favoriteProduct = await getRepository(FavoriteProduct).findOne({ product, customer })
      if (favoriteProduct) {
        await getRepository(FavoriteProduct).delete(favoriteProduct)
        this.logger.info(`${getClientIp(ctx)} - ${ctx.request.method} ${ctx.request.url}  ${Date.now() - startTime} ms`)
        return new HttpResponseOK({ error: false, message: 'Данные обновлены...' })
      } else {
        return new HttpResponseBadRequest('Избранный продукт не найден')
      }
    } catch (error) {
      this.logger.error(
        `${getClientIp(ctx)} - ${ctx.request.method} ${ctx.request.url}  ${Date.now() - startTime} ms`,
        error
      )
      return new HttpResponseBadRequest(error)
    }
  }
}
