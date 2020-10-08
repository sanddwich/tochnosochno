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
} from '@foal/core'
import { CsrfTokenRequired, getCsrfToken, setCsrfCookie } from '@foal/csrf'
import { TypeORMStore, fetchUser } from '@foal/typeorm'
import { getRepository } from 'typeorm'

import { Customer } from '../entities'
import { SmsService } from '../services'

@Hook(() => (response) => {
  response.setHeader('Access-Control-Allow-Credentials', 'true')
  response.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
})
export class AuthController {
  @dependency
  store: TypeORMStore

  @dependency
  sms: SmsService

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
    const { code, phone } = ctx.request.body
    const repository = getRepository(Customer)

    const isCodeCorrect = await this.sms.verifyCode(phone, code)

    //Если код неправильный
    if (!isCodeCorrect) {
      return new HttpResponseNotFound({ error: true, message: 'Введите коректный код' })
    }

    let customer = await getRepository(Customer).findOne(
      { phone },
      {
        relations: [
          'orders',
          'addresses',
          'orders.orderItems',
          'orders.orderItems.productVariant.product',
          'orders.orderItems.productVariant',
          'orders.orderItems.orderItemModifiers',
          'orders.orderItems.orderItemModifiers.productModifier',
          'orders.orderItems.orderItemModifiers.productModifier.modifier',
        ],
      }
    )

    //Если клиента нет создаём нового с номером телефона
    if (!customer) {
      customer = new Customer()
      customer.phone = phone
      await repository.save(customer)
    }

    //Создаём сессию для пользователя и отправляем ему токен сессии
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
