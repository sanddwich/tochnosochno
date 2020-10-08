import { controller } from '@foal/core'

import { ApiController, AuthController } from './controllers'
import { AdminController } from './controllers/admin.controller'
import { OpenApiController } from './controllers/open-api.controller'

export class AppController {
  subControllers = [
    controller('/api', ApiController),
    controller('/auth', AuthController),
    controller('/admin', AdminController),
    controller('/swagger', OpenApiController),
  ]
}
