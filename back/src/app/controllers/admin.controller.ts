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
import { Iiko } from '../services'

export class AdminController {
  @dependency
  iiko: Iiko

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

  @Put('/menu')
  async setMenu() {
    await this.iiko.init()
    const menu = await this.iiko.getMenu()
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
}
