export default interface TerminalGroup {
  terminalGroupId: string
  organizationId: string
  deliveryDurationInMinutes: number
  zone: string
  deliveryServiceProductId: string
  isAlive?: boolean
}
