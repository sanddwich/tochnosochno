import { createService } from '@foal/core'
import { strictEqual, equal } from 'assert'
import { isFunction, isArray } from 'util'
import { OrderService } from './order-service.service'
import { Customer, Order } from '../entities'
import { Connection, createConnection, getRepository } from 'typeorm'

describe('OrderService', async () => {})
