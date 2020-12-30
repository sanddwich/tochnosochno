import { Config } from '@foal/core'
import fetch from 'node-fetch'

export async function fetchIikoMenu() {
  const url = Config.get('ssd')
  const method = 'PATCH'

  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  })
  if (!res.ok) {
  }
}
