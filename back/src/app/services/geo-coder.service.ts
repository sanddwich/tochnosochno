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
  private dadataApi = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/geolocate/address'
  private apiKey = Config.get('yandexApiKey')
  private dadataKey = Config.get('dadataApiKey')

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

  getYandexGeo = async (coordinates: number[]) => {
    const geoCode = `${coordinates[1]},${coordinates[0]}`
    const url = new URL(this.yandexApi)
    url.search = new URLSearchParams({
      geocode: geoCode,
      apikey: this.apiKey,
      type: 'house',
      format: 'json',
      spn: '0.01,0.01',
      rspn: '0',
    }).toString()
    try {
      const res = await fetch(url)
      const json = await res.json()
      const geoCoderMetaData =
        json.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData
      const address: string = geoCoderMetaData.text
      let house: string = ''
      let street: string = ''
      let city: string = ''

      const components: { kind: 'locality' | 'street' | 'house'; name: string }[] = geoCoderMetaData.Address.Components
      components.map((component) => {
        if (component.kind === 'locality') {
          city = component.name
        }
        if (component.kind === 'street') {
          street = component.name
        }
        if (component.kind === 'house') {
          house = component.name
        }
      })

      // const daData = await this.getDaDataGeo(coordinates)

      return { address, city, street, house }
    } catch (error) {
      this.logger.error('getAddress', error)
    }
  }

  getDaDataGeo = async (coordinates: number[]) => {
    try {
      const query = { lat: coordinates[0], lon: coordinates[1], count: 1, radius_meters: 50 }
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: 'Token ' + this.dadataKey,
        },
        body: JSON.stringify(query),
      }
      const res = await fetch(this.dadataApi, options)
      const { suggestions } = await res.json()
      if (suggestions.length > 0) {
        const address = suggestions[0].value
        const city = suggestions[0].data.city
        const street = suggestions[0].data.street
        const house =
          suggestions[0].data.house + (suggestions[0].data.block_type || '') + (suggestions[0].data.block || '')
        const daData = suggestions[0]
        return { address, city, street, house, daData }
      }
    } catch (error) {
      console.log(error)
      this.logger.error('getClassifierId', error)
    }
  }
}
