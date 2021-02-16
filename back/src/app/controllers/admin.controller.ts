import {
  Config,
  Context,
  dependency,
  Get,
  HttpResponseBadRequest,
  HttpResponseCreated,
  HttpResponseForbidden,
  Put,
  render,
  TokenRequired,
  ValidateBody,
} from '@foal/core'
import { fetchUser, TypeORMStore } from '@foal/typeorm'
import { User } from '../entities'
import { Iiko, LoggerService, PaymentService, SmsService } from '../services'
import getClientIp from '../utils/utils'

export class AdminController {
  @dependency
  iiko: Iiko

  @dependency
  bank: PaymentService

  @dependency
  senderService: SmsService

  @dependency
  logger: LoggerService

  @Get('/signin')
  signin(ctx: Context) {
    return render('public/templates/signin.html')
  }

  @Get('/')
  @TokenRequired({
    user: fetchUser(User),
    store: TypeORMStore,
    redirectTo: 'admin/signin',
  })
  index() {
    return render('public/templates/admin.html')
  }

  @Put('/streets')
  @ValidateBody({
    additionalProperties: false,
    properties: {
      token: { type: 'string' },
    },
    required: ['token'],
    type: 'object',
  })
  async setStreets(ctx: Context) {
    /*
    Время начала обработки запроса. Нужно чтобы считать общее время обработки запроса.
    */
    const startTime = Date.now()

    const token = ctx.request.body.token
    if (token === Config.get('adminToken')) {
      const iiko = await this.iiko.getInstance()
      const streets = await iiko.setStreets()
      this.logger.info(`${getClientIp(ctx)} - ${ctx.request.method} ${ctx.request.url}  ${Date.now() - startTime} ms`)
      if (streets) {
        return new HttpResponseCreated(streets)
      } else {
        return new HttpResponseBadRequest({ error: true, message: 'Ошибка добавления улиц' })
      }
    } else {
      this.logger.error(
        `${getClientIp(ctx)} - ${ctx.request.method} ${ctx.request.url}  ${Date.now() - startTime} ms`,
        `Wrong token: ${token}`
      )
      return new HttpResponseForbidden('Wrong token')
    }
  }

  @Put('/terminals')
  @ValidateBody({
    additionalProperties: false,
    properties: {
      token: { type: 'string' },
    },
    required: ['token'],
    type: 'object',
  })
  async setTerminals(ctx: Context) {
    /*
    Время начала обработки запроса. Нужно чтобы считать общее время обработки запроса.
    */
    const startTime = Date.now()

    const token = ctx.request.body.token
    if (token === Config.get('adminToken')) {
      const iiko = await this.iiko.getInstance()
      const terminals = await iiko.setTerminals()

      this.logger.info(`${getClientIp(ctx)} - ${ctx.request.method} ${ctx.request.url}  ${Date.now() - startTime} ms`)

      if (terminals) {
        return new HttpResponseCreated(terminals)
      } else {
        return new HttpResponseBadRequest({ error: true, message: 'Ошибка добавления терминалов' })
      }
    } else {
      this.logger.error(
        `${getClientIp(ctx)} - ${ctx.request.method} ${ctx.request.url}  ${Date.now() - startTime} ms`,
        `Wrong token: ${token}`
      )
      return new HttpResponseForbidden('Wrong token')
    }
  }

  @Put('/menu')
  @ValidateBody({
    additionalProperties: false,
    properties: {
      token: { type: 'string' },
    },
    required: ['token'],
    type: 'object',
  })
  async setMenu(ctx: Context) {
    /*
    Время начала обработки запроса. Нужно чтобы считать общее время обработки запроса.
    */
    const startTime = Date.now()
    const token = ctx.request.body.token
    if (token === Config.get('adminToken')) {
      let menu

      const iiko = await this.iiko.getInstance()
      menu = await iiko.getMenu()

      this.logger.info(`${getClientIp(ctx)} - ${ctx.request.method} ${ctx.request.url}  ${Date.now() - startTime} ms`)
      if (menu) {
        return new HttpResponseCreated(menu)
      } else {
        return new HttpResponseBadRequest({ error: true, message: 'Ошибка меню не обновлено' })
      }
    } else {
      this.logger.error(
        `${getClientIp(ctx)} - ${ctx.request.method} ${ctx.request.url}  ${Date.now() - startTime} ms`,
        `Wrong token: ${token}`
      )
      return new HttpResponseForbidden('Wrong token')
    }
  }

