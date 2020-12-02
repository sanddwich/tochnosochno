// 3p
import { scheduleJob } from 'node-schedule'
import { main as cleanPincodes } from './clean-pincodes'

export async function main(args: any) {
  scheduleJob('*/1 * * * *', () => cleanPincodes(args))

  scheduleJob('10 * * * * *', () => console.log(1111))
}
