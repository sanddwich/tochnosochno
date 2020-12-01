import { Context } from '@foal/core/lib/core/http/contexts'

const getClientIp = (ctx: Context): string => {
  return (
    (ctx.request.headers['x-forwarded-for'] || '').split(',').pop().trim() ||
    ctx.request.connection.remoteAddress ||
    ctx.request.socket.remoteAddress ||
    (ctx.request.connection.socket ? ctx.request.connection.socket.remoteAddress : null)
  )
}

export default getClientIp
