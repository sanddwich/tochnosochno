import { dependency } from '@foal/core'
import { last } from 'lodash'
import { URLSearchParams } from 'url'
import { Address } from '../entities'
import { LoggerService } from './logger.service'
const { Config } = require('@foal/core')
const fetch = require('node-fetch')

export class GeoCoder {
  @dependency
  logger: LoggerService

  private yandexApi = 'https://geocode-maps.yandex.ru/1.x/'
  private apiKey = Config.get('yandexApiKey')

  getCoordinates = async (address: Address) => {
    const geoCode = `Астрахань,+${address.street.name}+улица,+дом+${address.house}`
    const url = new URL(this.yandexApi)
    url.search = new URLSearchParams({ geocode: geoCode, apikey: this.apiKey, format: 'json' }).toString()
    try {
      const res = await fetch(url)
      const json = await res.json()
      const point: string = json.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos
      const [longitude, latitude] = point.split(' ')
      const coorinates = { latitude, longitude }
      return coorinates
    } catch (error) {
      this.logger.error('getCoordinates', error)
    }
  }
}
