import 'source-map-support/register'

// std
import * as http from 'http'

import * as express from 'express'
import * as rateLimit from 'express-rate-limit'

import { Config, createApp } from '@foal/core'
import { createConnection } from 'typeorm'
import { AppController } from './app/app.controller'

async function main() {
  await createConnection()
  const expressApp = express()

  const rateLimiter = (max = 3, windowMs = 15 * 60 * 1000) =>
    rateLimit({
      max,
      windowMs,
      handler: function (req, res, next) {
        res.removeHeader('X-Powered-By')
        res.setHeader('X-Content-Type-Options', 'nosniff')
        res.setHeader('X-DNS-Prefetch-Control', 'off')
        res.setHeader('X-Download-Options', 'noopen')
        res.setHeader('X-Frame-Options', 'SAMEORIGIN')
        res.setHeader('X-XSS-Protection', '1; mode=block')
        res.setHeader('Strict-Transport-Security', 'max-age=15552000; includeSubDomains')
        res.setHeader('Access-Control-Allow-Origin', '*')
        if (req.method === 'OPTIONS') {
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
          res.setHeader('Access-Control-Allow-Methods', 'HEAD, GET, POST, PUT, PATCH, DELETE')
        }

        res.status(429).send(this.message)
      },
    })

  expressApp.use('/auth/login', rateLimiter(5, 1 * 60 * 1000))
  expressApp.use('/auth/auth', rateLimiter(10, 1 * 60 * 1000))
  expressApp.use('/api', rateLimiter(60, 1 * 60 * 1000))

  const app = createApp(AppController, expressApp)

  const httpServer = http.createServer(app)
  const port = Config.get2('port', 'number', 3001)
  httpServer.listen(port, () => {
    console.log(`Listening on port ${port}...`)
  })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
