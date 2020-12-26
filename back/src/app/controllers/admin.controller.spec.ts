// std
import { ok, strictEqual } from 'assert'

// 3p
import { Context, createController, getHttpMethod, getPath, isHttpResponseOK } from '@foal/core'

// App
import { AdminController } from './admin.controller'

describe('AdminController', () => {
  let controller: AdminController

  beforeEach(() => (controller = createController(AdminController)))

  describe('has a "setMenu" method that', () => {
    it('should handle requests at PUT /menu', () => {
      strictEqual(getHttpMethod(AdminController, 'setMenu'), 'PUT')
      strictEqual(getPath(AdminController, 'setMenu'), '/menu')
    })
  })
})
