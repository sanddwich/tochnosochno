import PaymentType from './PaymentType'

export default interface CashPayment {
  paymentTypeKind: PaymentType
  sum: number
  paymentTypeId: string
  isProcessedExternally: boolean
}