  @Put('/payment')
  @ValidateBody({
    additionalProperties: false,
    properties: {
      token: { type: 'string' },
    },
    required: ['token'],
    type: 'object',
  })
  async setPayment(ctx: Context) {
    /*
    Время начала обработки запроса. Нужно чтобы считать общее время обработки запроса.
    */
    const startTime = Date.now()

    const token = ctx.request.body.token
    if (token === Config.get('adminToken')) {
      const iiko = await this.iiko.getInstance()

      const payment = await iiko.setPaymentTypes()
      this.logger.info(`${getClientIp(ctx)} - ${ctx.request.method} ${ctx.request.url}  ${Date.now() - startTime} ms`)

      if (payment) {
        return new HttpResponseCreated(payment)
      } else {
        return new HttpResponseBadRequest({ error: true, message: 'Ошибка добавления типов оплат' })
      }
    } else {
      this.logger.error(
        `${getClientIp(ctx)} - ${ctx.request.method} ${ctx.request.url}  ${Date.now() - startTime} ms`,
        `Wrong token: ${token}`
      )
      return new HttpResponseForbidden('Wrong token')
    }
  }

  @Put('/cities')
  @ValidateBody({
    additionalProperties: false,
    properties: {
      token: { type: 'string' },
    },
    required: ['token'],
    type: 'object',
  })
  async setCities(ctx: Context) {
    /*
    Время начала обработки запроса. Нужно чтобы считать общее время обработки запроса.
    */
    const startTime = Date.now()

    const token = ctx.request.body.token
    if (token === Config.get('adminToken')) {
      const iiko = await this.iiko.getInstance()
      const cities = await iiko.setCities()
      this.logger.info(`${getClientIp(ctx)} - ${ctx.request.method} ${ctx.request.url}  ${Date.now() - startTime} ms`)
      if (cities) {
        return new HttpResponseCreated(cities)
      } else {
        return new HttpResponseBadRequest({ error: true, message: 'Ошибка добавления городов' })
      }
    } else {
      this.logger.error(
        `${getClientIp(ctx)} - ${ctx.request.method} ${ctx.request.url}  ${Date.now() - startTime} ms`,
        `Wrong token: ${token}`
      )
      return new HttpResponseForbidden('Wrong token')
    }
  }



  @Put('/orderStatus')
  @ValidateBody({
    additionalProperties: false,
    properties: {
      token: { type: 'string' },
      orderIds:{type: 'array'}
    },
    required: ['token'],
    type: 'object',
  })
  async getIIkoOrderStatus(ctx: Context) {
    /*
    Время начала обработки запроса. Нужно чтобы считать общее время обработки запроса.
    */
    const startTime = Date.now()

    const token = ctx.request.body.token
    const orderIds = ctx.request.body.orderIds

    if (token === Config.get('adminToken')) {
      let orderIikoResponses

      const iiko = await this.iiko.getInstance()
      orderIikoResponses = await iiko.getOrders(orderIds)

      this.logger.info(`${getClientIp(ctx)} - ${ctx.request.method} ${ctx.request.url}  ${Date.now() - startTime} ms`)
      if (orderIikoResponses) {
        return new HttpResponseCreated(orderIikoResponses)
      } else {
        return new HttpResponseBadRequest({ error: true, message: 'Ошибка при проверке статусов заказов' })
      }
    } else {
      this.logger.error(
        `${getClientIp(ctx)} - ${ctx.request.method} ${ctx.request.url}  ${Date.now() - startTime} ms`,
        `Wrong token: ${token}`
      )
      return new HttpResponseForbidden('Wrong token')
    }
  }


}
