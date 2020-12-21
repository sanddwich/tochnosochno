import { Order, PinCode, Terminal } from '../entities'
import { getRepository } from 'typeorm'
import * as nodemailer from 'nodemailer'
import axios from 'axios'
import { Config } from '@foal/core'
const quaryString = require('query-string')

const API_EMAIL = 'tochno.sochno.sms@gmail.com'
const API_KEY = 'IJZpZkEJuqv1hwuUwOAkmghJeHh1'
const API_SIGN = 'Sochno30'
const API_CHANNEL = 'DIRECT'

export class SmsService {
  async createCode(phone: string) {
    const repository = getRepository(PinCode)
    const pinCode = new PinCode()
    const oldCode = await this.checkPhone(phone)

    if (!oldCode) {
      const code = Math.floor(100000 + Math.random() * 900000)
      const date = new Date()
      date.setSeconds(date.getSeconds() + 60)

      pinCode.phone = phone
      pinCode.pinCode = code
      pinCode.expiresIn = date

      await repository.save(pinCode)

      //Connect to sms service to send sms with pinCode
      const smsStatus = await this.sendSms(phone, code)

      return { error: false, message: 'Вам на телефон отправлен код' }
    } else {
      return { error: true, message: 'Вы уже делали запрос на отправку кода' }
    }
  }

  async verifyCode(phone: string, code: string) {
    const repository = getRepository(PinCode)
    const pinCode = await repository
      .createQueryBuilder('pincode')
      .where('pincode.phone = :phone', { phone: phone })
      .andWhere('pincode.pinCode = :code', { code: code })
      .andWhere('TIMESTAMPDIFF(SECOND, pincode.expiresIn, CURRENT_TIMESTAMP ) < 60')
      .getOne()

    return pinCode
  }

  async sendOrderEmail(order: Order) {
    let orderItemsHtml = ''
    let deliveryAddress = ''
    if (order.isDelivery && order.address) {
      deliveryAddress = ` ${order.address.street.name ? `ул. ${order.address.street.name},` : ''} 
       ${order.address.house ? `д. ${order.address.house},` : ''} 
      ${order.address.flat ? `кв. ${order.address.flat}, ` : ''} 
      ${order.address.entrance ? `${order.address.entrance} подъезд, ` : ''}  
      ${order.address.floor ? `${order.address.floor} этаж` : ''}`
    }
    if (!order.isDelivery) {
      const terminal = await getRepository(Terminal).findOne({ id: order.terminalId.toString() })
      deliveryAddress = terminal ? terminal.name : ''
    }

    order.items.map((orderItem, index) => {
      const html = `<tr>
     <td style="width: 4.298%;">${index + 1}</td>
     <td style="width: 35.8166%;">
         <div style="text-align: center;">${orderItem.product.name}</div>
     </td>
     <td style="width: 20.0000%;">
         <div style="text-align: center;">${
           (orderItem.product.sizePrices && orderItem.product.sizePrices[0].price.currentPrice) ||
           orderItem.product.price
         }</div>
     </td>
     <td style="width: 20.0000%;">
         <div style="text-align: center;">${orderItem.amount}</div>
     </td>
     <td style="width: 20.0000%;">
         <div style="text-align: center;">${
           (orderItem.product.sizePrices && orderItem.product.sizePrices[0].price.currentPrice * orderItem.amount) ||
           orderItem.product.price * orderItem.amount
         }</div>
     </td>
 </tr>`
      orderItemsHtml = orderItemsHtml + html
    })

    const html = `<p style="text-align: center;"><br></p>
    <p style="text-align: center;"><strong><span style="font-size: 26px;">Заказ</span></strong></p>
    <table style="width: 100%;">
        <tbody>
            <tr>
                <td style="width: 4.298%;">
                    <div style="text-align: center;">№</div>
                </td>
                <td style="width: 35.8166%;">
                    <div style="text-align: center;">Наименование</div>
                </td>
                <td style="width: 20.0000%;">
                    <div style="text-align: center;">Цена</div>
                </td>
                <td style="width: 20.0000%;">
                    <div style="text-align: center;">Количество</div>
                </td>
                <td style="width: 20.0000%;">
                    <div style="text-align: center;">Стоимость</div>
                </td>
            </tr>
         ${orderItemsHtml}
        </tbody>
    </table>
    <p><br></p>
    <p style="text-align: center;"><strong><span style="font-size: 24px;">Клиент</span></strong></p>
    <p><span style="font-size: 17px;">Имя: ${order.customer.name}</span></p>
    <p><span style="font-size: 17px;">Телефон: ${order.customer.phone || order.phone}</span></p>
    <p><span style="font-size: 17px;">Доставка: ${order.isDelivery ? '<b>курьером</b>' : '<b>самовывоз </b>'}</span></p>
    ${
      order.isDelivery
        ? ` <p><span style="font-size: 17px;">Адрес доставки: ${deliveryAddress}</span></p>`
        : `<p><span style="font-size: 17px;">Адрес самовывоза: ${deliveryAddress}</span></p>`
    }
   
    <p><span style="font-size: 17px;">Количество персон: ${order.guests.count}</span></p>
    <p><span style="font-size: 17px;">Оплата: ${
      order.payment === 'credit' ? 'кредитной картой' : 'наличными'
    }</span></p>
    ${order.comment ? `<p><span style="font-size: 17px;">Комментарий: ${order.comment}</span></p>` : ''}
    ${
      order.completeBefore
        ? `<p><span style="font-size: 17px;">Приготовить ко времени: ${order.completeBefore}</span></p>`
        : ''
    }
   `

    const transporter = nodemailer.createTransport({
      host: Config.get('mail.host'),
      port: Config.get('mail.port'),
      secure: Config.get('mail.secure'),
      auth: {
        user: Config.get('mail.auth.user'),
        pass: Config.get('mail.auth.pass'),
      },
    })

    const result = await transporter.sendMail({
      from: `"${Config.get('host')}" <${Config.get('mail.auth.user')}>`,
      to: Config.get('mail.orderEmail'),
      subject: `Заказ с сайта - ${order.date}`,
      text: 'Новый заказ',
      html: html,
    })
    return result
  }

  private async checkPhone(phone: string) {
    const date = new Date()
    const repository = getRepository(PinCode)
    const pinCode = await repository
      .createQueryBuilder('pincode')
      .where('pincode.phone = :phone', { phone: phone })
      .andWhere('TIMESTAMPDIFF(SECOND, pincode.expiresIn, CURRENT_TIMESTAMP + INTERVAL 1 HOUR )  < 5')
      .getOne()

    return pinCode
  }

  private async sendSms(phone: string, pinCode: number) {
    const url = `https://${API_EMAIL}:${API_KEY}@gate.smsaero.ru/v2/sms/send`

    return await axios
      .post(
        url,
        quaryString.stringify({
          number: phone,
          text: `Ваш код авторизации на сайте sochno30.ru: ${pinCode}`,
          sign: API_SIGN,
          channel: API_CHANNEL,
        })
      )
      .then((response) => {
        return { error: false, message: 'СМС сообщение отправлено' }
      })
      .catch((error) => {
        return { error: true, message: error.message }
      })
  }
}
