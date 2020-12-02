import { Config } from '@foal/core'
import fetch = require('node-fetch')

export async function fetchIikoMenu() {
  const url = Config.get('ssd')
  const method = 'PATCH'

  const res: Response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: { token: 'dsdsd' },
  })
  if (!res.ok) {
  }
}
