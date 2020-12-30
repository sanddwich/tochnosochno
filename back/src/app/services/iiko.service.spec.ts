// std
import { ok, strictEqual } from 'assert'

// 3p
import { Context, createController, getHttpMethod, getPath, isHttpResponseOK } from '@foal/core'

import * as faker from 'faker'

// App
import { Iiko } from './iiko.service'
import { random } from 'faker'
let iikoService: Iiko

describe('Iiko Service', () => {
  beforeEach(() => (iikoService = createController(Iiko)))

  // describe('has a "formatOrderForIiko" method that', () => {
  //   it('should return correct IikoOrder', async () => {
  //     strictEqual(await iikoService.formatOrderForIiko({

  //       id: faker.random.uuid(),
  //       name: faker.random.word(),
  //       completeBefore: faker.date.future().toLocaleDateString(),
  //       phone: faker.phone.phoneNumber(),
  //       date: faker.date.past().toLocaleDateString(),
  //       status: 'Новый',
  //       amount: faker.commerce.price(),
  //       bonus:
  //       device:
  //       prepareDate

  //     }), {})
  //   })

    it('should return an HttpResponseOK.', () => {
      // const ctx = new Context({})
      // ok(isHttpResponseOK(controller.auth(ctx)))
    })
  })
})
