import 'source-map-support/register'
import { createConnection } from 'typeorm'
process.env.NODE_ENV = 'test'

async function main() {
  await createConnection()
}
