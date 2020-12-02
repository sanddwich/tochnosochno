import {
  Context,
  dependency,
  Get,
  HttpResponseBadRequest,
  HttpResponseCreated,
  Put,
  render,
  TokenRequired,
} from '@foal/core'
import { fetchUser, TypeORMStore } from '@foal/typeorm'
import { User } from '../entities'
import { Iiko, PaymentService, SmsService } from '../services'

export class AdminController {
  @dependency
  iiko: Iiko

  @dependency
  bank: PaymentService

  @dependency
  senderService: SmsService

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
  async setStreets() {
    const iiko = await this.iiko.getInstance()
    const streets = await iiko.setStreets()
    if (streets) {
      return new HttpResponseCreated(streets)
    } else {
      return new HttpResponseBadRequest({ error: true, message: 'Ошибка добавления улиц' })
    }
  }

  @Put('/terminals')
  async setTerminals() {
    const iiko = await this.iiko.getInstance()
    const terminals = await iiko.setTerminals()
    if (terminals) {
      return new HttpResponseCreated(terminals)
    } else {
      return new HttpResponseBadRequest({ error: true, message: 'Ошибка добавления терминалов' })
    }
  }

  @Put('/menu')
  async setMenu() {
    /*
    Время начала обработки запроса. Нужно чтобы считать общее время обработки запроса.
    */
    const startTime = Date.now()
    let menu

    try {
      const iiko = await this.iiko.getInstance()
      menu = await iiko.getMenu()
    } catch (error) {
      console.log(error)
    }

    if (menu) {
      return new HttpResponseCreated(menu)
    } else {
      return new HttpResponseBadRequest({ error: true, message: 'Ошибка меню не обновлено' })
    }
  }

  @Put('/payment')
  async setPayment() {
    const iiko = await this.iiko.getInstance()
    const payment = iiko.setPaymentTypes()
    if (payment) {
      return new HttpResponseCreated(payment)
    } else {
      return new HttpResponseBadRequest({ error: true, message: 'Ошибка добавления типов оплат' })
    }
  }

  @Put('/cities')
  async setCities() {
    const iiko = await this.iiko.getInstance()
    const cities = await iiko.setCities()

    if (cities) {
      return new HttpResponseCreated(cities)
    } else {
      return new HttpResponseBadRequest({ error: true, message: 'Ошибка добавления городов' })
    }
  }
}
