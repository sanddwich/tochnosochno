import { PinCode } from '../entities'
import { getRepository } from 'typeorm'
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
      .andWhere('TIMESTAMPDIFF(SECOND, pincode.expiresIn, CURRENT_TIMESTAMP + INTERVAL 1 HOUR) < 60')
      .getOne()

    return pinCode
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
