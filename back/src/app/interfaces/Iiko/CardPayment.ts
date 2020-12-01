import PaymentType from './PaymentType'

export default interface CardPayment {
  paymentTypeKind: PaymentType
  sum: number
  paymentTypeId: string
  isProcessedExternally: boolean
  number: string
}
