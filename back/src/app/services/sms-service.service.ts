import { Order, PinCode } from '../entities'
import { getRepository } from 'typeorm'
import * as nodemailer from 'nodemailer'
import axios from 'axios'
const quaryString = require('query-string')

const API_EMAIL = 'denristun@gmail.com'
const API_KEY = 'LwJbfWxYbACKB64gwaSenxSXLeKk'
const API_SIGN = 'SMS Aero'
const API_CHANNEL = 'DIRECT'

export class SmsService {
  async createCode(phone: string) {
    const repository = getRepository(PinCode)
    const pinCode = new PinCode()
    const oldCode = await this.checkPhone(phone)

    if (!oldCode) {
      const code = Math.floor(100000 + Math.random() * 900000)
      const date = new Date()
      date.setSeconds(date.getSeconds() + 3660)

      pinCode.phone = phone
      pinCode.pinCode = code
      pinCode.expiresIn = date

      await repository.save(pinCode)

      const smsStatus = await this.sendSms(phone, code)

      //Connect to sms service to send sms with pinCode

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

      // .andWhere('TIMESTAMPDIFF(SECOND, pincode.expiresIn, CURRENT_TIMESTAMP + INTERVAL 1 HOUR) < 60')
      .getOne()

    return pinCode
  }

  async sendOrderEmail(order: Order) {
    let orderItemsHtml = ''

    order.items.map((orderItem, index) => {
      const html = `<tr>
     <td style="width: 4.298%;">${index}</td>
     <td style="width: 35.8166%;">
         <div style="text-align: center;">${orderItem.product.name}</div>
     </td>
     <td style="width: 20.0000%;">
         <div style="text-align: center;">${orderItem.product.sizePrices[0].price.currentPrice}</div>
     </td>
     <td style="width: 20.0000%;">
         <div style="text-align: center;">${orderItem.amount}</div>
     </td>
     <td style="width: 20.0000%;">
         <div style="text-align: center;">${orderItem.product.sizePrices[0].price.currentPrice * orderItem.amount}</div>
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
    <p>Доставка: ${order.isDelivery ? '<b>курьером</b>' : '<b>самовывоз </b>'}</p>
    <p>Адрес доставки: ул. ${order.address.street.name}, д. ${order.address.house} кв. ${order.address.flat} ${
      order.address.entrance
    } подъезд, ${order.address.floor} этаж</p>
    <p>Комментарий: ${order.comment}</p>`

    const transporter = nodemailer.createTransport({
      host: 'mail.hostland.ru',
      port: 465,
      secure: true,
      auth: {
        user: 'info@myaso.cafe',
        pass: 'Zxcfdsa654',
      },
    })

    const result = await transporter.sendMail({
      from: '"sochno30.ru" <info@myaso.cafe>',
      to: 'denristun@gmail.com',
      subject: 'Заказ с сайта',
      text: 'This message was sent from Node js server.',
      html: 'This <i>message</i> was sent from <strong>Node js</strong> server.',
    })
    return result
  }

  private async checkPhone(phone: string) {
    const repository = getRepository(PinCode)
    const pinCode = await repository
      .createQueryBuilder('pincode')
      .where('pincode.phone = :phone', { phone: phone })
      .andWhere('TIMESTAMPDIFF(SECOND, pincode.expiresIn, CURRENT_TIMESTAMP + INTERVAL 1 HOUR) < 60')
      .getOne()

    return pinCode
  }

  private async sendSms(phone: string, pinCode: number) {
    const url = `https://${API_EMAIL}:${API_KEY}@gate.smsaero.ru/v2/sms/send`

    return await axios
      .post(url, quaryString.stringify({ number: phone, text: pinCode, sign: API_SIGN, channel: API_CHANNEL }))
      .then((response) => {
        return { error: false, message: 'СМС сообщение отправлено' }
      })
      .catch((error) => {
        return { error: true, message: error.message }
      })
  }
}
