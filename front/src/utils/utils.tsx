import { group } from 'console'
import Modifier from '../Interfaces/Modifier'
import Organization from '../Interfaces/Organization'
import Product from '../Interfaces/Product'

export const precacheImages = async (srcs: string[]) => {
  const promises = await srcs.map((src) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.src = src

      img.onload = () => resolve(src)
      img.onerror = () => reject()
    })
  })
  await Promise.all(promises)
}

export const getRequiredGroupModifiers = (product: Product): Modifier[] => {
  let requiredGroupModifiers: Modifier[] = []
  const groupModifiers = product.groupModifiers

  groupModifiers.map((groupModifier) => {
    let groupModifierAdded = false
    if (groupModifier.required) {
      groupModifier.childModifiers.map((childModifier: Modifier) => {
        if (childModifier.product.sizePrices[0].price.currentPrice === 0 && !groupModifierAdded) {
          requiredGroupModifiers.push(childModifier)
          groupModifierAdded = true
        }
      })
    }
  })
  return requiredGroupModifiers
}

export const getRequiredModifiers = (product: Product): Modifier[] => {
  let requiredModifiers: Modifier[] = []
  const modifiers = product.modifiers
  const groupModifiers = product.groupModifiers

  modifiers.map((modifier) => {
    if (modifier.required) {
      requiredModifiers.push(modifier)
    }
  })

  groupModifiers.map((groupModifier) => {
    if (groupModifier.required) {
      groupModifier.childModifiers[0].product.price === 0 && requiredModifiers.push(groupModifier.childModifiers[0])
    }
  })

  return requiredModifiers
}

export const getCurrentOrganization = (organizations: Organization[], organizationId: string) => {
  return organizations.find((organization) => organization.id === organizationId)
}
