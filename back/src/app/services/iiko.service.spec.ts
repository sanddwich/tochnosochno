// std
import { ok, strictEqual } from 'assert'

// 3p
import { Context, createController, createService, getHttpMethod, getPath, isHttpResponseOK } from '@foal/core'

import * as faker from 'faker'

// App
import { Iiko } from './iiko.service'
import { random } from 'faker'
import { createConnection, getConnection, getConnectionManager, getRepository } from 'typeorm'
import { Customer } from '../entities'
let iikoService: Iiko

describe('Iiko Service', () => {
  beforeEach(() => (iikoService = createService(Iiko)))

  describe('has a "getTerminalGroupIdByTime" method that', () => {
    it('should return correct terminalId', async () => {
      const customer = await getConnection().getRepository(Customer).findOne()
      if (customer) {
        strictEqual(
          await iikoService.getTerminalGroupIdByTime(
            {
              completeBefore: faker.date.future().toLocaleDateString(),
              phone: faker.phone.phoneNumber(),
              items: [],
              payments: [],
              customer,
            },
            540,
            1410
          ),
          'dasd',
          'qqqqqq'
        )
      }
    })

    it('should return an HttpResponseOK.', () => {
      // const ctx = new Context({})
      // ok(isHttpResponseOK(controller.auth(ctx)))
    })
  })
})
