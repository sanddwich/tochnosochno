import PaymentType from './PaymentType'

export default interface IikoCardPayment {
  paymentTypeKind: PaymentType
  sum: number
  paymentTypeId: string
  isProcessedExternally: boolean
  number: string
}
