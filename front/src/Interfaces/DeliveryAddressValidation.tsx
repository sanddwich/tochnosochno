export interface DeliveryAddressValidation {
  name: string
  required: boolean
  minLength: number
  touched: boolean
  isValid: boolean
}