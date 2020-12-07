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
import { Iiko, CustomerService, SmsService, MenuService } from '../services'
import { v4 as uuidv4 } from 'uuid'
import * as _ from 'lodash'

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
    const phone = ctx.request.body.phone

    const pinCode = await this.sms.createCode(phone)

    if (pinCode.error) {
      return new HttpResponseNotFound(pinCode)
    }

    return new HttpResponseOK(pinCode)
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

    let customer: Customer | undefined
    let { code, phone } = ctx.request.body

    const repositoryCustomer = getRepository(Customer)
    const repositoryWalletBalance = getRepository(WalletBalance)

    const isCodeCorrect = await this.sms.verifyCode(phone, code)

    //Если код неправильный
    if (!isCodeCorrect) {
      return new HttpResponseNotFound({ error: true, message: 'Введите коректный код' })
    }

    phone = phone.replace(/^\8/, '+7')
    const iiko = await this.iiko.getInstance()
    let iikoCustomer = await iiko.getCustomer(phone)

    if (iikoCustomer) iikoCustomer = this.customerService.setBonuses(iikoCustomer)
    if (iikoCustomer && iikoCustomer.id) {
      await repositoryCustomer.save(iikoCustomer)
    } else {
      const customerDb = await repositoryCustomer.findOne({ phone: phone })
      console.log(phone)
      if (!customerDb) {
        customer = new Customer()
        customer.phone = phone
        customer.id = uuidv4()
        customer.addresses = []
        customer.orders = []
        customer.name = 'Клиент с сайта'
        customer = await repositoryCustomer.save(customer)
      }
    }
    if (!customer) {
      customer = await repositoryCustomer.findOne(
        { phone },
        {
          relations: [
            'orders',
            // 'addresses',
            'favoriteProducts',
            'favoriteProducts.product',
            'favoriteProducts.product.sizePrices',
            'favoriteProducts.product.sizePrices.price',
            'orders.terminalId',
            'orders.items',
            'orders.items.product',
            'orders.items.product.sizePrices',
            'orders.items.product.sizePrices.price',
            // 'addresses.street',
            // 'orders.address',
            // 'orders.address.street',

            // 'orders.items.productVariant.product',
            // 'orders.items.productVariant',

            // 'orders.items.orderItemModifiers',
            // 'orders.items.orderItemModifiers.productModifier',
            // 'orders.items.orderItemModifiers.productModifier.product',
            // 'orders.items.orderItemModifiers.productModifier.product.sizePrices',
            // 'orders.items.orderItemModifiers.productModifier.product.sizePrices.price',
          ],
        }
      )
    }

    //Создаём сессию для пользователя и отправляем ему токен сессии
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
      return response
    } else {
      return new HttpResponseBadRequest(customer)
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
    await this.store.destroy(ctx.session.sessionID)
    const response = new HttpResponseOK()
    removeSessionCookie(response)
    return new HttpResponseOK({ error: false, message: 'Logged out...' })
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
    const name = ctx.request.body.name
    const birthday = ctx.request.body.birthday
    try {
      const customer = await getRepository(Customer).findOne({ id: ctx.user.id })
      if (customer) {
        customer.name = name
        customer.birthday = birthday
        await getRepository(Customer).save(customer)
        return new HttpResponseOK({ error: false, message: 'Данные обновлены...' })
      } else {
        return new HttpResponseBadRequest('Клиент не найден')
      }
    } catch (error) {
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
    const productId = ctx.request.body.productId
    try {
      const product = await getRepository(Product).findOne({ id: productId })
      const customer = await getRepository(Customer).findOne({ id: ctx.user.id })
      if (customer && product) {
        await getRepository(FavoriteProduct).save({ product, customer })
        return new HttpResponseOK({ error: false, message: 'Данные обновлены...' })
      } else {
        return new HttpResponseBadRequest('Клиент не найден')
      }
    } catch (error) {
      console.log(error)
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
    const productId = ctx.request.body.productId
    try {
      const product = await getRepository(Product).findOne({ id: productId })
      const customer = await getRepository(Customer).findOne({ id: ctx.user.id })
      const favoriteProduct = await getRepository(FavoriteProduct).findOne({ product, customer })
      if (favoriteProduct) {
        await getRepository(FavoriteProduct).delete(favoriteProduct)
        return new HttpResponseOK({ error: false, message: 'Данные обновлены...' })
      } else {
        return new HttpResponseBadRequest('Избранный продукт не найден')
      }
    } catch (error) {
      console.log(error)
      return new HttpResponseBadRequest(error)
    }
  }
}
