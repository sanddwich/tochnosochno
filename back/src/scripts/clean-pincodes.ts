import { createConnection } from 'typeorm'
import { PinCode } from '../app/entities'

export async function main(args: any) {
  const connection = await createConnection()

  try {
    console.log(
      await connection
        .createQueryBuilder()
        .delete()
        .from(PinCode)
        .where('TIMESTAMPDIFF(SECOND, expiresIn, CURRENT_TIMESTAMP + INTERVAL 1 HOUR) > 160')
        .execute()
    )
    console.log('Pincodes are cleaned!')
  } catch (error) {
    console.log(error.message)
  } finally {
    await connection.close()
  }
}
