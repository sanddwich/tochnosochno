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
    await this.iiko.init()
    const streets = await this.iiko.setStreets()
    if (streets) {
      return new HttpResponseCreated(streets)
    } else {
      return new HttpResponseBadRequest({ error: true, message: 'Ошибка добавления улиц' })
    }
  }

  @Put('/terminals')
  async setTerminals() {
    await this.iiko.init()
    const terminals = await this.iiko.setTerminals()
    if (terminals) {
      return new HttpResponseCreated(terminals)
    } else {
      return new HttpResponseBadRequest({ error: true, message: 'Ошибка добавления терминалов' })
    }
  }

  @Put('/menu')
  async setMenu() {
    let menu
    await this.iiko.init()
    try {
      menu = await this.iiko.getMenu()
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
    await this.iiko.init()
    const payment = await this.iiko.getPaymentTypes()
    if (payment) {
      return new HttpResponseCreated(payment)
    } else {
      return new HttpResponseBadRequest({ error: true, message: 'Ошибка добавления типов оплат' })
    }
  }

  @Put('/bank')
  async testBank() {
    const payment = await this.bank.sendOrderToBank('+79608618274', 'fssdf23432dsfs', '20000')

    if (payment) {
      return new HttpResponseCreated(payment)
    } else {
      return new HttpResponseBadRequest({ error: true, message: 'Ошибка добавления типов оплат' })
    }
  }

  @Put('/cities')
  async setCities() {
    await this.iiko.init()
    const cities = await this.iiko.setCities()

    if (cities) {
      return new HttpResponseCreated(cities)
    } else {
      return new HttpResponseBadRequest({ error: true, message: 'Ошибка добавления городов' })
    }
  }

  // @Put('/email')
  // async sendEmail() {
  //   // const result = await this.senderService.sendEmail()

  //   if (result) {
  //     return new HttpResponseCreated(result)
  //   } else {
  //     return new HttpResponseBadRequest({ error: true, message: 'Ошибка отправления почты' })
  //   }
  // }
}
