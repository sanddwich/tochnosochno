import { City, Terminal } from '../../entities'

export default interface IikoTerminalGroup {
  organizationId: string
  items: Terminal[]
}
