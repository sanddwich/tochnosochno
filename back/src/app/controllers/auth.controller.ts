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
} from '@foal/core'
import { CsrfTokenRequired, getCsrfToken, setCsrfCookie } from '@foal/csrf'
import { TypeORMStore, fetchUser } from '@foal/typeorm'
import { getRepository } from 'typeorm'

import { Customer } from '../entities'
import { WalletBalance } from '../entities/wallet-balance.entity'
import { Iiko, CustomerService, SmsService } from '../services'
import { v4 as uuidv4 } from 'uuid'

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
export class AuthController {
  @dependency
  store: TypeORMStore

  @dependency
  iiko: Iiko

  @dependency
  sms: SmsService

  @dependency
  customerService: CustomerService

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
    await this.iiko.init()
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

    let aiikoCustomer = await this.iiko.getCustomer(phone)

    if (aiikoCustomer) aiikoCustomer = this.customerService.setBonuses(aiikoCustomer)

    if (aiikoCustomer && aiikoCustomer.id) {
    } else {
      const customerDb = await repositoryCustomer.findOne({ phone: phone })
      if (!customerDb) {
        customer = new Customer()
        customer.phone = phone
        customer.id = uuidv4()
        customer.addresses = []
        customer.orders = []
        customer = await repositoryCustomer.save(customer)
      }
    }
    if (!customer) {
      customer = await repositoryCustomer.findOne(
        { phone },
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
    }

    //Создаём сессию для пользователя и отправляем ему токен сессии
    if (customer) {
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
  @CsrfTokenRequired()
  async logout(ctx: Context<Customer, Session>) {
    //Удаление сессии
    await this.store.destroy(ctx.session.sessionID)
    const response = new HttpResponseOK()
    removeSessionCookie(response)
    return new HttpResponseOK({ error: false, message: 'Logged out...' })
  }
}
