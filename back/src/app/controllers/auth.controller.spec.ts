// std
import { ok, strictEqual } from 'assert'

// 3p
import { Context, createController, getHttpMethod, getPath, isHttpResponseOK } from '@foal/core'

// App
import { AuthController } from './auth.controller'

describe('AuthController', () => {
  let controller: AuthController

  beforeEach(() => (controller = createController(AuthController)))

  describe('has a "login" method that', () => {
    it('should handle requests at GET /.', () => {})

    it('should return an HttpResponseOK.', () => {
      // const ctx = new Context({})
      // ok(isHttpResponseOK(controller.auth(ctx)))
    })
  })
})
