import { getRepository } from 'typeorm'
import { Group, Product, ProductVariant, Image } from '../entities'

const fetch = require('node-fetch')
interface Organization {
  id: string
}

interface Menu {
  groups: Group[]
  products: Product[]
  revision: number
}

export class Aiiko {
  apiServer = 'https://api-ru.iiko.services/api/1'
  aiikoUser = 'website'
  aiikoPassword = 'd3b2c9bc'
  token = ''
  organizations: Organization[]

  tokenUrl = `${this.apiServer}/access_token`
  organizationUrl = `${this.apiServer}/organizations`

  async getPaymentTypes() {
    if (!this.token) {
      await this.getToken()
    }
    if (!this.organizations) {
      await this.getOrganization()
    }
    console.log(this.organizations)
    const paymnetTypeUrl = `${this.apiServer}/payment_types`
    const res = await fetch(paymnetTypeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({ organizationIds: [this.organizations[0].id] }),
    })

    const paymentTypes = await res.json()
    console.log(paymentTypes)
  }

  async getMenu() {
    if (!this.token) {
      await this.getToken()
    }
    if (!this.organizations) {
      await this.getOrganization()
    }
    const menuUrl = `${this.apiServer}/nomenclature`
    const res = await fetch(menuUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({ organizationId: this.organizations[0].id }),
    })
    const menu: Menu = await res.json()
    console.log(menu)

    // const formattedGroups = menu.groups.map((group: Group) => {
    //   group.images = ''
    //   if (group.additionalInfo) {
    //     group.additionalInfo = group.additionalInfo.replace(/"([^"]+(?="))"/g, '$1')
    //   }
    //   group.isIcludedInMenu = true
    //   group.name = group.name.replace(/"([^"]+(?="))"/g, '$1')
    //   return group
    // })

    // const groups = await getRepository(Group).save(formattedGroups)

    // menu.products.map(async (product: Product) => {
    //   if (product.id === '8842b207-1546-483b-945a-5eed6279139d') {
    //     product.id = '8842b207-1546-483b-945a-5eed6279139d' + Math.random().toString()
    //   }
    //   if (product.id === ' 961cbaf2-dee6-4905-a83e-77a0c4385687') {
    //     product.id = ' 961cbaf2-dee6-4905-a83e-77a0c4385687' + Math.random().toString()
    //   }
    //   if (product) product.image = ''
    //   product.name = product.name.replace(/"([^"]+(?="))"/g, '$1')
    //   if (product.images) {
    //     if (product.images.length > 0) {
    //       product.image = product.images[0].imageUrl
    //       await getRepository(Image).save(product.images)
    //     }
    //   }
    //   await getRepository(Product).save(product)
    // })
  }

  async getOrganization() {
    const res = await fetch(this.organizationUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({ organizationIds: null, returnAdditionalInfo: false, includeDisabled: false }),
    })
    const json = await res.json()
    this.organizations = json.organizations
    console.log(this.organizations)
  }

  private async getToken() {
    const res = await fetch(this.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ apiLogin: 'd3b2c9bc' }),
    })

    const json = await res.json()
    this.token = json.token
    console.log(this.token)
  }
}
