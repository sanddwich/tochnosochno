// std
import { ok, strictEqual } from 'assert'

// 3p
import { Context, createController, getHttpMethod, getPath, isHttpResponseOK } from '@foal/core'

// App
import { ApiController } from './api.controller'
const controller = createController(ApiController)
describe('ApiController', () => {
  describe('has a "getMenu" method that', () => {
    it('should handle requests at GET /menu', () => {
      strictEqual(getHttpMethod(ApiController, 'getMenu'), 'GET')
      strictEqual(getPath(ApiController, 'getMenu'), '/menu')
    })
  })

  describe('has a "getCustomer" method that', () => {
    it('should handle requests at POST /customer', () => {
      strictEqual(getHttpMethod(ApiController, 'getCustomer'), 'POST')
      strictEqual(getPath(ApiController, 'getCustomer'), '/customer')
    })
  })

  describe('has a "addOrder" method that', () => {
    it('should handle requests at POST /order', () => {
      strictEqual(getHttpMethod(ApiController, 'addOrder'), 'POST')
      strictEqual(getPath(ApiController, 'addOrder'), '/order')
    })
  })

  describe('has a "setOrderPayment" method that', () => {
    it('should handle requests at PATCH /order', () => {
      strictEqual(getHttpMethod(ApiController, 'setOrderPayment'), 'PATCH')
      strictEqual(getPath(ApiController, 'setOrderPayment'), '/order')
    })
  })

  describe('has a "addAddress" method that', () => {
    it('should handle requests at POST /address', () => {
      strictEqual(getHttpMethod(ApiController, 'addAddress'), 'POST')
      strictEqual(getPath(ApiController, 'addAddress'), '/address')
    })
  })

  describe('has a "getCities" method that', () => {
    it('should handle requests at POST /city', () => {
      strictEqual(getHttpMethod(ApiController, 'getCities'), 'POST')
      strictEqual(getPath(ApiController, 'getCities'), '/city')
    })
  })

  describe('has a "getAllCities" method that', () => {
    it('should handle requests at POST /cities', () => {
      strictEqual(getHttpMethod(ApiController, 'getAllCities'), 'POST')
      strictEqual(getPath(ApiController, 'getAllCities'), '/cities')
    })
  })

  describe('has a "getStreetsByCity" method that', () => {
    it('should handle requests at POST /streetsbycity', () => {
      strictEqual(getHttpMethod(ApiController, 'getStreetsByCity'), 'POST')
      strictEqual(getPath(ApiController, 'getStreetsByCity'), '/streetsbycity')
    })
  })

  describe('has a "getGeoLocation" method that', () => {
    it('should handle requests at POST /geo', () => {
      strictEqual(getHttpMethod(ApiController, 'getGeoLocation'), 'POST')
      strictEqual(getPath(ApiController, 'getGeoLocation'), '/geo')
    })
  })

  describe('has a "getDeliveryRestirctions" method that', () => {
    it('should handle requests at POST /delivery', () => {
      strictEqual(getHttpMethod(ApiController, 'getDeliveryRestirctions'), 'POST')
      strictEqual(getPath(ApiController, 'getDeliveryRestirctions'), '/delivery')
    })
  })

  describe('has a "getGroupProducts" method that', () => {
    it('should handle requests at POST /group', () => {
      strictEqual(getHttpMethod(ApiController, 'getGroupProducts'), 'POST')
      strictEqual(getPath(ApiController, 'getGroupProducts'), '/group')
    })
  })
})
