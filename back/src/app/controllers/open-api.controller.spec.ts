// std
import { ok, strictEqual } from 'assert'

// 3p
import { Context, createController, getHttpMethod, getPath, isHttpResponseOK } from '@foal/core'

// App
import { OpenApiController } from './open-api.controller'

describe('OpenApiController', () => {
  let controller: OpenApiController

  beforeEach(() => (controller = createController(OpenApiController)))
})
