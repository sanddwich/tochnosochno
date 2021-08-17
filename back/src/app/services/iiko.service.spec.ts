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
  beforeEach(async () => (iikoService = await createService(Iiko).getInstance()))

  describe('has a "getTerminalGroupIdByTime" method that', () => {
    it('should return correct terminalId', async () => {
      strictEqual(
        await iikoService.getDeliveryRestirctions(
          'c753337b-ccd2-4c3b-a605-0c8c23c20057',
          '',
          '141',
          260,
          true,
          46.3347058,
          48.0404117,
          '30000001000126200',
          '2021-08-18 01:00:00.000'
        ),
        {}
      )
    })

    it('should return an HttpResponseOK.', () => {
      // const ctx = new Context({})
      // ok(isHttpResponseOK(controller.auth(ctx)))
    })
  })
})
