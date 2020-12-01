import IikoErrorType from './IikoErrorType'

export default interface IikoErrorInfo {
  code: IikoErrorType
  message: string
  description: string
  additionalData: string
}
